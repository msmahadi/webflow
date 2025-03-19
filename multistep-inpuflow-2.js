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

  // Hide all steps
  function hideAllSteps() {
    steps.forEach((step) => (step.style.display = 'none'));
  }

  // Modified showStep: display the active step and disable inputs in all other (hidden) steps
  function showStep(index) {
    hideAllSteps();
    steps[index].style.display = 'block';
    // Enable inputs in the active step and disable inputs in hidden steps
    steps.forEach((step, idx) => {
      const inputs = step.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        if (idx === index) {
          input.disabled = false;
        } else {
          input.disabled = true;
        }
      });
    });
  }

  // Initially display the first step
  showStep(currentStepIndex);

  // Prevent form submission via Enter key on non-final steps
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
    // Only allow normal submission on the final step so Webflow handles the submission and success message.
    if (!currentStep.hasAttribute('data-final')) {
      e.preventDefault();
      return;
    }
    // On final step, let Webflow handle the submission.
  });
});
