# NHS Weight Loss Medicine Eligibility Checker

An interactive web-based tool for assessing potential eligibility for tirzepatide (Mounjaro) weight management treatment under NHS England's phased rollout programme.

## Overview

This self-contained HTML application helps patients and healthcare professionals understand eligibility criteria for NHS weight loss medications based on the latest interim guidance. The tool implements the phased rollout timeline (2025-2028) with automated cohort determination.

**Developed by:** Norfolk & Waveney ICB Medicines Optimisation

## Features

### Core Functionality
- **Age Verification**: Ensures patients meet minimum age requirements
- **BMI Calculator**: Dual-mode calculator supporting both metric and imperial units
- **Ethnicity-Adjusted Thresholds**: Automatically applies 2.5 kg/m² lower BMI thresholds for specific ethnic groups
- **Comorbidity Assessment**: Tracks 5 qualifying health conditions (cardiovascular disease, hypertension, dyslipidaemia, OSA, type 2 diabetes)
- **Previous Attempts Verification**: Validates lifestyle intervention requirements
- **Cohort Determination**: Automatically assigns eligibility to Year 1, 2, or 3 cohorts based on criteria

### User Experience
- **Progressive Workflow**: Step-by-step guided assessment with progress tracking
- **Instant Reset**: Click the header title to restart at any time
- **Print-Friendly Results**: Generate patient-friendly summaries for GP consultations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **NHS Branding**: Full compliance with NHS visual identity guidelines

### Technical Features
- **Self-Contained**: Single HTML file - no external dependencies
- **Accessibility**: WCAG 2.1 compliant with ARIA labels and keyboard navigation
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Print Optimization**: Automatic formatting for printed output

## Phased Rollout Timeline

### Year 1 (2025/26)
- **Criteria**: ≥4 qualifying conditions AND BMI ≥40 (or ≥37.5 for adjusted ethnicities)
- **Target**: Patients with highest clinical need

### Year 2 (2026/27)
- **Criteria**: ≥4 qualifying conditions AND BMI 35-39.9 (or 32.5-37.4 for adjusted ethnicities)
- **Target**: Expanded access to high-need patients

### Year 3 (2027/28)
- **Criteria**: ≥3 qualifying conditions AND BMI ≥40 (or ≥37.5 for adjusted ethnicities)
- **Target**: Broader eligibility criteria

## Ethnicity-Adjusted Thresholds

The following ethnic groups receive 2.5 kg/m² lower BMI thresholds in accordance with NICE guidance:
- South Asian (Indian, Pakistani, Bangladeshi, Sri Lankan)
- Chinese
- Other Asian
- Middle Eastern
- Black African
- African-Caribbean

## Qualifying Health Conditions

1. **Cardiovascular Disease**: Established heart disease, peripheral vascular disease, or heart failure
2. **Hypertension**: High blood pressure requiring medication
3. **Dyslipidaemia**: High cholesterol treated with medication or confirmed diagnosis
4. **Obstructive Sleep Apnoea**: Confirmed by sleep study and requiring treatment (e.g., CPAP)
5. **Type 2 Diabetes**: Established diagnosis

## Installation & Deployment

### Simple Deployment
1. Download `EligibilityChecker.html`
2. Host on any web server or open directly in a browser
3. No build process, dependencies, or configuration required

### WordPress Implementation

#### Method 1: Direct Page Embedding (Recommended)
1. **Upload the HTML file:**
   - Go to WordPress Dashboard → Media → Add New
   - Upload `EligibilityChecker.html`
   - Copy the file URL (e.g., `https://yoursite.nhs.uk/wp-content/uploads/2025/01/EligibilityChecker.html`)

2. **Create a new page:**
   - Go to Pages → Add New
   - Add a title (e.g., "Weight Loss Medicine Eligibility Checker")
   - Switch to the Code/HTML editor (not Visual editor)

