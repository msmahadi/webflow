document.addEventListener("DOMContentLoaded", function () {
  // Radio button functionality (do not change)
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

  // Multi-step form functionality (do not change)
  const steps = document.querySelectorAll(".multi-form_step");
  const nextButtons = document.querySelectorAll("[data-step='next-button']");
  const backButton = document.querySelector("#back-button");
  const form = document.getElementById("multiStepForm");
  const errorMessageDiv = document.getElementById("error-message");
  let currentStepIndex = 0;
  const historyStack = [];

  // Initially hide the error message (opacity 0)
  errorMessageDiv.style.opacity = "0";

  // Hide all steps
  function hideAllSteps() {
    steps.forEach((step) => (step.style.display = "none"));
  }

  // Modified showStep: display the active step and remove required attribute from inputs in hidden steps
  function showStep(index) {
    hideAllSteps();
    steps[index].style.display = "flex";
    // For each step, if it's active, restore required attribute if it was originally required.
    // Otherwise, remove the required attribute.
    steps.forEach((step, idx) => {
      const inputs = step.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        if (idx === index) {
          // Restore required if it was originally required (stored in data-original-required)
          if (input.dataset.originalRequired === "true") {
            input.required = true;
          }
        } else {
          // If the input is currently required, store that information and remove the attribute.
          if (input.required) {
            input.dataset.originalRequired = "true";
            input.required = false;
          }
        }
      });
    });
  }

  // Initially display the first step
  showStep(currentStepIndex);

  // Prevent form submission via Enter key on non-final steps
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
    const display = document.querySelector(
      `[data-range-display="${range.getAttribute("name")}"]`
    );
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
        } else if (field.value.trim() === "") {
          allFilled = false;
        }
      });
      if (!allFilled) {
        // Show error message (the text can be set in Webflow; this code just handles the visibility)
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
    // ***** New Code Added: Reset the inputs of the current step before going back *****
    const currentStep = steps[currentStepIndex];
    const inputs = currentStep.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      if (input.type === "radio" || input.type === "checkbox") {
        input.checked = false;
      } else {
        input.value = "";
      }
      // Optionally, clear any data attributes if needed:
      input.removeAttribute("data-display");
    });
    // *********************************************************************************

    if (historyStack.length > 0) {
      currentStepIndex = historyStack.pop();
      showStep(currentStepIndex);
    }
  });

  // Form submit event listener (final step submission)
  form.addEventListener("submit", function (e) {
    const currentStep = steps[currentStepIndex];
    // Only allow normal submission on the final step so Webflow handles the submission and success message.
    if (!currentStep.hasAttribute("data-final")) {
      e.preventDefault();
      return;
    }
    // Before submission, ensure that inputs in inactive steps remain without required attribute
    steps.forEach((step, idx) => {
      if (idx !== currentStepIndex) {
        const inputs = step.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          input.required = false;
        });
      }
    });
    // Let Webflow handle the submission naturally.
  });

  /* ------------------ Date/Time Picker Functionality ------------------
     This function initializes the date and time pickers based solely on attributes.
     
     It targets:
       - Date inputs with type="date" and attribute data-picker="date"
         -> On change, it reads the native value (format: "yyyy-MM-dd"), converts it
            to a formatted string (e.g., "16 March 2025"), and stores it in a data attribute
            (data-display) on the input.
       - Time inputs with type="time" and attribute data-picker="time"
         -> On change, it reads the native value (format: "HH:MM"), converts it to a formatted
            string (e.g., "01:18 AM"), and stores it in a data attribute (data-display) on the input.
     
     Additionally, when the input is clicked, if the browser supports native pickers via showPicker(),
     it will open the picker.
     
     Note: The input's value remains in the native format (so that submission works correctly),
           while the formatted value is available in the "data-display" attribute for visual use
           via Webflow interactions.
     --------------------------------------------------------------------- */
  function initializePickers() {
    // Date Picker: select inputs with type="date" and data-picker="date"
    const dateInputs = document.querySelectorAll(
      'input[type="date"][data-picker="date"]'
    );
    dateInputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.value) return;
        // input.value is in "yyyy-MM-dd" format
        const dateObj = new Date(input.value);
        const options = { day: "numeric", month: "long", year: "numeric" };
        // Format e.g., "16 March 2025"
        const formattedDate = dateObj.toLocaleDateString("en-US", options);
        // Instead of changing input.value (which would cause a format error),
        // store the formatted date in a data attribute for visual use.
        input.setAttribute("data-display", formattedDate);
      });
      input.addEventListener("click", function () {
        if (typeof input.showPicker === "function") {
          input.showPicker();
        }
      });
    });

    // Time Picker: select inputs with type="time" and data-picker="time"
    const timeInputs = document.querySelectorAll(
      'input[type="time"][data-picker="time"]'
    );
    timeInputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (!input.value) return;
        // input.value is in "HH:MM" (24-hour) format
        const [hourStr, minute] = input.value.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        if (hour === 0) hour = 12;
        // Format e.g., "01:18 AM"
        const formattedTime =
          ("0" + hour).slice(-2) + ":" + minute + " " + ampm;
        // Store the formatted time in a data attribute for visual use.
        input.setAttribute("data-display", formattedTime);
      });
      input.addEventListener("click", function () {
        if (typeof input.showPicker === "function") {
          input.showPicker();
        }
      });
    });
  }

  // Call the date/time picker initializer function.
  initializePickers();
});
