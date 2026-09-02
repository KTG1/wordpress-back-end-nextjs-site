<?php
/**
 * Plugin Name: Founder Settlement Calculator Configuration
 * Description: Manages the public configuration used by The Founder Site's Next.js settlement calculator.
 * Version: 1.0.0
 * Author: KTG1
 * License: GPL-2.0-or-later
 * Text Domain: founder-settlement-calculator
 */

if (!defined('ABSPATH')) {
    exit;
}

const FSC_OPTION_KEY = 'founder_settlement_calculator_settings';
const FSC_REST_NAMESPACE = 'founder-settlement/v1';

function fsc_default_settings(): array
{
    return [
        'enabled' => true,
        'currency' => 'USD',
        'max_amount' => 100000000,
        'default_values' => [
            'medical' => 18500,
            'futureMedical' => 6000,
            'lostIncome' => 4200,
            'property' => 3500,
            'other' => 750,
        ],
        'default_impact' => 2,
        'default_fault' => 0,
        'max_fault' => 80,
        'fault_step' => 5,
        'impact_bands' => [
            [
                'label' => 'Minor',
                'detail' => 'Short recovery and limited treatment',
                'low' => 0.5,
                'high' => 1.25,
            ],
            [
                'label' => 'Moderate',
                'detail' => 'Weeks of treatment or disruption',
                'low' => 1,
                'high' => 2.25,
            ],
            [
                'label' => 'Significant',
                'detail' => 'Long recovery or lasting symptoms',
                'low' => 1.75,
                'high' => 3.5,
            ],
            [
                'label' => 'Severe',
                'detail' => 'Major treatment or long-term effects',
                'low' => 2.75,
                'high' => 4.75,
            ],
            [
                'label' => 'Catastrophic',
                'detail' => 'Permanent, life-changing injury',
                'low' => 4,
                'high' => 6.5,
            ],
        ],
        'disclaimer' => 'This tool does not apply state law, policy limits, damage caps, liens, fees, coverage disputes, evidence quality, or individual facts. It is educational software—not legal advice, a case valuation, or a promise of recovery.',
    ];
}

function fsc_get_settings(): array
{
    $saved = get_option(FSC_OPTION_KEY, []);

    if (!is_array($saved)) {
        $saved = [];
    }

    return array_replace_recursive(fsc_default_settings(), $saved);
}

function fsc_number($value, float $minimum, float $maximum, float $fallback): float
{
    if (!is_numeric($value)) {
        return $fallback;
    }

    return min($maximum, max($minimum, (float) $value));
}

function fsc_sanitize_settings($input): array
{
    $defaults = fsc_default_settings();
    $input = is_array($input) ? $input : [];
    $allowed_currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'TRY'];
    $currency = isset($input['currency']) ? strtoupper(sanitize_text_field($input['currency'])) : $defaults['currency'];

    if (!in_array($currency, $allowed_currencies, true)) {
        $currency = $defaults['currency'];
    }

    $max_amount = fsc_number(
        $input['max_amount'] ?? $defaults['max_amount'],
        1000,
        1000000000,
        $defaults['max_amount']
    );

    $default_values = [];

    foreach ($defaults['default_values'] as $key => $fallback) {
        $default_values[$key] = fsc_number(
            $input['default_values'][$key] ?? $fallback,
            0,
            $max_amount,
            $fallback
        );
    }

    $impact_bands = [];

    foreach ($defaults['impact_bands'] as $index => $fallback) {
        $candidate = isset($input['impact_bands'][$index]) && is_array($input['impact_bands'][$index])
            ? $input['impact_bands'][$index]
            : [];
        $label = sanitize_text_field($candidate['label'] ?? $fallback['label']);
        $detail = sanitize_text_field($candidate['detail'] ?? $fallback['detail']);
        $low = fsc_number($candidate['low'] ?? $fallback['low'], 0, 20, $fallback['low']);
        $high = fsc_number($candidate['high'] ?? $fallback['high'], 0, 20, $fallback['high']);

        if ($high < $low) {
            $high = $low;
        }

        $impact_bands[] = [
            'label' => $label !== '' ? $label : $fallback['label'],
            'detail' => $detail !== '' ? $detail : $fallback['detail'],
            'low' => $low,
            'high' => $high,
        ];
    }

    $max_fault = (int) fsc_number(
        $input['max_fault'] ?? $defaults['max_fault'],
        0,
        100,
        $defaults['max_fault']
    );
    $fault_step = (int) fsc_number(
        $input['fault_step'] ?? $defaults['fault_step'],
        1,
        25,
        $defaults['fault_step']
    );
    $default_fault = (int) fsc_number(
        $input['default_fault'] ?? $defaults['default_fault'],
        0,
        $max_fault,
        $defaults['default_fault']
    );
    $default_impact = (int) fsc_number(
        $input['default_impact'] ?? $defaults['default_impact'],
        0,
        count($impact_bands) - 1,
        $defaults['default_impact']
    );
    $disclaimer = sanitize_textarea_field($input['disclaimer'] ?? $defaults['disclaimer']);

    return [
        'enabled' => !empty($input['enabled']),
        'currency' => $currency,
        'max_amount' => $max_amount,
        'default_values' => $default_values,
        'default_impact' => $default_impact,
        'default_fault' => $default_fault,
        'max_fault' => $max_fault,
        'fault_step' => $fault_step,
        'impact_bands' => $impact_bands,
        'disclaimer' => $disclaimer !== '' ? $disclaimer : $defaults['disclaimer'],
    ];
}

