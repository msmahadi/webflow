document.addEventListener('DOMContentLoaded', function () {
  // Radio button functionality (do not change)
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

  // Multi-step form functionality (do not change)
  const steps = document.querySelectorAll('.step');
  const nextButtons = document.querySelectorAll("[data-step='next-button']");
  const backButton = document.querySelector('#back-button');
  const form = document.getElementById('multiStepForm');
  const errorMessageDiv = document.getElementById('error-message');
  let currentStepIndex = 0;
  const historyStack = [];

  function hideAllSteps() {
    steps.forEach((step) => (step.style.display = 'none'));
  }

  function showStep(index) {
    hideAllSteps();
    steps[index].style.display = 'block';
  }

  showStep(currentStepIndex);

  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const currentStep = steps[currentStepIndex];
      if (!currentStep.hasAttribute('data-final')) {
        e.preventDefault();
      }
    }
  });

  nextButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const currentStep = steps[currentStepIndex];
      const requiredFields = currentStep.querySelectorAll('[required]');
      let allFilled = true;
      requiredFields.forEach((field) => {
        if (field.type === 'radio') {
          const radios = currentStep.querySelectorAll(`input[name="${field.name}"]`);
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

  backButton.addEventListener('click', function () {
    if (historyStack.length > 0) {
      currentStepIndex = historyStack.pop();
      showStep(currentStepIndex);
    }
  });

  // Allow form submission normally via Webflow (only prevent if not on final step)
  form.addEventListener('submit', function (e) {
    const currentStep = steps[currentStepIndex];
    if (!currentStep.hasAttribute('data-final')) {
      e.preventDefault();
      return;
    }
    // When on final step, allow normal submission so that Webflow handles it and shows its success message.
  });
});