3. **Add the iframe code:**
   ```html
   <iframe src="https://yoursite.nhs.uk/wp-content/uploads/2025/01/EligibilityChecker.html"
           width="100%"
           height="850px"
           frameborder="0"
           style="border: none; display: block; margin: 0 auto; max-width: 100%;"
           title="NHS Weight Loss Medicine Eligibility Checker">
   </iframe>

   <script>
   // Auto-adjust iframe height
   window.addEventListener('message', function(e) {
       if (e.data.type === 'resize') {
           document.querySelector('iframe').style.height = e.data.height + 'px';
       }
   });
   </script>
   ```

4. **Publish the page**

#### Method 2: Custom HTML Block (WordPress 5.0+)
1. Create a new page or edit an existing one
2. Add a "Custom HTML" block
3. Paste the iframe code above
4. Preview and publish

#### Method 3: Shortcode Method (for multiple pages)
1. **Add to your theme's `functions.php`:**
   ```php
   function nhs_eligibility_checker_shortcode($atts) {
       $atts = shortcode_atts(array(
           'height' => '850px',
           'url' => get_site_url() . '/wp-content/uploads/EligibilityChecker.html'
       ), $atts);

       return '<iframe src="' . esc_url($atts['url']) . '"
                       width="100%"
                       height="' . esc_attr($atts['height']) . '"
                       frameborder="0"
                       style="border: none; display: block; margin: 0 auto; max-width: 100%;"
                       title="NHS Weight Loss Medicine Eligibility Checker">
               </iframe>';
   }
   add_shortcode('nhs_eligibility_checker', 'nhs_eligibility_checker_shortcode');
   ```

2. **Use the shortcode in any page or post:**
   ```
   [nhs_eligibility_checker]
   ```

   Or with custom height:
   ```
   [nhs_eligibility_checker height="900px"]
   ```

#### Method 4: Full Page Template (Advanced)
For a completely seamless integration without iframe:

1. **Create a custom page template** (`page-eligibility-checker.php`):
   ```php
   <?php
   /*
   Template Name: Eligibility Checker Full Page
   */

   // Read the HTML file content
   $file_path = get_template_directory() . '/eligibility-checker/EligibilityChecker.html';
   $content = file_get_contents($file_path);

   // Extract just the widget content (between <div class="tirzepatide-calculator-widget"> tags)
   preg_match('/<script>(.*?)<\/script>/s', $content, $script_matches);
   preg_match('/<style>(.*?)<\/style>/s', $content, $style_matches);
   preg_match('/<div class="tirzepatide-calculator-widget">.*?<\/div>\s*$/s', $content, $widget_matches);

   get_header();

   // Output the extracted content
   echo '<script>' . $script_matches[1] . '</script>';
   echo '<style>' . $style_matches[1] . '</style>';
   echo $widget_matches[0];

   get_footer();
   ?>
   ```

2. **Create the page:**
   - Create a new page
   - Select "Eligibility Checker Full Page" as the template
   - Publish

#### WordPress-Specific Considerations

**Security:**
- WordPress may strip JavaScript from content - use Custom HTML blocks or upload as a media file
- Some security plugins may block iframe content - add exception rules if needed
- Ensure file permissions allow uploaded HTML files (MIME type text/html)

**Theme Compatibility:**
- Test with your NHS WordPress theme to ensure no style conflicts
- If using Method 4, ensure the widget CSS is properly namespaced (already done)
- Some themes may impose max-width constraints - adjust iframe wrapper styles

**Responsive Behavior:**
- The checker is fully responsive and works on mobile devices
- Recommended minimum iframe height: 750px for desktop, auto-adjust for mobile
- Test on various screen sizes using WordPress preview

**Performance:**
- The self-contained HTML is lightweight (~140KB)
- No external dependencies means fast loading times
- Consider enabling browser caching for the uploaded HTML file

**Plugin Conflicts:**
- Some page builders (Elementor, Divi) may have specific iframe embedding methods
- Cache plugins should work fine as the tool is client-side only
- Contact form plugins won't interfere as this tool has its own form logic

**SEO Considerations:**
- Add appropriate meta description to the WordPress page
- Use clear page title: "Weight Loss Medicine Eligibility Checker"
- Consider adding explanatory text above/below the iframe for search engines
- Mark page as "noindex" if you don't want it appearing in search results

