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

  // Modified showStep: display the active step and disable inputs in all other steps
  function showStep(index) {
    steps.forEach((step, idx) => {
      if (idx === index) {
        step.style.display = 'block';
        // Enable all inputs in the active step
        step.querySelectorAll('input, select, textarea').forEach((input) => {
          input.disabled = false;
        });
      } else {
        step.style.display = 'none';
        // Disable all inputs in inactive steps so that they won't trigger validation
        step.querySelectorAll('input, select, textarea').forEach((input) => {
          input.disabled = true;
        });
      }
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

  // Next Button Event – allow navigation even if required fields are empty
  nextButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const currentStep = steps[currentStepIndex];
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
    // Allow normal submission only on the final step so that Webflow handles submission and success message.
    if (!currentStep.hasAttribute('data-final')) {
      e.preventDefault();
      return;
    }
    // Before submission, ensure that all inputs in inactive steps are disabled (should already be the case)
    steps.forEach((step, idx) => {
      if (idx !== currentStepIndex) {
        step.querySelectorAll('input, select, textarea').forEach((input) => {
          input.disabled = true;
        });
      }
    });
    // Let Webflow handle the submission naturally.
  });
});
