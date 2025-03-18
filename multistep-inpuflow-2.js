document.addEventListener('DOMContentLoaded', function () {
  // Only modify radio button functionality: 
  // When a radio button is selected, add the "is-active-radio" class to its parent label
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', function () {
      const name = radio.getAttribute('name');
      const group = document.querySelectorAll(`input[name="${name}"]`);
      group.forEach((item) => {
        if (
          item.parentElement &&
          item.parentElement.classList.contains('if_fom-radio-btn')
        ) {
          item.parentElement.classList.remove('is-active-radio');
        }
      });
      if (
        radio.checked &&
        radio.parentElement &&
        radio.parentElement.classList.contains('if_fom-radio-btn')
      ) {
        radio.parentElement.classList.add('is-active-radio');
      }
    });
  });

  // The rest of your code (DO NOT DELETE OR CHANGE ANYTHING ELSE)
  const steps = document.querySelectorAll('.step');
  const nextButtons = document.querySelectorAll("[data-step='next-button']");
  const backButton = document.querySelector('#back-button');
  const form = document.getElementById('multiStepForm');
  const errorMessageDiv = document.getElementById('error-message');
  let currentStepIndex = 0;
  const historyStack = [];

  // সব স্টেপ হাইড করা
  function hideAllSteps() {
    steps.forEach((step) => (step.style.display = 'none'));
  }

  // নির্দিষ্ট স্টেপ দেখানো
  function showStep(index) {
    hideAllSteps();
    steps[index].style.display = 'block';
  }

  // প্রথম স্টেপ দেখানো
  showStep(currentStepIndex);

  // non-final স্টেপে Enter key চাপলে সাবমিশন রোধ করা
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const currentStep = steps[currentStepIndex];
      if (!currentStep.hasAttribute('data-final')) {
        e.preventDefault();
      }
    }
  });

  // Next Button Event
  nextButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const currentStep = steps[currentStepIndex];
      const requiredFields = currentStep.querySelectorAll('[required]');
      let allFilled = true;
      requiredFields.forEach((field) => {
        if (field.type === 'radio') {
          const radios = currentStep.querySelectorAll(
            `input[name="${field.name}"]`
          );
          let checked = false;
          radios.forEach((radio) => {
            if (radio.checked) checked = true;
          });
          if (!checked) allFilled = false;
        } else if (field.value.trim() === '') {
          allFilled = false;
        }
      });
      if (!allFilled) {
        errorMessageDiv.innerText = 'অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন!';
        setTimeout(() => {
          errorMessageDiv.innerText = '';
        }, 3000);
        return;
      }

      let nextStepNumber = this.dataset.next;
      if (!nextStepNumber) {
        const selectedInput = currentStep.querySelector(
          "input:checked, textarea, input[type='text'], input[type='email']"
        );
        if (selectedInput && selectedInput.dataset.next) {
          nextStepNumber = selectedInput.dataset.next;
        } else {
          nextStepNumber = parseInt(currentStep.dataset.step) + 1;
        }
      }

      const nextStepIndex = Array.from(steps).findIndex(
        (step) => step.dataset.step == nextStepNumber
      );
      if (nextStepIndex !== -1) {
        historyStack.push(currentStepIndex);
        currentStepIndex = nextStepIndex;
        showStep(currentStepIndex);
      }
    });
  });

  // Back Button Event
  backButton.addEventListener('click', function () {
    if (historyStack.length > 0) {
      currentStepIndex = historyStack.pop();
      showStep(currentStepIndex);
    }
  });

  // Form submit event listener (final step submission)
  form.addEventListener('submit', function (e) {
    const currentStep = steps[currentStepIndex];
    // শুধুমাত্র final step (data-final attribute যুক্ত) এ সাবমিশন অনুমোদিত
    if (!currentStep.hasAttribute('data-final')) {
      e.preventDefault();
      return;
    }
    e.preventDefault(); // default submission রোধ করা (Webflow এ যদি AJAX বা অন্যভাবে সাবমিট করতে চাও, সেটি এখানে যুক্ত করো)
    errorMessageDiv.innerText = 'Form submitted successfully!';
    setTimeout(() => {
      errorMessageDiv.innerText = '';
    }, 3000);
    form.reset();
    currentStepIndex = 0;
    historyStack.length = 0;
    showStep(currentStepIndex);
  });
});
