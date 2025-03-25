// alert('booking-form-5-xano-html-control.html');

/* 
    booking-form-5-xano.js
    - এই ফাইলে ফর্ম সাবমিট, ইনপুট ফিল্ড initialization, এবং অন্যান্য ফাংশন আছে।
    - এখানে কোন কোড পরিবর্তন করা হয়নি। ফর্ম সাবমিটের সময় hidden ইনপুট (date ও time) থেকে value নেওয়া হবে।
*/

// ২৪-ঘণ্টা সময়কে ১২-ঘণ্টা ফরম্যাটে কনভার্ট করার ফাংশন (যদি প্রয়োজন হয়)
function convertTimeTo12HourFormat(time24) {
  const [hour, minute] = time24.split(':');
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${minute}${ampm}`;
}

// ফর্ম সাবমিটের ফাংশন
function submitBookingForm() {
  const form = document.getElementById('bookingForm');
  const submitButton = form.querySelector('#msf-submit');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  // পূর্বের message গুলো hide করা
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  // ইনপুট ভ্যালু সংগ্রহ করা (hidden ইনপুট থেকে)
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const location = document.getElementById('location').value.trim();
  const message = document.getElementById('message').value.trim();
  const Image_link = document.getElementById('Image_link').value.trim();

  // Required ফিল্ড চেক
  if (!dateInput.value || !timeInput.value || !fullname || !email) {
    errorMessage.style.display = 'block';
    return;
  }

  // ১২-ঘণ্টা ফরম্যাটে convert করা (যদি প্রয়োজন হয়)
  // const formattedTime = convertTimeTo12HourFormat(time);
  const formData = {
    Date: dateInput.value,
    // Time_text: formattedTime,
    Time_text: timeInput.value,
    Full_name: fullname,
    Email: email,
    Location_text: location,
    Message: message,
    Image_link: Image_link,
  };

  // সাবমিট বাটনের স্টেট আপডেট করা
  submitButton.disabled = true;
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Please wait...';

  // **নতুন যুক্ত করা: HTML attribute থেকে endpoint URL নিয়েছি**
  const endpointUrl = form.getAttribute('data-database-endpoint-url');

  // Xano API POST request করা (এখানে HTML থেকে নিয়েই URL control হবে)
  fetch(endpointUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      successMessage.style.display = 'block';
      errorMessage.style.display = 'none';
      
      // ফর্ম reset করা
      form.reset();

      // date ও time ইনপুট ফিল্ড reset করা
      dateInput.value = '';
      timeInput.value = '';

      // ✅ **নতুন যুক্ত করা: Email ফাংশন Call**
      sendEmailToGoogleAppsScript(formData);
    })
    .catch((error) => {
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    });
}

// ফর্ম initialize করার ফাংশন
function initBookingForm() {
  const form = document.getElementById('bookingForm');

  // Webflow এর default action attribute মুছে ফেলা
  form.removeAttribute('action');

  // Capturing phase এ submit ইভেন্ট listener attach করা
  form.addEventListener(
    'submit',
    function (e) {
      // Prevent default browser behavior and Webflow এর সাবমিশন
      e.preventDefault();
      e.stopImmediatePropagation();
      submitBookingForm();
    },
    true // Capturing phase
  );
}

// অন্যান্য ইনপুট ফিল্ডের জন্য initialization (যদি প্রয়োজন হয়)
function initDateTimePickers() {
  // পূর্বের input field event listener এখন hidden ইনপুট ব্যবহার করা হবে,
  // তাই এখানে কোন পরিবর্তন করা হয়নি।
}

// DOM ready হলে initialize function call করা হবে
document.addEventListener('DOMContentLoaded', function () {
  // প্রথম থেকেই success ও error message hide করে রাখা
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';

  initBookingForm();
  initDateTimePickers();
  // date-time-xano.js এর ফাংশন call করা হচ্ছে, যা radio button group তৈরি করবে
  initDateTimeXano();
});
