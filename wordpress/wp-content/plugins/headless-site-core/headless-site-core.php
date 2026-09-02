<?php
/**
 * Plugin Name: Headless Site Core
 * Description: Connects WordPress content, SEO fields, and publish events to the Next.js frontend.
 * Version: 1.0.0
 * Author: KTG1
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

const HSC_REST_NAMESPACE = 'headless/v1';

function hsc_env(string $name, string $fallback = ''): string
{
    $value = getenv($name);

    return is_string($value) && $value !== '' ? $value : $fallback;
}

function hsc_frontend_url(): string
{
    return untrailingslashit(hsc_env('HEADLESS_FRONTEND_URL', 'http://localhost:3000'));
}

function hsc_content_path(WP_Post $post): string
{
    if ($post->post_type === 'post') {
        return '/blog/' . $post->post_name;
    }

    if ($post->post_type === 'page') {
        if ((int) get_option('page_on_front') === $post->ID) {
            return '/';
        }

        return '/' . trim((string) get_page_uri($post), '/');
    }

    return '/';
}

function hsc_register_rest_fields(): void
{
    foreach (['post', 'page'] as $post_type) {
        register_post_meta(
            $post_type,
            'headless_seo_title',
            [
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => static function (): bool {
                    return current_user_can('edit_posts');
                },
            ]
        );

        register_post_meta(
            $post_type,
            'headless_seo_description',
            [
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'sanitize_callback' => 'sanitize_textarea_field',
                'auth_callback' => static function (): bool {
                    return current_user_can('edit_posts');
                },
            ]
        );

        register_rest_field(
            $post_type,
            'headless_path',
            [
                'get_callback' => static function (array $object): string {
                    $post = get_post((int) $object['id']);

                    return $post instanceof WP_Post ? hsc_content_path($post) : '/';
                },
                'schema' => [
                    'description' => 'Canonical path on the Next.js frontend.',
                    'type' => 'string',
                    'context' => ['view', 'edit'],
                    'readonly' => true,
                ],
            ]
        );
    }
}
add_action('init', 'hsc_register_rest_fields');

function hsc_register_site_route(): void
{
    register_rest_route(
        HSC_REST_NAMESPACE,
        '/site',
        [
            'methods' => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback' => static function (): WP_REST_Response {
                return new WP_REST_Response(
                    [
                        'name' => get_bloginfo('name'),
                        'description' => get_bloginfo('description'),
                        'language' => get_bloginfo('language'),
                        'frontend_url' => hsc_frontend_url(),
                        'front_page_id' => (int) get_option('page_on_front'),
                        'posts_page_id' => (int) get_option('page_for_posts'),
                    ]
                );
            },
        ]
    );
}
add_action('rest_api_init', 'hsc_register_site_route');

function hsc_add_seo_meta_box(): void
{
    foreach (['post', 'page'] as $screen) {
        add_meta_box(
            'headless-seo',
            __('SEO & social preview', 'headless-site-core'),
            'hsc_render_seo_meta_box',
            $screen,
            'normal',
            'default'
        );
    }
}
add_action('add_meta_boxes', 'hsc_add_seo_meta_box');

function hsc_render_seo_meta_box(WP_Post $post): void
{
    wp_nonce_field('hsc_save_seo', 'hsc_seo_nonce');
    $title = (string) get_post_meta($post->ID, 'headless_seo_title', true);
    $description = (string) get_post_meta($post->ID, 'headless_seo_description', true);
    ?>
    <p>
        <label for="headless_seo_title"><strong><?php esc_html_e('Search title', 'headless-site-core'); ?></strong></label><br>
        <input class="widefat" id="headless_seo_title" name="headless_seo_title" type="text" maxlength="70" value="<?php echo esc_attr($title); ?>">
    </p>
    <p>
        <label for="headless_seo_description"><strong><?php esc_html_e('Search description', 'headless-site-core'); ?></strong></label><br>
        <textarea class="widefat" id="headless_seo_description" name="headless_seo_description" rows="3" maxlength="170"><?php echo esc_textarea($description); ?></textarea>
    </p>
    <p class="description"><?php esc_html_e('Next.js uses these values for page metadata. Leave either field empty to use the WordPress title or excerpt.', 'headless-site-core'); ?></p>
    <?php
}

function hsc_save_seo_meta(int $post_id): void
{
    if (
        !isset($_POST['hsc_seo_nonce'])
        || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['hsc_seo_nonce'])), 'hsc_save_seo')
        || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        || !current_user_can('edit_post', $post_id)
    ) {
        return;
    }

    $fields = [
        'headless_seo_title' => 'sanitize_text_field',
        'headless_seo_description' => 'sanitize_textarea_field',
    ];

    foreach ($fields as $field => $sanitize) {
        $value = isset($_POST[$field]) ? $sanitize(wp_unslash($_POST[$field])) : '';

        if ($value === '') {
            delete_post_meta($post_id, $field);
        } else {
            update_post_meta($post_id, $field, $value);
        }
    }
}
add_action('save_post', 'hsc_save_seo_meta');

function hsc_revalidate_on_transition(string $new_status, string $old_status, WP_Post $post): void
{
    if (
        $new_status === $old_status
        || !in_array($post->post_type, ['post', 'page'], true)
        || ($new_status !== 'publish' && $old_status !== 'publish')
        || wp_is_post_revision($post->ID)
    ) {
        return;
    }

    $secret = hsc_env('HEADLESS_REVALIDATION_SECRET');

    if ($secret === '') {
        return;
    }

    wp_remote_post(
        hsc_frontend_url() . '/api/revalidate',
        [
            'timeout' => 5,
            'headers' => ['Content-Type' => 'application/json'],
            'body' => wp_json_encode(
                [
                    'secret' => $secret,
                    'path' => hsc_content_path($post),
                    'content_type' => $post->post_type,
                    'content_id' => $post->ID,
                ]
            ),
        ]
    );
}
add_action('transition_post_status', 'hsc_revalidate_on_transition', 10, 3);

function hsc_revalidate_on_update(int $post_id, WP_Post $post): void
{
    if (
        $post->post_status !== 'publish'
        || !in_array($post->post_type, ['post', 'page'], true)
        || wp_is_post_revision($post_id)
        || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
    ) {
        return;
    }

    hsc_revalidate_on_transition('publish', 'updated', $post);
}
add_action('post_updated', 'hsc_revalidate_on_update', 10, 2);

function hsc_admin_configuration_notice(): void
{
    if (!current_user_can('manage_options') || hsc_env('HEADLESS_REVALIDATION_SECRET') !== '') {
        return;
    }
    ?>
    <div class="notice notice-warning"><p><?php esc_html_e('Headless Site Core: set HEADLESS_REVALIDATION_SECRET to revalidate Next.js when content changes.', 'headless-site-core'); ?></p></div>
    <?php
}
add_action('admin_notices', 'hsc_admin_configuration_notice');

