let currentStep = 'start';
let answers = {
    ethnicity: null,
    bmi: null,
    comorbidities: {
        ascvd: false,
        hypertension: false,
        dyslipidaemia: false,
        osa: false,
        diabetes: false
    },
    previousAttempts: null
};
let bmiMethod = 'calculate';
let unitSystem = 'metric';
let ageBasedIneligible = false;

const steps = ['start', 'age', 'ethnicity', 'bmi', 'comorbidities', 'previousAttempts', 'result'];

function getAdjustedBmiThreshold(threshold) {
    const lowerThresholdEthnicities = ['south_asian', 'chinese', 'other_asian', 'middle_eastern', 'black_african', 'african_caribbean'];
    if (answers.ethnicity && lowerThresholdEthnicities.includes(answers.ethnicity)) {
        return threshold - 2.5;
    }
    return threshold;
}

function countQualifyingComorbidities() {
    return Object.values(answers.comorbidities).filter(Boolean).length;
}

function lbsToKg(lbs) {
    return lbs * 0.453592;
}

function feetInchesToCm(feet, inches) {
    const totalInches = (feet * 12) + inches;
    return totalInches * 2.54;
}

function switchBmiMethod(method) {
    bmiMethod = method;

    const calculateTab = document.getElementById('calculate-tab');
    const manualTab = document.getElementById('manual-tab');
    const calculatorMode = document.getElementById('calculator-mode');
    const manualMode = document.getElementById('manual-mode');

    if (method === 'calculate') {
        calculateTab.className = 'bmi-tab active';
        manualTab.className = 'bmi-tab';
        calculatorMode.style.display = 'block';
        manualMode.style.display = 'none';
        calculatorMode.className = 'fade-in';
    } else {
        calculateTab.className = 'bmi-tab';
        manualTab.className = 'bmi-tab active';
        calculatorMode.style.display = 'none';
        manualMode.style.display = 'block';
        manualMode.className = 'fade-in';
    }

    updateBmiDisplay();
    updateUI();
}

function handleToggleKeydown(event, toggleId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleUnits();
    }
}

function toggleUnits() {
    unitSystem = unitSystem === 'metric' ? 'imperial' : 'metric';

    const toggle = document.getElementById('unit-toggle');
    const toggleImperial = document.getElementById('unit-toggle-imperial');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const metricLabelInMetricView = document.querySelector('#metric-inputs #metric-label');
    const imperialLabelInMetricView = document.querySelector('#metric-inputs #imperial-label');
    const metricLabelInImperialView = document.querySelector('#imperial-inputs .compact-unit-labels span:first-child');
    const imperialLabelInImperialView = document.querySelector('#imperial-inputs .compact-unit-labels span:last-child');


    if (unitSystem === 'imperial') {
        toggle.classList.add('active');
        toggle.setAttribute('aria-checked', 'true');
        if (toggleImperial) {
            toggleImperial.classList.add('active');
            toggleImperial.setAttribute('aria-checked', 'true');
        }

        if(metricLabelInMetricView) metricLabelInMetricView.classList.remove('active');
        if(imperialLabelInMetricView) imperialLabelInMetricView.classList.add('active');

        metricInputs.style.display = 'none';
        imperialInputs.style.display = 'block';

        document.getElementById('weight-input').value = '';
        document.getElementById('height-input').value = '';
    } else {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-checked', 'false');
        if (toggleImperial) {
            toggleImperial.classList.remove('active');
            toggleImperial.setAttribute('aria-checked', 'false');
        }

        if(metricLabelInImperialView) metricLabelInImperialView.classList.add('active');
        if(imperialLabelInImperialView) imperialLabelInImperialView.classList.remove('active');

        metricInputs.style.display = 'block';
        imperialInputs.style.display = 'none';

        document.getElementById('weight-lbs-input').value = '';
        document.getElementById('height-ft-input').value = '';
        document.getElementById('height-in-input').value = '';
    }

    updateBmiDisplay();
    updateUI();
}

