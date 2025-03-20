document.addEventListener("DOMContentLoaded", function () {
  // Radio & Checkbox Button Functionality (No Change)
  const radioButtons = document.querySelectorAll(
    'input[type="radio"], input[type="checkbox"]'
  );
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      const name = radio.getAttribute("name");
      const group = document.querySelectorAll(`input[name="${name}"]`);
      group.forEach((item) => {
        if (
          item.parentElement &&
          item.parentElement.classList.contains("multi-form_check-btn")
        ) {
          item.parentElement.classList.remove("is-active");
        }
      });
      if (
        radio.checked &&
        radio.parentElement &&
        radio.parentElement.classList.contains("multi-form_check-btn")
      ) {
        radio.parentElement.classList.add("is-active");
      }
    });
  });

  // Multi-step form setup
  const steps = document.querySelectorAll(".multi-form_step");
  const nextButtons = document.querySelectorAll("[data-step='next-button']");
  const backButton = document.querySelector("#back-button");
  const form = document.getElementById("multiStepForm");
  const errorMessageDiv = document.getElementById("error-message");
  let currentStepIndex = 0;
  const historyStack = [];

  // Initially hide error message
  errorMessageDiv.style.opacity = "0";

  function hideAllSteps() {
    steps.forEach((step) => (step.style.display = "none"));
  }

  function showStep(index) {
    hideAllSteps();
    steps[index].style.display = "flex";
    
    steps.forEach((step, idx) => {
      const inputs = step.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        if (idx === index) {
          if (input.dataset.originalRequired === "true") {
            input.required = true;
          }
        } else {
          if (input.required) {
            input.dataset.originalRequired = "true";
            input.required = false;
          }
        }
      });
    });
  }

  showStep(currentStepIndex);

  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const currentStep = steps[currentStepIndex];
      if (!currentStep.hasAttribute("data-final")) {
        e.preventDefault();
      }
    }
  });


  // ✅ **Range Input Functionality**
const rangeInputs = document.querySelectorAll('input[type="range"]');
rangeInputs.forEach((range) => {
  const display = document.querySelector(`[data-range-display="${range.getAttribute("name")}"]`);
  if (display) {
    range.addEventListener("input", function () {
      display.textContent = range.value;
    });
  }
});

  

  // Next Button Event
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentStep = steps[currentStepIndex];
      const requiredFields = currentStep.querySelectorAll("[required]");
      let allFilled = true;

      requiredFields.forEach((field) => {
        if (field.type === "radio") {
          const radios = currentStep.querySelectorAll(
            `input[name="${field.name}"]`
          );
          let checked = false;
          radios.forEach((radio) => {
            if (radio.checked) checked = true;
          });
          if (!checked) allFilled = false;
        } else if (field.type === "range") {
          if (field.value === "" || field.value === null) {
            allFilled = false;
          }
        } else if (field.value.trim() === "") {
          allFilled = false;
        }
      });

      if (!allFilled) {
        errorMessageDiv.style.opacity = "1";
        setTimeout(() => {
          errorMessageDiv.style.opacity = "0";
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
  backButton.addEventListener("click", function () {
    if (historyStack.length > 0) {
      currentStepIndex = historyStack.pop();
      showStep(currentStepIndex);
    }
  });

  // Final Step Submission
  form.addEventListener("submit", function (e) {
    const currentStep = steps[currentStepIndex];
    if (!currentStep.hasAttribute("data-final")) {
      e.preventDefault();
      return;
    }
    steps.forEach((step, idx) => {
      if (idx !== currentStepIndex) {
        const inputs = step.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          input.required = false;
        });
      }
    });
  });
});
