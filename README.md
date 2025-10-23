# NHS Weight Loss Medicine Eligibility Checker

An interactive web-based tool for assessing potential eligibility for tirzepatide (Mounjaro) weight management treatment under NHS England's phased rollout programme. 

[View example](https://andy.charlwood.xyz/widget/NHSEligibilityChecker.html),  note this is hosted on a personal website and is for demonstration purposes only, it should not be embedded on any NHS website. Please follow the instructions below.

## Overview

This self-contained HTML application helps patients and healthcare professionals understand eligibility criteria for NHS weight loss medications based on the latest interim guidance. The tool implements the phased rollout timeline (2025-2028) with automated cohort determination.

**Developed by:** Norfolk & Waveney ICB Medicines Optimisation

## Features

- **Parameter Verification**: Verifies each parameter to understand priority in relation to NHS England's phased implementation rollout plan
- **Cohort Determination**: Automatically assigns eligibility to Year 1, 2, or 3 cohorts based on criteria
- **Step-by-Step Workflow**: Guided assessment with progress tracking
- **Printable Results**: Final results can be printed to support discussion between patient and clinician
- **Self-Contained**: Single HTML file - no external dependencies
- **Accessibility**: WCAG 2.1 compliant with ARIA labels and keyboard navigation

## Installation & Deployment

### WordPress Implementation

#### Step 1: Upload JavaScript File

1. **Upload the JavaScript file** to your theme directory:
   - Copy `WordPress Files/eligibility-checker.js` to `wp-content/themes/your-theme/js/`
   - Create the `js` folder if it doesn't exist

2. **Add the enqueue code** to your theme's `functions.php`:
   - Open `WordPress Files/functions-template.php`
   - Copy the `nhs_eligibility_checker_scripts()` function
   - Paste into your theme's `functions.php` file
   - Adjust the page slug if needed (default: `weight-loss-eligibility-checker`)

   **For child themes**, use the child theme version in the comments.

#### Step 2: Add CSS and HTML via Custom HTML Block

1. **Create a new WordPress page:**
   - Go to Pages → Add New
   - Title: "Weight Loss Medicine Eligibility Checker"
   - Permalink/slug should be: `weight-loss-eligibility-checker` (to match the PHP conditional above)

2. **Add a Custom HTML block:**
   - Click the "+" button to add a block
   - Search for "Custom HTML" and select it

3. **Paste the CSS and HTML:**
   - Open `WordPress Files/custom-html-block.html`
   - Copy the entire contents
   - Paste into the Custom HTML block in WordPress

4. **Publish the page**

### Alternative Deployment (Non-WordPress)

For static websites or other platforms:

1. Download `EligibilityChecker.html`
2. Upload to your web server
3. Link directly or embed via iframe:

```html
<iframe src="path/to/EligibilityChecker.html"
        width="100%"
        height="850px"
        frameborder="0"
        title="NHS Weight Loss Medicine Eligibility Checker">
</iframe>
```

### Local Testing

Simply open `EligibilityChecker.html` in any modern browser (Chrome, Firefox, Safari, Edge).

## Important Disclaimers

⚠️ **This tool is for informational purposes only and does not replace professional medical advice.**

- Eligibility criteria are based on interim NHS England guidance and may be updated
- Patients must discuss all treatment options with qualified healthcare professionals
- This tool assesses eligibility for **weight management** only, not diabetes treatment

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles for screen readers
- Keyboard navigation support (Tab, Enter, Space)
- High contrast ratios meeting WCAG AA standards

## Data Privacy/Information governanc

- **No data collection**: All calculations performed client-side
- **No external requests**: Fully self-contained with no analytics or tracking
- **No cookies**: No data stored between sessions
- **Print-only output**: Results exist only in browser memory unless printed

## License

This tool is provided for use within NHS organizations and partner services. Please maintain attribution to NHS Norfolk & Waveney Integrated Care Board when adapting for local use.

## Support & Contact

For questions about local implementation please speak to your digital/communications team. For clinical guidance, contact your ICB Medicines Optimisation team.
