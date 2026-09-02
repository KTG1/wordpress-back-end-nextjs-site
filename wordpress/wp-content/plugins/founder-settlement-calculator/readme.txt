=== Founder Settlement Calculator Configuration ===
Contributors: KTG1
Requires at least: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Provides the WordPress configuration screen and public REST endpoint used by The Founder Site's Next.js settlement calculator.

== Features ==

* Settings page at Settings > Settlement Calculator
* Enable or disable the public calculator
* Choose currency and starting values
* Configure five injury-impact ranges
* Configure the possible-fault slider
* Maintain the required educational disclaimer
* Public configuration endpoint at /wp-json/founder-settlement/v1/config

== Installation ==

1. Upload founder-settlement-calculator.zip from Plugins > Add New > Upload Plugin.
2. Activate Founder Settlement Calculator Configuration.
3. Open Settings > Settlement Calculator.
4. Save the desired defaults and assumptions.
5. Confirm the REST endpoint shown at the bottom of the settings screen is available publicly.

The Next.js application should set WORDPRESS_PUBLIC_URL to this WordPress site's public origin. It refreshes calculator configuration from the REST endpoint approximately once per minute.

== Important ==

This plugin configures an educational planning tool. It does not provide legal advice, calculate a case's value, or apply jurisdiction-specific law.