function handleBmiInput() {
    const inputs = document.querySelectorAll('#calculator-mode .modern-input');
    inputs.forEach(input => {
        input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

        input.classList.remove('error', 'success');
        if (input.value && parseFloat(input.value) > 0) {
            input.classList.add('success');
        } else if (input.value && parseFloat(input.value) <= 0 && input.value !== '') {
            input.classList.add('error');
        }
    });

    updateBmiDisplay();
    updateUI();
}

function handleManualBmiInput() {
    const input = document.getElementById('manual-bmi-input');

    input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    const value = input.value;

    input.classList.remove('error', 'success');
    if (value && parseFloat(value) > 0) {
        input.classList.add('success');
        answers.bmi = parseFloat(value);
    } else if (value && parseFloat(value) <= 0 && value !== '') {
        input.classList.add('error');
        answers.bmi = null;
    } else {
        answers.bmi = null;
    }

    updateBmiDisplay();
    updateUI();
}

function calculateBmiFromInputs() {
    let weight, height;

    if (unitSystem === 'metric') {
        weight = parseFloat(document.getElementById('weight-input').value) || 0;
        height = parseFloat(document.getElementById('height-input').value) || 0;
    } else {
        const weightLbs = parseFloat(document.getElementById('weight-lbs-input').value) || 0;
        const feet = parseFloat(document.getElementById('height-ft-input').value) || 0;
        const inches = parseFloat(document.getElementById('height-in-input').value) || 0;

        weight = lbsToKg(weightLbs);
        height = feetInchesToCm(feet, inches);
    }

    if (weight > 0 && height > 0) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return parseFloat(bmi.toFixed(1));
    }

    return null;
}

function getBmiCategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', class: 'underweight' };
    if (bmi < 25) return { category: 'Normal weight', class: 'normal' };
    if (bmi < 30) return { category: 'Overweight', class: 'overweight' };
    if (bmi < 35) return { category: 'Obese', class: 'obese' };
    return { category: 'Severely obese', class: 'obese' };
}

function updateBmiDisplay() {
    const resultCard = document.getElementById('bmi-result');
    const bmiDisplay = document.getElementById('bmi-display');
    const categoryDisplay = document.getElementById('bmi-category');

    let bmi = null;

    if (bmiMethod === 'calculate') {
        bmi = calculateBmiFromInputs();
        if (bmi) {
            answers.bmi = bmi;
            const manualBmiInputField = document.getElementById('manual-bmi-input');
            if (manualBmiInputField) manualBmiInputField.value = bmi;
        } else {
            answers.bmi = null;
        }
    } else {
        const manualBmiInputField = document.getElementById('manual-bmi-input');
        if (manualBmiInputField && manualBmiInputField.value) {
            bmi = parseFloat(manualBmiInputField.value);
            answers.bmi = bmi > 0 ? bmi : null;
        } else {
            answers.bmi = null;
        }
    }


    if (answers.bmi && answers.bmi > 0) {
        const categoryInfo = getBmiCategory(answers.bmi);

        bmiDisplay.textContent = answers.bmi;
        categoryDisplay.textContent = categoryInfo.category;

        resultCard.className = `bmi-result-card show ${categoryInfo.class}`;
        resultCard.style.display = 'block';
    } else {
        bmiDisplay.textContent = '--';
        categoryDisplay.textContent = 'BMI Category';
        resultCard.className = 'bmi-result-card';
        resultCard.style.display = 'none';
        if (bmiMethod === 'calculate') {
            answers.bmi = null;
        }
    }
    updateUI();
}

function showStep(stepName) {
    steps.forEach(step => {
        const element = document.getElementById(`step-${step}`);
        if (element) {
            element.classList.add('hidden');
        }
    });

    const currentElement = document.getElementById(`step-${stepName}`);
    if (currentElement) {
        currentElement.classList.remove('hidden');
        if (currentElement.scrollTop > 0) {
            currentElement.scrollTop = 0;
        } else if (document.querySelector('.calculator-container').scrollTop > 0) {
            document.querySelector('.calculator-container').scrollTop = 0;
        }
    }

    currentStep = stepName;

    if (stepName === 'result') {
        updateResult();
    }

    updateProgressBar();
}

