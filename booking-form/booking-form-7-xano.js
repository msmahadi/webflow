// alert('booking-form-5-xano-html-control.html');

/* 
    booking-form-5-xano-html-control.js
    - এই ফাইলে ফর্ম সাবমিট, ইনপুট ফিল্ড initialization, এবং অন্যান্য ফাংশন আছে।
    - এখানে কোন কোড পরিবর্তন করা হয়নি। ফর্ম সাবমিটের সময় hidden ইনপুট (date ও time) থেকে value নেওয়া হবে।
*/

// ২৪-ঘন্টা সময়কে ১২-ঘন্টা ফরম্যাটে কনভার্ট করার ফাংশন (যদি প্রয়োজন হয়)
function convertTimeTo12HourFormat(time24) {
  const [hour, minute] = time24.split(':');
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${minute}${ampm}`;
}

// ফর্ম সাবমিটের ফাংশন
function submitBookingForm() {
  const form = document.getElementById('msf-bookingForm');
  const submitButton = form.querySelector('#msf-submit');
  const successMessage = document.getElementById('msf-successMessage');
  const errorMessage = document.getElementById('msf-errorMessage');

  // পূর্বের message গুলো hide করা
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';

  // ইনপুট ভ্যালু সংগ্রহ করা (hidden ইনপুট থেকে)
  const date = document.getElementById('msf-date').value;
  const time = document.getElementById('msf-time').value;
  const fullname = document.getElementById('msf-fullname').value.trim();
  const email = document.getElementById('msf-email').value.trim();
  const location = document.getElementById('msf-location').value.trim();
  const message = document.getElementById('msf-message').value.trim();
  const Image_link = document.getElementById('msf-Image_link').value.trim();

  // Required ফিল্ড চেক
  if (!date || !time || !fullname || !email) {
    errorMessage.style.display = 'block';
    return;
  }

  // ১২-ঘন্টা ফরম্যাটে convert করা (যদি প্রয়োজন হয়)
  //   const formattedTime = convertTimeTo12HourFormat(time);
  const formData = {
    Date: date,
    // Time_text: formattedTime,
    Time_text: time,
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
      form.reset();

      // ✅ **নতুন যুক্ত করা Email ফাংশন Call**
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
  const form = document.getElementById('msf-bookingForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBookingForm();
  });
}

// অন্যান্য ইনপুট ফিল্ডের জন্য initialization (যদি প্রয়োজন হয়)
function initDateTimePickers() {
  // পূর্বের input field event listener এখন hidden ইনপুট ব্যবহার করা হবে,
  // তাই এখানে কোন পরিবর্তন করা হয়নি।
}

// DOM ready হলে initialize function call করা হবে
document.addEventListener('DOMContentLoaded', function () {
  initBookingForm();
  initDateTimePickers();
  // date-time-xano.js এর ফাংশন call করা হচ্ছে, যা radio button group তৈরি করবে
  initDateTimeXano();
});

// ================================
// নতুন যুক্ত করা: Site Access Verify Feature
// ================================

document.addEventListener('DOMContentLoaded', async function () {
  try {
    // ফর্মটি নিয়ে data-access attribute থেকে value নেওয়া
    const form = document.getElementById('msf-bookingForm');
    if (!form) return; // ফর্ম না থাকলে কিছুই না করা
    const dataAccessValue = form.getAttribute('data-access');

    // Xano API থেকে site access তথ্য fetch করা
    const response = await fetch(
      'https://x8ki-letl-twmt.n7.xano.io/api:M-6VoMrH/booking_form_user_dashboard'
    );
    const siteData = await response.json();

    // API থেকে পাওয়া তথ্যের সাথে data-access attribute তুলনা করা
    const record = siteData.find((item) => item.site_id === dataAccessValue);

    // যদি record না পাওয়া যায় অথবা site_access "true-access" না হয়,
    // তাহলে পুরো পেজের HTML সরিয়ে শুধুমাত্র warning message দেখানো হবে
    if (!(record && record.site_access === 'true-access')) {
      // পুরো HTML replace করে ফেলে যাতে অন্য কোন function বা event কাজ না করে
      // document.documentElement.innerHTML = `
      form.innerHTML = `
        <head>
          <title>Access Denied</title>
        </head>
        <body>
          <div style="text-align:center; margin-top:50px; font-size:20px;">
            Site access denied.
          </div>
        </body>
      `;
    }
    // যদি access valid থাকে, তাহলে কিছুই পরিবর্তন করা হবে না
  } catch (error) {
    // কোনো error ঘটলে, পুরো HTML replace করে error message দেখানো হবে
    // document.documentElement.innerHTML = `
    form.innerHTML = `
      <head>
        <title>Error</title>
      </head>
      <body>
        <div style="text-align:center; margin-top:50px; font-size:20px;">
          Error verifying site access.
        </div>
      </body>
    `;
  }
});
