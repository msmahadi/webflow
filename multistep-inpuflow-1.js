document.addEventListener('DOMContentLoaded', function () {
  const steps = document.querySelectorAll('.step');
  const nextButtons = document.querySelectorAll("[data-step='next-button']");
  const backButton = document.querySelector('#back-button');
  const submitButtons = document.querySelectorAll('.submit-button');
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

  // Enter key দিয়ে সাবমিশন রোধ (final step ছাড়া)
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
        setTimeout(() => (errorMessageDiv.innerText = ''), 3000);
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

  // Submit Button Event (for all final steps)
  submitButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      errorMessageDiv.innerText = 'Form submitted successfully!';
      setTimeout(() => (errorMessageDiv.innerText = ''), 3000);
      form.reset();
      currentStepIndex = 0;
      historyStack.length = 0;
      showStep(currentStepIndex);
    });
  });
});