function startAssessment() {
    showStep('age');
}

function goToNextStep() {
    if (currentStep === 'age' && ageBasedIneligible) {
        showStep('result');
        return;
    }

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
        showStep(steps[currentIndex + 1]);
    }
}

function goToPrevStep() {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
        showStep(steps[currentIndex - 1]);
    }
}

function resetForm() {
    answers = {
        ethnicity: null,
        bmi: null,
        comorbidities: {
            ascvd: false,
            hypertension: false,
            dyslipidaemia: false,
            osa: false,
            diabetes: false
        },
        previousAttempts: null
    };
    bmiMethod = 'calculate';
    unitSystem = 'metric';
    ageBasedIneligible = false;

    document.querySelectorAll('input').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
            input.classList.remove('error', 'success');
        }
    });

    switchBmiMethod('calculate');
    const unitToggle = document.getElementById('unit-toggle');
    const unitToggleImperial = document.getElementById('unit-toggle-imperial');
    if (unitSystem === 'imperial') {
        toggleUnits();
    } else {
        if (unitToggle) unitToggle.classList.remove('active');
        if (unitToggleImperial) unitToggleImperial.classList.remove('active');
        document.getElementById('metric-inputs').style.display = 'block';
        document.getElementById('imperial-inputs').style.display = 'none';
        const metricLabelInMetricView = document.querySelector('#metric-inputs #metric-label');
        const imperialLabelInMetricView = document.querySelector('#metric-inputs #imperial-label');
        if(metricLabelInMetricView) metricLabelInMetricView.classList.add('active');
        if(imperialLabelInMetricView) imperialLabelInMetricView.classList.remove('active');
    }


    document.getElementById('bmi-result').style.display = 'none';
    document.getElementById('bmi-display').textContent = '--';
    document.getElementById('bmi-category').textContent = 'BMI Category';


    document.getElementById('age-select').value = "";
    document.getElementById('ethnicity-select').value = "";
    document.getElementById('attempts-select').value = "";

    const conditionCountEl = document.getElementById('condition-count');
    if(conditionCountEl) conditionCountEl.textContent = '0';

    updateUI();
    showStep('start');
}

