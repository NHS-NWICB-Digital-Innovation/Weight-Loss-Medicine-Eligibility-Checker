<?php
/**
 * NHS Weight Loss Medicine Eligibility Checker - WordPress Integration
 *
 * Add this code to your theme's functions.php file or create a custom plugin.
 *
 * Instructions:
 * 1. Upload eligibility-checker.js to your theme's js/ directory
 * 2. Add this code to functions.php (or use a child theme)
 * 3. Create a WordPress page with slug: weight-loss-eligibility-checker
 * 4. Add the CSS/HTML from custom-html-block.html to a Custom HTML block
 *
 * File locations:
 * - Standard theme: wp-content/themes/your-theme/js/eligibility-checker.js
 * - Child theme: wp-content/themes/your-child-theme/js/eligibility-checker.js
 */

function nhs_eligibility_checker_scripts() {
    // Only load on the eligibility checker page
    // Change 'weight-loss-eligibility-checker' to match your page slug
    if (is_page('weight-loss-eligibility-checker')) {

        // For standard themes
        wp_enqueue_script(
            'nhs-eligibility-checker',                              // Handle (unique identifier)
            get_template_directory_uri() . '/js/eligibility-checker.js', // Path to JS file
            array(),                                                 // Dependencies (none)
            '1.0.0',                                                // Version number
            true                                                     // Load in footer
        );

        // FOR CHILD THEMES: Use this instead (uncomment the lines below)
        /*
        wp_enqueue_script(
            'nhs-eligibility-checker',
            get_stylesheet_directory_uri() . '/js/eligibility-checker.js',
            array(),
            '1.0.0',
            true
        );
        */
    }
}
add_action('wp_enqueue_scripts', 'nhs_eligibility_checker_scripts');