### Embedding in Other Platforms
```html
<iframe src="path/to/EligibilityChecker.html"
        width="100%"
        height="850px"
        frameborder="0"
        title="NHS Weight Loss Medicine Eligibility Checker">
</iframe>
```

### Local Testing
Simply open the HTML file in any modern browser (Chrome, Firefox, Safari, Edge).

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Usage Guidelines

### For Patients
1. This tool provides **indicative eligibility only**
2. Meeting criteria does not guarantee treatment access
3. Final decisions depend on clinical assessment and local service capacity
4. Print your results and discuss with your GP
5. The NHS offers various weight management options beyond medication

### For Healthcare Professionals
- Use as a conversation aid during consultations
- Results should inform but not replace clinical judgment
- Consider full medical history and contraindications
- Access subject to local formulary and service availability
- Document decision-making in patient records

## Important Disclaimers

⚠️ **This tool is for informational purposes only and does not replace professional medical advice.**

- Eligibility criteria are based on interim NHS England guidance and may be updated
- Meeting criteria does not guarantee prescription or access to treatment
- Clinical discretion and local service capacity determine final access
- Patients must discuss all treatment options with qualified healthcare professionals
- This tool assesses eligibility for **weight management** only, not diabetes treatment

## Customization

### Updating Thresholds
Edit the `getAdjustedBmiThreshold()` function (line 21) to modify BMI adjustment values.

### Modifying Cohorts
Update the `determineEligibilityAndCohort()` function (line 608) to change cohort logic.

### Styling Changes
All CSS is contained within the `<style>` block (lines 712-2143). Modify CSS custom properties at the top for brand color changes:

```css
--primary-color: #005EB8;
--secondary-color: #41B6E6;
--success-color: #009639;
--warning-color: #FFB81C;
--error-color: #DA291C;
```

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles for screen readers
- Keyboard navigation support (Tab, Enter, Space)
- High contrast ratios meeting WCAG AA standards
- Responsive text sizing
- Focus indicators for interactive elements
- Clear error states and validation messages

## Data Privacy

- **No data collection**: All calculations performed client-side
- **No external requests**: Fully self-contained with no analytics or tracking
- **No cookies**: No data stored between sessions
- **Print-only output**: Results exist only in browser memory unless printed

## Development

### File Structure
```
EligibilityChecker.html
├── JavaScript (lines 1-711)
│   ├── State management
│   ├── BMI calculation logic
│   ├── Eligibility determination
│   ├── UI controllers
│   └── Form validation
├── CSS (lines 712-2143)
│   ├── NHS branding
│   ├── Responsive layouts
│   ├── Print styles
│   └── Accessibility features
└── HTML (lines 2144-2547)
    ├── Multi-step form
    ├── Progress tracking
    └── Results display
```

### Testing Checklist
- [ ] Test all BMI calculation modes (metric/imperial/manual)
- [ ] Verify ethnicity threshold adjustments
- [ ] Test all cohort determination scenarios
- [ ] Validate form reset functionality
- [ ] Check print output formatting
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Test on mobile devices
- [ ] Cross-browser compatibility check

## Version History

### v1.0.0 (Current)
- Initial release
- Implements NHSE interim guidance (2025-2028)
- Full NHS branding compliance
- Accessibility improvements
- Print optimization
- Clickable header reset functionality
- Attribution footer

## Contributing

This tool was developed for NHS Norfolk & Waveney ICB. For updates, improvements, or adaptations for other ICBs:

1. Maintain NHS branding guidelines
2. Preserve accessibility features
3. Update attribution footer appropriately
4. Test thoroughly before deployment
5. Ensure compliance with current NHSE guidance

## License

This tool is provided for use within NHS organizations and partner services. Please maintain attribution to Norfolk & Waveney ICB Medicines Optimisation when adapting for local use.

## Support & Contact

**Developed by:** Norfolk & Waveney ICB Medicines Optimisation Team

For questions about local implementation or clinical guidance, contact your ICB Medicines Optimisation team.