function handleAgeChange() {
    const selectElement = document.getElementById('age-select');
    const selectedValue = selectElement.value;
    const nextBtn = document.getElementById('age-next-btn');

    if (selectedValue) {
        if (selectedValue === 'under18') {
            ageBasedIneligible = true;
        } else {
            ageBasedIneligible = false;
            answers.age = selectedValue;
        }
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

function handleEthnicityChange() {
    const selectElement = document.getElementById('ethnicity-select');
    const selectedValue = selectElement.value;
    if (selectedValue) {
        answers.ethnicity = selectedValue;
    } else {
        answers.ethnicity = null;
    }
    updateUI();
}

function handleComorbidityChange() {
    const checkboxes = document.querySelectorAll('input[name="comorbidities"]');

    Object.keys(answers.comorbidities).forEach(key => {
        answers.comorbidities[key] = false;
    });

    checkboxes.forEach((checkbox) => {
        if(checkbox.checked) {
            answers.comorbidities[checkbox.value] = true;
        }
    });

    updateUI();
}

function handlePreviousAttemptsChange() {
    const selectElement = document.getElementById('attempts-select');
    const selectedValue = selectElement.value;

    if (selectedValue) {
        answers.previousAttempts = selectedValue === 'true';
        updateUI();
    }
}

function handleBmiSubmit() {
    if (answers.bmi && answers.bmi > 0) {
        goToNextStep();
    } else {
        alert('Please enter or calculate a valid BMI value before continuing.');
    }
}

function updateUI() {
    const ethnicityNote = document.getElementById('ethnicity-note');
    const ethnicityNextBtn = document.getElementById('ethnicity-next-btn');

    if (ethnicityNote && ethnicityNextBtn) {
        const lowerThresholdEthnicities = ['south_asian', 'chinese', 'other_asian', 'middle_eastern', 'black_african', 'african_caribbean'];

        if (answers.ethnicity && lowerThresholdEthnicities.includes(answers.ethnicity)) {
            ethnicityNote.classList.remove('hidden');
        } else {
            ethnicityNote.classList.add('hidden');
        }

        ethnicityNextBtn.disabled = answers.ethnicity === null;
    }

    const bmiNextBtn = document.getElementById('bmi-next-btn');
    if (bmiNextBtn) {
        bmiNextBtn.disabled = !(answers.bmi && answers.bmi > 0);
    }

    const conditionCountEl = document.getElementById('condition-count');
    if (conditionCountEl) {
        const newCount = countQualifyingComorbidities();
        if (conditionCountEl.textContent !== newCount.toString()) {
            conditionCountEl.style.transform = 'scale(1.2)';
            setTimeout(() => {
                conditionCountEl.textContent = newCount;
                conditionCountEl.style.transform = 'scale(1)';
            }, 100);
        }
    }

    const attemptsNextBtn = document.getElementById('attempts-next-btn');
    if (attemptsNextBtn) {
        attemptsNextBtn.disabled = answers.previousAttempts === null;
    }

    updateTimelineBMI();

    if (currentStep === 'result') {
        updateResult();
    }
}

function updateTimelineBMI() {
    const timelineBmi1 = document.getElementById('timeline-bmi-1');
    const timelineBmi2a = document.getElementById('timeline-bmi-2a');
    const timelineBmi2b = document.getElementById('timeline-bmi-2b');
    const timelineBmi3 = document.getElementById('timeline-bmi-3');

    if(timelineBmi1) timelineBmi1.textContent = getAdjustedBmiThreshold(40);
    if(timelineBmi2a) timelineBmi2a.textContent = getAdjustedBmiThreshold(35);
    if(timelineBmi2b) timelineBmi2b.textContent = getAdjustedBmiThreshold(39.9);
    if(timelineBmi3) timelineBmi3.textContent = getAdjustedBmiThreshold(40);
}

function updateResult() {
    const resultContent = document.getElementById('result-content');
    const printDate = document.getElementById('print-date');

    if (printDate) {
        printDate.textContent = new Date().toLocaleDateString('en-GB');
    }

    if (ageBasedIneligible) {
        let html = '<div class="result-box warning">';
        html += '<h3>You are not eligible for tirzepatide (Mounjaro)</h3>';
        html += '<div style="margin-top: 16px;">';
        html += '<p><strong>Age:</strong> You must be over the age of 18 to be eligible for NHS weight loss medications.</p>';
        html += '<p style="margin-top: 12px;">Please speak with your GP or healthcare provider about appropriate weight management support for your age group.</p>';
        html += '</div>';
        html += '</div>';
        resultContent.innerHTML = html;
        document.querySelector('.timeline-box').style.display = 'none';
        return;
    }

    const eligibilityResult = determineEligibilityAndCohort();
    const comorbidityCount = countQualifyingComorbidities();
    const selectedConditions = getSelectedConditions();

    const timelineBox = document.querySelector('.timeline-box');
    if (timelineBox) {
        if (eligibilityResult.eligible && eligibilityResult.cohort === "1") {
            timelineBox.style.display = 'none';
        } else {
            timelineBox.style.display = 'block';
        }
    }

    let resultClass = 'warning';
    if (eligibilityResult.eligible) {
        if (eligibilityResult.cohort === '1') {
            resultClass = 'success';
        } else if (eligibilityResult.cohort === '2' || eligibilityResult.cohort === '3') {
            resultClass = 'orange';
        }
    }


    let html = '<div class="result-box ' + resultClass + '">';
    html += '<h3>';
    if (eligibilityResult.eligible) {
        html += 'You may be eligible for tirzepatide';
        if (eligibilityResult.cohort !== '1') {
            html += ' in the future';
        };
    } else {
        html += 'You may not currently be eligible for tirzepatide (Mounjaro)';
    }
    html += '</h3>';
    html += '<div style="margin-top: 16px;">';


    html += '<p><strong>BMI:</strong> ' + (answers.bmi || 'Not provided');
    if (answers.ethnicity && ['south_asian', 'chinese', 'other_asian', 'middle_eastern', 'black_african', 'african_caribbean'].includes(answers.ethnicity)) {
        html += ' (adjusted thresholds apply for your ethnic background).';
    } else {
        html += '.';
    }
    html += '</p>';

    html += '<p><strong>Qualifying conditions:</strong> You have ' + comorbidityCount + ' out of 5 qualifying conditions.</p>';

    if (answers.previousAttempts === false) {
        html += '<p><strong>Previous Weight Loss Attempts:</strong> You indicated you have not made serious attempts to lose weight through lifestyle changes. NHS guidelines require this before prescribing weight loss medication.</p>';
    } else if (answers.previousAttempts === true) {
        html += '<p><strong>Previous Weight Loss Attempts:</strong> You indicated you have made serious attempts to lose weight through lifestyle changes.</p>';
    }


    if (selectedConditions.length > 0) {
        html += '<div class="selected-conditions">';
        html += '<h4>Your Selected Qualifying Conditions:</h4>';
        html += '<ul class="condition-list">';
        selectedConditions.forEach(condition => {
            html += '<li>' + condition + '</li>';
        });
        html += '</ul>';
        html += '</div>';
    }


    if (eligibilityResult.eligible) {
        html += '<div class="cohort-info">';
        html += '<p><strong>Cohort ' + eligibilityResult.cohort + ' - ' + eligibilityResult.year + '</strong></p>';
        html += '<p style="margin-top: 8px;">';
        html += 'You meet the criteria for ' + eligibilityResult.year + ' with ' + comorbidityCount + ' qualifying ';
        html += 'conditions and a BMI of ' + answers.bmi + '.';
        html += '</p>';
        html += '<p style="margin-top: 8px;">';

        if (eligibilityResult.cohort === '1') {
            html += '<strong>Next steps:</strong> Speak with your GP about your weight management ';
            html += 'options. Access to tirzepatide is subject to the phased rollout ';
            html += 'and local service capacity.';
        } else if (eligibilityResult.cohort === '2') {
            html += '<strong>Next steps:</strong> You may be eligible from June 2026. Access will be subject to the phased rollout ';
            html += 'and local service capacity. Discuss with your GP closer to this time if appropriate.';
        } else if (eligibilityResult.cohort === '3') {
            html += '<strong>Next steps:</strong> You may be eligible from April 2027. Access will be subject to the phased rollout ';
            html += 'and local service capacity. Discuss with your GP closer to this time if appropriate.';
        }

        html += '</p>';
        html += '</div>';
    } else if (!eligibilityResult.eligible && answers.previousAttempts === true) {
        html += '<div class="cohort-info" style="border-color: #FFB81C;">';
        html += '<p style="font-weight: 500;">Potential future eligibility (based on timeline):</p>';
        let potentialShown = false;

        if (comorbidityCount >= 4 && answers.bmi >= getAdjustedBmiThreshold(35) && answers.bmi < getAdjustedBmiThreshold(40)) {
            html += '<p style="margin-top: 4px;">• With ' + comorbidityCount + ' conditions and BMI ' + answers.bmi + ', you might meet criteria for Year 2 (2026/27).</p>';
            potentialShown = true;
        }
        if (comorbidityCount >= 3 && answers.bmi >= getAdjustedBmiThreshold(40)) {
            html += '<p style="margin-top: 4px;">• With ' + comorbidityCount + ' conditions and BMI ' + answers.bmi + ', you might meet criteria for Year 3 (2027/28) if not Year 1.</p>';
            potentialShown = true;
        }
        if (!potentialShown) {
            html += '<p style="margin-top: 4px;">Based on your current BMI and number of conditions, you do not appear to meet the criteria for the phased rollout timeline. Please discuss other weight management options with your GP.</p>';
        }
        html += '</div>';
    }


    html += '</div>';
    html += '</div>';

    resultContent.innerHTML = html;
}


function determineEligibilityAndCohort() {
    const hasMadePreviousAttempts = answers.previousAttempts;
    const comorbidityCount = countQualifyingComorbidities();
    const bmi = answers.bmi;

    if (!bmi || bmi <=0) {
        return { eligible: false, cohort: null, year: null };
    }

    if (hasMadePreviousAttempts === false) {
        return { eligible: false, cohort: null, year: null, reason: "previousAttempts" };
    }

    const year1BmiThreshold = getAdjustedBmiThreshold(40);
    if (comorbidityCount >= 4 && bmi >= year1BmiThreshold && hasMadePreviousAttempts) {
        return { eligible: true, cohort: "1", year: "Year 1 (2025/26)"};
    }

    const year2LowerBmi = getAdjustedBmiThreshold(35);
    const year2UpperBmi = getAdjustedBmiThreshold(39.9);
    if (comorbidityCount >= 4 && bmi >= year2LowerBmi && bmi <= year2UpperBmi && hasMadePreviousAttempts) {
        return { eligible: true, cohort: "2", year: "Year 2 (2026/27)"};
    }

    const year3BmiThreshold = getAdjustedBmiThreshold(40);
    if (comorbidityCount === 3 && bmi >= year3BmiThreshold && hasMadePreviousAttempts) {
        return { eligible: true, cohort: "3", year: "Year 3 (2027/28)"};
    }

    return { eligible: false, cohort: null, year: null };
}


function updateProgressBar() {
    const currentStepIndex = steps.indexOf(currentStep);
    const totalProgressSteps = 5;

    let progressPercentage = 0;

    if (currentStep === 'start') {
        progressPercentage = 0;
    } else if (currentStep === 'result' || ageBasedIneligible) {
        progressPercentage = 100;
    } else {
        const progressOrder = ['age', 'ethnicity', 'bmi', 'comorbidities', 'previousAttempts'];
        const progressStepIndex = progressOrder.indexOf(currentStep);
        if (progressStepIndex !== -1) {
            progressPercentage = ((progressStepIndex ) / totalProgressSteps) * 100;
        }
    }

    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercentageElement = document.getElementById('progress-percentage');

    if (progressBarFill) {
        progressBarFill.style.width = `${Math.max(0, Math.min(100, progressPercentage))}%`;
    }
    if (progressPercentageElement) {
        progressPercentageElement.textContent = `${Math.round(Math.max(0, Math.min(100, progressPercentage)))}%`;
    }
}

function getSelectedConditions() {
    const conditionMap = {
        'ascvd': 'Heart disease',
        'hypertension': 'High blood pressure',
        'dyslipidaemia': 'High cholesterol',
        'osa': 'Obstructive sleep apnoea',
        'diabetes': 'Type 2 diabetes'
    };

    const selectedConditions = [];
    for (const [key, value] of Object.entries(answers.comorbidities)) {
        if (value) {
            selectedConditions.push(conditionMap[key]);
        }
    }
    return selectedConditions;
}

function printResults() {
    window.print();
}

document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    updateProgressBar();

    switchBmiMethod('calculate');
    if (unitSystem === 'imperial') {
        toggleUnits();
    } else {
        const unitToggle = document.getElementById('unit-toggle');
        if (unitToggle) unitToggle.classList.remove('active');
        document.getElementById('metric-inputs').style.display = 'block';
        document.getElementById('imperial-inputs').style.display = 'none';
        const metricLabelInMetricView = document.querySelector('#metric-inputs #metric-label');
        const imperialLabelInMetricView = document.querySelector('#metric-inputs #imperial-label');
        if(metricLabelInMetricView) metricLabelInMetricView.classList.add('active');
        if(imperialLabelInMetricView) imperialLabelInMetricView.classList.remove('active');
    }
    updateBmiDisplay();
});
