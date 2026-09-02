<?php
/**
 * Plugin Name: Founder Settlement Calculator Configuration
 * Description: Manages the public configuration used by The Founder Site's Next.js settlement calculator.
 * Version: 1.1.0
 * Author: KTG1
 * License: GPL-2.0-or-later
 * Text Domain: founder-settlement-calculator
 */

if (!defined('ABSPATH')) {
    exit;
}

const FSC_OPTION_KEY = 'founder_settlement_calculator_settings';
const FSC_REST_NAMESPACE = 'founder-settlement/v1';
const FSC_VERSION = '1.1.0';

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
        'labels' => [
            'pageKicker' => 'Interactive planning worksheet',
            'pageTitle' => 'Personal injury settlement calculator',
            'pageIntro' => 'Enter documented losses, choose an injury-impact assumption, and see how a possible share of fault changes an illustrative range.',
            'pageNote' => 'The result is a transparent scenario—not legal advice, a valuation, or a guarantee.',
            'formKicker' => 'Your working figures',
            'formHeading' => 'Build a planning range',
            'resetButton' => 'Reset values',
            'financialLegend' => 'Documented financial losses',
            'assumptionsLegend' => 'Planning assumptions',
            'injuryImpact' => 'Injury impact',
            'faultShare' => 'Possible share of fault',
            'resultLabel' => 'Educational planning range',
            'resultContext' => 'Based only on the figures and assumptions entered here—not a prediction of a settlement or verdict.',
            'economicLosses' => 'Economic losses',
            'impactAssumption' => 'Impact assumption',
            'impactAmount' => 'Illustrative impact amount',
            'faultAdjustment' => 'Fault adjustment',
            'formulaSummary' => 'See the formula',
            'formulaBody' => '(Economic losses + treatment costs × impact assumption) × remaining fault percentage.',
            'copyButton' => 'Copy estimate summary',
            'copiedButton' => 'Estimate copied',
            'unavailableKicker' => 'Calculator status',
            'unavailableHeading' => 'This worksheet is temporarily unavailable.',
            'unavailableBody' => 'An administrator can enable it in WordPress under Settings → Settlement Calculator.',
            'guidanceKicker' => 'Read the result carefully',
            'guidanceHeading' => 'What this estimate can—and cannot—tell you',
            'linksKicker' => 'Continue reading',
            'linksHeading' => 'Understand the terms behind the worksheet',
            'faqKicker' => 'Questions before using the range',
            'faqHeading' => 'How to interpret this calculator',
        ],
        'money_fields' => [
            'medical' => [
                'label' => 'Medical expenses',
                'hint' => 'Paid or outstanding bills',
            ],
            'futureMedical' => [
                'label' => 'Expected future care',
                'hint' => 'Treatment that may still be needed',
            ],
            'lostIncome' => [
                'label' => 'Lost income',
                'hint' => 'Documented earnings already missed',
            ],
            'property' => [
                'label' => 'Property damage',
                'hint' => 'Vehicle and other property',
            ],
            'other' => [
                'label' => 'Other documented costs',
                'hint' => 'Travel, care, equipment, and similar expenses',
            ],
        ],
        'guidance_sections' => [
            [
                'title' => 'What it includes',
                'body' => 'The model combines the financial losses you enter with a disclosed range applied to treatment costs, then applies your selected fault adjustment.',
            ],
            [
                'title' => 'What it leaves out',
                'body' => 'State law, insurance limits, medical liens, litigation risk, evidence, credibility, fees, and the individual facts that drive real outcomes.',
            ],
            [
                'title' => 'What to do next',
                'body' => 'Verify the numbers with records, review the applicable policy and law, and obtain advice from a licensed professional before making decisions.',
            ],
        ],
        'faqs' => [
            [
                'question' => 'Is this estimate legal advice?',
                'answer' => 'No. It is an educational planning range based only on the figures and assumptions entered. A licensed professional must evaluate the facts and law that apply to a real matter.',
            ],
            [
                'question' => 'Does the calculator apply my state’s law?',
                'answer' => 'No. Negligence rules, damage limits, deadlines, insurance requirements, and available remedies vary by jurisdiction and are not applied by this worksheet.',
            ],
            [
                'question' => 'Why does the model use treatment costs?',
                'answer' => 'Treatment costs are used as a visible modeling input so the calculation can be explained. The multiplier is an assumption, not a legal rule or a promise that an insurer, judge, or jury will use it.',
            ],
            [
                'question' => 'Will an insurer offer the displayed amount?',
                'answer' => 'Not necessarily. Coverage, policy limits, liability disputes, documentation, liens, negotiation, and many other facts can materially change an outcome.',
            ],
        ],
        'internal_links' => [
            [
                'label' => 'Types of damages',
                'description' => 'Learn how economic, non-economic, and punitive damages differ.',
                'href' => '/blog/car-accident-terminology-economic-non-economic-and-punitive-damages',
            ],
            [
                'label' => 'Shared fault',
                'description' => 'Understand comparative and contributory negligence terminology.',
                'href' => '/blog/car-accident-terminology-comparative-and-contributory-negligence',
            ],
            [
                'label' => 'All terminology guides',
                'description' => 'Browse the complete car-accident terminology collection.',
                'href' => '/car-accident-terminology',
            ],
        ],
        'disclaimer' => 'This tool does not apply state law, policy limits, damage caps, liens, fees, coverage disputes, evidence quality, or individual facts. It is educational software—not legal advice, a case valuation, or a promise of recovery.',
    ];
}

