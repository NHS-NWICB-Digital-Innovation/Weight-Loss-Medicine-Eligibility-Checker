# WordPress Files for NHS Eligibility Checker

This folder contains the files needed for WordPress implementation of the NHS Weight Loss Medicine Eligibility Checker.

## Files Included

### 1. `eligibility-checker.js`
The JavaScript file containing all the calculator logic and functionality.

**Installation:**
- Copy this file to `wp-content/themes/your-theme/js/eligibility-checker.js`
- For child themes: `wp-content/themes/your-child-theme/js/eligibility-checker.js`

### 2. `functions-template.php`
Template code for enqueuing the JavaScript file in WordPress.

**Installation:**
1. Open this file in a text editor
2. Copy the `nhs_eligibility_checker_scripts()` function
3. Paste into your theme's `functions.php` file
4. Adjust the page slug if needed (default: `weight-loss-eligibility-checker`)

**For child themes:** Use the alternative code provided in the comments.

### 3. `custom-html-block.html`
Contains all the CSS styling and HTML structure for the calculator.

**Installation:**
1. Create a new WordPress page
2. Add a "Custom HTML" block (Gutenberg block editor)
3. Open this file and copy all contents
4. Paste into the Custom HTML block
5. Publish the page

## Quick Start Guide

### Step 1: Upload JavaScript
```
WordPress Dashboard → Appearance → Theme File Editor
Or via FTP/cPanel:
wp-content/themes/your-theme/js/eligibility-checker.js
```

### Step 2: Add PHP Code
```
WordPress Dashboard → Appearance → Theme File Editor → functions.php
Add the code from functions-template.php
```

### Step 3: Create Page
```
WordPress Dashboard → Pages → Add New
- Title: "Weight Loss Medicine Eligibility Checker"
- Slug: weight-loss-eligibility-checker
- Add Custom HTML block with contents from custom-html-block.html
- Publish
```

## File Locations

### In Your WordPress Installation:
```
wp-content/
├── themes/
│   └── your-theme/
│       ├── functions.php (add code from functions-template.php)
│       └── js/
│           └── eligibility-checker.js (copy from this folder)
```

### WordPress Page:
```
WordPress Page Editor
└── Custom HTML Block
    └── Contents of custom-html-block.html
```

## Verification

After installation, verify everything works:

1. **Visit the page** in your browser
2. **Open Developer Tools** (F12) → Console tab
3. **Check for JavaScript errors** (should be none)
4. **Test functionality:**
   - Click through all steps
   - Try BMI calculation (metric and imperial)
   - Verify results display
   - Test print functionality
   - Click header title to reset

## Updating the Calculator

### To Update JavaScript Logic:
1. Edit `eligibility-checker.js` in your theme folder
2. Increment version number in `functions.php`:
   ```php
   '1.0.0'  // Change to '1.0.1', '1.1.0', etc.
   ```
3. Clear browser and server caches

### To Update CSS/HTML:
1. Edit the Custom HTML block in WordPress page editor
2. Changes are immediately applied
3. No cache clearing needed for content changes

## Troubleshooting

### JavaScript Not Loading
- Check the page slug matches the conditional in `functions.php`
- Verify file path: `wp-content/themes/your-theme/js/eligibility-checker.js`
- Check browser console for 404 errors
- Clear WordPress caching plugins

### Calculator Not Working
- Open browser console (F12) and check for JavaScript errors
- Verify Custom HTML block content is complete
- Check for theme/plugin conflicts (disable plugins one by one)
- Ensure no other scripts are conflicting with global variables

### Styling Issues
- Check for theme CSS conflicts
- Add `!important` to critical styles if needed
- Verify Custom HTML block contains all CSS
- Test with browser developer tools to identify conflicts

## Support

For detailed implementation instructions, see the main README.md in the parent directory.

## Version Control

When making changes:
1. **JavaScript changes**: Update `eligibility-checker.js` and version number
2. **Content changes**: Update Custom HTML block in WordPress
3. **Commit both** to version control with clear commit messages

---

**Developed by:** Norfolk & Waveney ICB Medicines Optimisation
**Last Updated:** January 2025