function fsc_register_settings(): void
{
    register_setting(
        'founder_settlement_calculator',
        FSC_OPTION_KEY,
        [
            'type' => 'array',
            'sanitize_callback' => 'fsc_sanitize_settings',
            'default' => fsc_default_settings(),
        ]
    );
}
add_action('admin_init', 'fsc_register_settings');

function fsc_add_settings_page(): void
{
    add_options_page(
        __('Settlement Calculator', 'founder-settlement-calculator'),
        __('Settlement Calculator', 'founder-settlement-calculator'),
        'manage_options',
        'founder-settlement-calculator',
        'fsc_render_settings_page'
    );
}
add_action('admin_menu', 'fsc_add_settings_page');

function fsc_render_number_input(string $path, $value, string $step = '1', string $min = '0', string $max = ''): void
{
    ?>
    <input
        class="small-text"
        type="number"
        name="<?php echo esc_attr(FSC_OPTION_KEY . $path); ?>"
        value="<?php echo esc_attr((string) $value); ?>"
        step="<?php echo esc_attr($step); ?>"
        min="<?php echo esc_attr($min); ?>"
        <?php echo $max !== '' ? 'max="' . esc_attr($max) . '"' : ''; ?>
    >
    <?php
}

function fsc_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $settings = fsc_get_settings();
    $money_fields = [
        'medical' => __('Medical expenses', 'founder-settlement-calculator'),
        'futureMedical' => __('Expected future care', 'founder-settlement-calculator'),
        'lostIncome' => __('Lost income', 'founder-settlement-calculator'),
        'property' => __('Property damage', 'founder-settlement-calculator'),
        'other' => __('Other documented costs', 'founder-settlement-calculator'),
    ];
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Settlement Calculator', 'founder-settlement-calculator'); ?></h1>
        <p><?php esc_html_e('These values are published through the WordPress REST API and used by the Next.js calculator. Changes normally appear on the frontend within about one minute.', 'founder-settlement-calculator'); ?></p>

        <?php settings_errors(); ?>

        <form action="options.php" method="post">
            <?php settings_fields('founder_settlement_calculator'); ?>

            <h2><?php esc_html_e('Availability and display', 'founder-settlement-calculator'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><?php esc_html_e('Calculator status', 'founder-settlement-calculator'); ?></th>
                    <td>
                        <input type="hidden" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[enabled]" value="0">
                        <label>
                            <input type="checkbox" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[enabled]" value="1" <?php checked($settings['enabled']); ?>>
                            <?php esc_html_e('Show the calculator on the Next.js frontend', 'founder-settlement-calculator'); ?>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="fsc-currency"><?php esc_html_e('Currency', 'founder-settlement-calculator'); ?></label></th>
                    <td>
                        <select id="fsc-currency" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[currency]">
                            <?php foreach (['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'TRY'] as $currency) : ?>
                                <option value="<?php echo esc_attr($currency); ?>" <?php selected($settings['currency'], $currency); ?>><?php echo esc_html($currency); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Maximum field value', 'founder-settlement-calculator'); ?></th>
                    <td><?php fsc_render_number_input('[max_amount]', $settings['max_amount'], '1000', '1000', '1000000000'); ?></td>
                </tr>
            </table>

            <h2><?php esc_html_e('Starting values', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Visitors can change these values; they are only the figures shown when the calculator first opens or is reset.', 'founder-settlement-calculator'); ?></p>
            <table class="form-table" role="presentation">
                <?php foreach ($money_fields as $key => $label) : ?>
                    <tr>
                        <th scope="row"><?php echo esc_html($label); ?></th>
                        <td><?php fsc_render_number_input('[default_values][' . $key . ']', $settings['default_values'][$key], '100', '0'); ?></td>
                    </tr>
                <?php endforeach; ?>
                <tr>
                    <th scope="row"><?php esc_html_e('Default impact band', 'founder-settlement-calculator'); ?></th>
                    <td>
                        <select name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[default_impact]">
                            <?php foreach ($settings['impact_bands'] as $index => $band) : ?>
                                <option value="<?php echo esc_attr((string) $index); ?>" <?php selected($settings['default_impact'], $index); ?>><?php echo esc_html($band['label']); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Default possible fault', 'founder-settlement-calculator'); ?></th>
                    <td><?php fsc_render_number_input('[default_fault]', $settings['default_fault'], '1', '0', '100'); ?>%</td>
                </tr>
            </table>

            <h2><?php esc_html_e('Impact bands', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Each band applies its low-to-high multiplier to medical expenses plus expected future care.', 'founder-settlement-calculator'); ?></p>
            <table class="widefat striped" style="max-width: 1100px; margin-top: 12px;">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Label', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Explanation', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Low', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('High', 'founder-settlement-calculator'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($settings['impact_bands'] as $index => $band) : ?>
                        <tr>
                            <td><input type="text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[impact_bands][<?php echo esc_attr((string) $index); ?>][label]" value="<?php echo esc_attr($band['label']); ?>"></td>
                            <td><input class="large-text" type="text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[impact_bands][<?php echo esc_attr((string) $index); ?>][detail]" value="<?php echo esc_attr($band['detail']); ?>"></td>
                            <td><?php fsc_render_number_input('[impact_bands][' . $index . '][low]', $band['low'], '0.05', '0', '20'); ?></td>
                            <td><?php fsc_render_number_input('[impact_bands][' . $index . '][high]', $band['high'], '0.05', '0', '20'); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <h2><?php esc_html_e('Fault control', 'founder-settlement-calculator'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><?php esc_html_e('Maximum possible fault', 'founder-settlement-calculator'); ?></th>
                    <td><?php fsc_render_number_input('[max_fault]', $settings['max_fault'], '1', '0', '100'); ?>%</td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Slider step', 'founder-settlement-calculator'); ?></th>
                    <td><?php fsc_render_number_input('[fault_step]', $settings['fault_step'], '1', '1', '25'); ?>%</td>
                </tr>
            </table>

            <h2><?php esc_html_e('Required disclaimer', 'founder-settlement-calculator'); ?></h2>
            <textarea class="large-text" rows="5" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[disclaimer]"><?php echo esc_textarea($settings['disclaimer']); ?></textarea>

            <?php submit_button(); ?>
        </form>

        <hr>
        <h2><?php esc_html_e('Connection status', 'founder-settlement-calculator'); ?></h2>
        <p>
            <?php esc_html_e('Public configuration endpoint:', 'founder-settlement-calculator'); ?>
            <a href="<?php echo esc_url(rest_url(FSC_REST_NAMESPACE . '/config')); ?>" target="_blank" rel="noreferrer noopener"><?php echo esc_html(rest_url(FSC_REST_NAMESPACE . '/config')); ?></a>
        </p>
    </div>
    <?php
}

function fsc_public_configuration(): array
{
    $settings = fsc_get_settings();

    return [
        'version' => 1,
        'enabled' => (bool) $settings['enabled'],
        'currency' => $settings['currency'],
        'maxAmount' => (float) $settings['max_amount'],
        'defaultValues' => array_map('floatval', $settings['default_values']),
        'defaultImpact' => (int) $settings['default_impact'],
        'defaultFault' => (int) $settings['default_fault'],
        'maxFault' => (int) $settings['max_fault'],
        'faultStep' => (int) $settings['fault_step'],
        'impactBands' => array_map(
            static function (array $band): array {
                return [
                    'label' => $band['label'],
                    'detail' => $band['detail'],
                    'low' => (float) $band['low'],
                    'high' => (float) $band['high'],
                ];
            },
            $settings['impact_bands']
        ),
        'disclaimer' => $settings['disclaimer'],
    ];
}

function fsc_register_rest_route(): void
{
    register_rest_route(
        FSC_REST_NAMESPACE,
        '/config',
        [
            'methods' => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback' => static function (): WP_REST_Response {
                $response = new WP_REST_Response(fsc_public_configuration());
                $response->header('Cache-Control', 'public, max-age=60, s-maxage=300');

                return $response;
            },
        ]
    );
}
add_action('rest_api_init', 'fsc_register_rest_route');