function fsc_get_settings(): array
{
    $defaults = fsc_default_settings();
    $saved = get_option(FSC_OPTION_KEY, []);

    if (!is_array($saved)) {
        $saved = [];
    }

    $settings = array_replace_recursive($defaults, $saved);

    foreach (['guidance_sections', 'faqs', 'internal_links'] as $list_key) {
        if (array_key_exists($list_key, $saved) && is_array($saved[$list_key])) {
            $settings[$list_key] = array_values($saved[$list_key]);
        }
    }

    return $settings;
}

function fsc_number($value, float $minimum, float $maximum, float $fallback): float
{
    if (!is_numeric($value)) {
        return $fallback;
    }

    return min($maximum, max($minimum, (float) $value));
}

function fsc_text($value, string $fallback = '', int $maximum = 500): string
{
    if (!is_string($value)) {
        return $fallback;
    }

    $value = sanitize_textarea_field($value);

    if (function_exists('mb_substr')) {
        $value = mb_substr($value, 0, $maximum);
    } else {
        $value = substr($value, 0, $maximum);
    }

    return trim($value) !== '' ? trim($value) : $fallback;
}

function fsc_internal_path($value): string
{
    $path = fsc_text($value, '', 500);

    if ($path === '' || $path[0] !== '/' || strpos($path, '//') === 0) {
        return '';
    }

    return esc_url_raw($path);
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
    $labels = [];

    foreach ($defaults['labels'] as $key => $fallback) {
        $labels[$key] = fsc_text($input['labels'][$key] ?? $fallback, $fallback, 700);
    }

    $money_fields = [];

    foreach ($defaults['money_fields'] as $key => $fallback) {
        $money_fields[$key] = [
            'label' => fsc_text($input['money_fields'][$key]['label'] ?? $fallback['label'], $fallback['label'], 120),
            'hint' => fsc_text($input['money_fields'][$key]['hint'] ?? $fallback['hint'], $fallback['hint'], 240),
        ];
    }

    $guidance_source = isset($input['guidance_sections']) && is_array($input['guidance_sections'])
        ? array_values($input['guidance_sections'])
        : (!empty($input['guidance_sections_present']) ? [] : $defaults['guidance_sections']);
    $guidance_sections = [];

    foreach (array_slice($guidance_source, 0, 6) as $item) {
        if (!is_array($item)) {
            continue;
        }

        $title = fsc_text($item['title'] ?? '', '', 160);
        $body = fsc_text($item['body'] ?? '', '', 1200);

        if ($title !== '' && $body !== '') {
            $guidance_sections[] = ['title' => $title, 'body' => $body];
        }
    }

    $faq_source = isset($input['faqs']) && is_array($input['faqs'])
        ? array_values($input['faqs'])
        : (!empty($input['faqs_present']) ? [] : $defaults['faqs']);
    $faqs = [];

    foreach (array_slice($faq_source, 0, 12) as $item) {
        if (!is_array($item)) {
            continue;
        }

        $question = fsc_text($item['question'] ?? '', '', 220);
        $answer = fsc_text($item['answer'] ?? '', '', 2000);

        if ($question !== '' && $answer !== '') {
            $faqs[] = ['question' => $question, 'answer' => $answer];
        }
    }

    $link_source = isset($input['internal_links']) && is_array($input['internal_links'])
        ? array_values($input['internal_links'])
        : (!empty($input['internal_links_present']) ? [] : $defaults['internal_links']);
    $internal_links = [];

    foreach (array_slice($link_source, 0, 12) as $item) {
        if (!is_array($item)) {
            continue;
        }

        $label = fsc_text($item['label'] ?? '', '', 140);
        $description = fsc_text($item['description'] ?? '', '', 320);
        $href = fsc_internal_path($item['href'] ?? '');

        if ($label !== '' && $href !== '') {
            $internal_links[] = [
                'label' => $label,
                'description' => $description,
                'href' => $href,
            ];
        }
    }

    $disclaimer = fsc_text($input['disclaimer'] ?? $defaults['disclaimer'], $defaults['disclaimer'], 1000);

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
        'labels' => $labels,
        'money_fields' => $money_fields,
        'guidance_sections' => $guidance_sections,
        'faqs' => $faqs,
        'internal_links' => $internal_links,
        'disclaimer' => $disclaimer,
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

function fsc_admin_assets(string $hook_suffix): void
{
    if ($hook_suffix !== 'settings_page_founder-settlement-calculator') {
        return;
    }

    wp_enqueue_style(
        'founder-settlement-calculator-admin',
        plugin_dir_url(__FILE__) . 'assets/admin.css',
        [],
        FSC_VERSION
    );
    wp_enqueue_script(
        'founder-settlement-calculator-admin',
        plugin_dir_url(__FILE__) . 'assets/admin.js',
        [],
        FSC_VERSION,
        true
    );
}
add_action('admin_enqueue_scripts', 'fsc_admin_assets');

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
    $money_field_names = [
        'medical' => __('Medical expenses', 'founder-settlement-calculator'),
        'futureMedical' => __('Expected future care', 'founder-settlement-calculator'),
        'lostIncome' => __('Lost income', 'founder-settlement-calculator'),
        'property' => __('Property damage', 'founder-settlement-calculator'),
        'other' => __('Other documented costs', 'founder-settlement-calculator'),
    ];
    $label_names = [
        'pageKicker' => __('Page kicker', 'founder-settlement-calculator'),
        'pageTitle' => __('Page title', 'founder-settlement-calculator'),
        'pageIntro' => __('Page introduction', 'founder-settlement-calculator'),
        'pageNote' => __('Page note', 'founder-settlement-calculator'),
        'formKicker' => __('Form kicker', 'founder-settlement-calculator'),
        'formHeading' => __('Form heading', 'founder-settlement-calculator'),
        'resetButton' => __('Reset button', 'founder-settlement-calculator'),
        'financialLegend' => __('Financial fields heading', 'founder-settlement-calculator'),
        'assumptionsLegend' => __('Assumptions heading', 'founder-settlement-calculator'),
        'injuryImpact' => __('Injury-impact label', 'founder-settlement-calculator'),
        'faultShare' => __('Fault-share label', 'founder-settlement-calculator'),
        'resultLabel' => __('Result label', 'founder-settlement-calculator'),
        'resultContext' => __('Result explanation', 'founder-settlement-calculator'),
        'economicLosses' => __('Economic-losses label', 'founder-settlement-calculator'),
        'impactAssumption' => __('Impact-assumption label', 'founder-settlement-calculator'),
        'impactAmount' => __('Impact-amount label', 'founder-settlement-calculator'),
        'faultAdjustment' => __('Fault-adjustment label', 'founder-settlement-calculator'),
        'formulaSummary' => __('Formula toggle', 'founder-settlement-calculator'),
        'formulaBody' => __('Formula explanation', 'founder-settlement-calculator'),
        'copyButton' => __('Copy button', 'founder-settlement-calculator'),
        'copiedButton' => __('Copied confirmation', 'founder-settlement-calculator'),
        'unavailableKicker' => __('Unavailable kicker', 'founder-settlement-calculator'),
        'unavailableHeading' => __('Unavailable heading', 'founder-settlement-calculator'),
        'unavailableBody' => __('Unavailable explanation', 'founder-settlement-calculator'),
        'guidanceKicker' => __('Guidance kicker', 'founder-settlement-calculator'),
        'guidanceHeading' => __('Guidance heading', 'founder-settlement-calculator'),
        'linksKicker' => __('Internal-links kicker', 'founder-settlement-calculator'),
        'linksHeading' => __('Internal-links heading', 'founder-settlement-calculator'),
        'faqKicker' => __('FAQ kicker', 'founder-settlement-calculator'),
        'faqHeading' => __('FAQ heading', 'founder-settlement-calculator'),
    ];
    $long_labels = ['pageIntro', 'pageNote', 'resultContext', 'formulaBody', 'unavailableBody'];
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Settlement Calculator', 'founder-settlement-calculator'); ?></h1>
        <p><?php esc_html_e('These values are published through the WordPress REST API and used by the Next.js calculator. Changes normally appear on the frontend within about one minute.', 'founder-settlement-calculator'); ?></p>

        <?php settings_errors(); ?>

        <nav class="fsc-admin-nav" aria-label="<?php esc_attr_e('Calculator settings sections', 'founder-settlement-calculator'); ?>">
            <a href="#fsc-general"><?php esc_html_e('General', 'founder-settlement-calculator'); ?></a>
            <a href="#fsc-copy"><?php esc_html_e('Labels', 'founder-settlement-calculator'); ?></a>
            <a href="#fsc-guidance"><?php esc_html_e('Guidance', 'founder-settlement-calculator'); ?></a>
            <a href="#fsc-links"><?php esc_html_e('Internal links', 'founder-settlement-calculator'); ?></a>
            <a href="#fsc-faqs"><?php esc_html_e('FAQs', 'founder-settlement-calculator'); ?></a>
        </nav>

        <form action="options.php" method="post">
            <?php settings_fields('founder_settlement_calculator'); ?>

            <h2 id="fsc-general"><?php esc_html_e('Availability and display', 'founder-settlement-calculator'); ?></h2>
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

            <h2 id="fsc-copy"><?php esc_html_e('Page and calculator labels', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Edit the public-facing headings, explanations, and button labels without changing frontend code.', 'founder-settlement-calculator'); ?></p>
            <table class="form-table fsc-label-table" role="presentation">
                <?php foreach ($label_names as $key => $label) : ?>
                    <tr>
                        <th scope="row"><label for="fsc-label-<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></label></th>
                        <td>
                            <?php if (in_array($key, $long_labels, true)) : ?>
                                <textarea class="large-text" id="fsc-label-<?php echo esc_attr($key); ?>" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[labels][<?php echo esc_attr($key); ?>]" rows="3"><?php echo esc_textarea($settings['labels'][$key]); ?></textarea>
                            <?php else : ?>
                                <input class="regular-text" id="fsc-label-<?php echo esc_attr($key); ?>" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[labels][<?php echo esc_attr($key); ?>]" type="text" value="<?php echo esc_attr($settings['labels'][$key]); ?>">
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>

            <h2><?php esc_html_e('Financial field labels', 'founder-settlement-calculator'); ?></h2>
            <table class="widefat striped fsc-editor-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Field', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Public label', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Helper text', 'founder-settlement-calculator'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($money_field_names as $key => $field_name) : ?>
                        <tr>
                            <th scope="row"><?php echo esc_html($field_name); ?></th>
                            <td><input class="regular-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[money_fields][<?php echo esc_attr($key); ?>][label]" type="text" value="<?php echo esc_attr($settings['money_fields'][$key]['label']); ?>"></td>
                            <td><input class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[money_fields][<?php echo esc_attr($key); ?>][hint]" type="text" value="<?php echo esc_attr($settings['money_fields'][$key]['hint']); ?>"></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <h2><?php esc_html_e('Starting values', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Visitors can change these values; they are only the figures shown when the calculator first opens or is reset.', 'founder-settlement-calculator'); ?></p>
            <table class="form-table" role="presentation">
                <?php foreach ($money_field_names as $key => $label) : ?>
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

            <h2 id="fsc-guidance"><?php esc_html_e('Guidance sections', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Add up to six short sections that explain how visitors should interpret the result.', 'founder-settlement-calculator'); ?></p>
            <input type="hidden" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[guidance_sections_present]" value="1">
            <table class="widefat striped fsc-editor-table fsc-repeater">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Section title', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Section text', 'founder-settlement-calculator'); ?></th>
                        <th class="fsc-action-column"><?php esc_html_e('Action', 'founder-settlement-calculator'); ?></th>
                    </tr>
                </thead>
                <tbody data-fsc-repeater="guidance_sections" data-fsc-limit="6">
                    <?php foreach ($settings['guidance_sections'] as $index => $section) : ?>
                        <tr data-fsc-row data-fsc-index="<?php echo esc_attr((string) $index); ?>">
                            <td><input class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[guidance_sections][<?php echo esc_attr((string) $index); ?>][title]" type="text" value="<?php echo esc_attr($section['title']); ?>"></td>
                            <td><textarea class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[guidance_sections][<?php echo esc_attr((string) $index); ?>][body]" rows="3"><?php echo esc_textarea($section['body']); ?></textarea></td>
                            <td><button class="button-link-delete" data-fsc-remove type="button"><?php esc_html_e('Remove', 'founder-settlement-calculator'); ?></button></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <p><button class="button" data-fsc-add="guidance_sections" type="button"><?php esc_html_e('Add guidance section', 'founder-settlement-calculator'); ?></button></p>

            <h2 id="fsc-links"><?php esc_html_e('Internal links', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Add up to twelve useful reading paths. URLs must be internal paths beginning with a single slash, such as /car-accident-terminology.', 'founder-settlement-calculator'); ?></p>
            <input type="hidden" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links_present]" value="1">
            <table class="widefat striped fsc-editor-table fsc-repeater">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Link label', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Description', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Internal path', 'founder-settlement-calculator'); ?></th>
                        <th class="fsc-action-column"><?php esc_html_e('Action', 'founder-settlement-calculator'); ?></th>
                    </tr>
                </thead>
                <tbody data-fsc-repeater="internal_links" data-fsc-limit="12">
                    <?php foreach ($settings['internal_links'] as $index => $link) : ?>
                        <tr data-fsc-row data-fsc-index="<?php echo esc_attr((string) $index); ?>">
                            <td><input class="regular-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links][<?php echo esc_attr((string) $index); ?>][label]" type="text" value="<?php echo esc_attr($link['label']); ?>"></td>
                            <td><textarea class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links][<?php echo esc_attr((string) $index); ?>][description]" rows="2"><?php echo esc_textarea($link['description']); ?></textarea></td>
                            <td><input class="regular-text code" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links][<?php echo esc_attr((string) $index); ?>][href]" type="text" value="<?php echo esc_attr($link['href']); ?>" placeholder="/guide-path"></td>
                            <td><button class="button-link-delete" data-fsc-remove type="button"><?php esc_html_e('Remove', 'founder-settlement-calculator'); ?></button></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <p><button class="button" data-fsc-add="internal_links" type="button"><?php esc_html_e('Add internal link', 'founder-settlement-calculator'); ?></button></p>

            <h2 id="fsc-faqs"><?php esc_html_e('Frequently asked questions', 'founder-settlement-calculator'); ?></h2>
            <p class="description"><?php esc_html_e('Add up to twelve questions. They appear as accessible expandable rows beneath the calculator.', 'founder-settlement-calculator'); ?></p>
            <input type="hidden" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[faqs_present]" value="1">
            <table class="widefat striped fsc-editor-table fsc-repeater">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Question', 'founder-settlement-calculator'); ?></th>
                        <th><?php esc_html_e('Answer', 'founder-settlement-calculator'); ?></th>
                        <th class="fsc-action-column"><?php esc_html_e('Action', 'founder-settlement-calculator'); ?></th>
                    </tr>
                </thead>
                <tbody data-fsc-repeater="faqs" data-fsc-limit="12">
                    <?php foreach ($settings['faqs'] as $index => $faq) : ?>
                        <tr data-fsc-row data-fsc-index="<?php echo esc_attr((string) $index); ?>">
                            <td><input class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[faqs][<?php echo esc_attr((string) $index); ?>][question]" type="text" value="<?php echo esc_attr($faq['question']); ?>"></td>
                            <td><textarea class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[faqs][<?php echo esc_attr((string) $index); ?>][answer]" rows="4"><?php echo esc_textarea($faq['answer']); ?></textarea></td>
                            <td><button class="button-link-delete" data-fsc-remove type="button"><?php esc_html_e('Remove', 'founder-settlement-calculator'); ?></button></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <p><button class="button" data-fsc-add="faqs" type="button"><?php esc_html_e('Add FAQ', 'founder-settlement-calculator'); ?></button></p>

            <h2><?php esc_html_e('Required disclaimer', 'founder-settlement-calculator'); ?></h2>
            <textarea class="large-text" rows="5" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[disclaimer]"><?php echo esc_textarea($settings['disclaimer']); ?></textarea>

            <?php submit_button(); ?>

            <template id="fsc-template-guidance_sections">
                <tr data-fsc-row data-fsc-index="__INDEX__">
                    <td><input class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[guidance_sections][__INDEX__][title]" type="text"></td>
                    <td><textarea class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[guidance_sections][__INDEX__][body]" rows="3"></textarea></td>
                    <td><button class="button-link-delete" data-fsc-remove type="button"><?php esc_html_e('Remove', 'founder-settlement-calculator'); ?></button></td>
                </tr>
            </template>
            <template id="fsc-template-internal_links">
                <tr data-fsc-row data-fsc-index="__INDEX__">
                    <td><input class="regular-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links][__INDEX__][label]" type="text"></td>
                    <td><textarea class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links][__INDEX__][description]" rows="2"></textarea></td>
                    <td><input class="regular-text code" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[internal_links][__INDEX__][href]" type="text" placeholder="/guide-path"></td>
                    <td><button class="button-link-delete" data-fsc-remove type="button"><?php esc_html_e('Remove', 'founder-settlement-calculator'); ?></button></td>
                </tr>
            </template>
            <template id="fsc-template-faqs">
                <tr data-fsc-row data-fsc-index="__INDEX__">
                    <td><input class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[faqs][__INDEX__][question]" type="text"></td>
                    <td><textarea class="large-text" name="<?php echo esc_attr(FSC_OPTION_KEY); ?>[faqs][__INDEX__][answer]" rows="4"></textarea></td>
                    <td><button class="button-link-delete" data-fsc-remove type="button"><?php esc_html_e('Remove', 'founder-settlement-calculator'); ?></button></td>
                </tr>
            </template>
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
        'version' => 2,
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
        'labels' => $settings['labels'],
        'moneyFields' => $settings['money_fields'],
        'guidanceSections' => $settings['guidance_sections'],
        'faqs' => $settings['faqs'],
        'internalLinks' => $settings['internal_links'],
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
                $response->header('Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate');

                return $response;
            },
        ]
    );
}
add_action('rest_api_init', 'fsc_register_rest_route');
