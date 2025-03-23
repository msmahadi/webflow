/* 
    date-time-xano.js
    - এই ফাইলে Xano API থেকে Dynamic Date ও Time ডেটা ফেচ করে custom radio button group‑এ দেখানোর ফাংশন থাকবে।
    - এখানে time গুলোকে sort করার জন্য helper functions যোগ করা হয়েছে।
    - ফাংশনটির নাম initDateTimeXano(), যা booking-form-3-xano.js থেকে কল করা হবে।
*/

function initDateTimeXano() {
  // HTML উপাদানগুলো নির্বাচন করা হচ্ছে
  const form = document.getElementById('bookingForm');
  const dateOptionsContainer = document.getElementById('dateOptions');
  const timeOptionsContainer = document.getElementById('timeOptions');
  const hiddenDateInput = document.getElementById('date');
  const hiddenTimeInput = document.getElementById('time');

  // শুরুতে Time Options container hide করা হচ্ছে
  timeOptionsContainer.style.display = 'none';

  // console.log('Fetching date and time data from Xano API...');

  // **নতুন যুক্ত করা: HTML attribute থেকে endpoint URL নিয়েছি**
  const dashboardEndpointURL = form.getAttribute('data-dashboard-endpoint-url');

  // Xano API থেকে Date ও Time ডেটা ফেচ করা হচ্ছে
  fetch(dashboardEndpointURL)
    .then((response) => response.json())
    .then((data) => {
      // console.log('Data fetched:', data);

      // যদি data একটি array হয়, তাহলে প্রতিটি entry‑এর জন্য date radio button তৈরি করা হবে
      if (Array.isArray(data)) {
        // date গুলোকে ascending order‑এ sort করা (date string compare করার জন্য)
        data.sort((a, b) => new Date(a.Test_date_1) - new Date(b.Test_date_1));
        data.forEach((entry) => {
          if (entry.Test_date_1 && entry.Time_text_range_1) {
            createDateOption(entry.Test_date_1, entry.Time_text_range_1);
          }
        });
      } else {
        // যদি data সরাসরি object হয়, তাহলে সেটাও হ্যান্ডেল করা হবে
        if (data && data.Test_date_1 && data.Time_text_range_1) {
          createDateOption(data.Test_date_1, data.Time_text_range_1);
        } else {
          console.error('Invalid data structure from API');
        }
      }
    })
    .catch((error) => {
      console.error('Xano API থেকে Date ও Time ডেটা ফেচ করতে সমস্যা:', error);
    });

  // Date radio button তৈরি করার ফাংশন
  function createDateOption(dateValue, timeArray) {
    // নতুন radio button element তৈরি করা হচ্ছে
    const dateItem = document.createElement('div');
    dateItem.className = 'radio-item';
    dateItem.textContent = formatDateDisplay(dateValue); // সুন্দরভাবে date প্রদর্শনের জন্য ফরম্যাট করা হচ্ছে

    // ক্লিক ইভেন্ট লিসেনার যোগ করা হচ্ছে
    dateItem.addEventListener('click', function () {
      // সব Date radio item থেকে selected ক্লাস সরানো হচ্ছে
      const allDateItems = document.querySelectorAll(
        '#dateOptions .radio-item'
      );
      allDateItems.forEach((item) => item.classList.remove('is-active'));
      // এই radio item কে selected করা হচ্ছে
      dateItem.classList.add('is-active');

      // hidden date input এ value সেট করা হচ্ছে
      hiddenDateInput.value = dateValue;
      // console.log('Date selected:', dateValue);

      // Time Options container visible করা হচ্ছে এবং time radio buttons populate করা হচ্ছে
      timeOptionsContainer.style.display = 'flex';
      populateTimeOptions(timeArray);
    });

    // Date radio button container এ যোগ করা হচ্ছে
    dateOptionsContainer.appendChild(dateItem);
  }

  // Time radio buttons populate করার ফাংশন (sort যুক্ত)
  function populateTimeOptions(timeArray) {
    // পূর্বের time options মুছে ফেলা হচ্ছে
    timeOptionsContainer.innerHTML = '';

    // timeArray কে sort করা হচ্ছে যাতে প্রথমে AM তারপর PM এ যায়
    const sortedTimes = sortTimes(timeArray);

    sortedTimes.forEach((timeValue) => {
      const timeItem = document.createElement('div');
      timeItem.className = 'radio-item';
      timeItem.textContent = timeValue; // Time value দেখানো হচ্ছে

      // ক্লিক ইভেন্ট লিসেনার যোগ করা হচ্ছে
      timeItem.addEventListener('click', function () {
        // সব Time radio item থেকে selected ক্লাস সরানো হচ্ছে
        const allTimeItems = document.querySelectorAll(
          '#timeOptions .radio-item'
        );
        allTimeItems.forEach((item) => item.classList.remove('is-active'));
        // এই radio item কে selected করা হচ্ছে
        timeItem.classList.add('is-active');

        // hidden time input এ value সেট করা হচ্ছে
        hiddenTimeInput.value = timeValue;
        // console.log('Time selected:', timeValue);
      });

      // Time radio button container এ যোগ করা হচ্ছে
      timeOptionsContainer.appendChild(timeItem);
    });
  }

  // Date display ফরম্যাট করার ফাংশন (YYYY-MM-DD কে সুন্দরভাবে রূপান্তর করা)
  function formatDateDisplay(dateStr) {
    const dateObj = new Date(dateStr);
    // উদাহরণস্বরূপ: 1 Mar 2025
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }

  // Helper ফাংশন: time string থেকে তথ্য extract করা
  function parseTime(timeStr) {
    // timeStr এর expected format: "04:15PM" বা "09:15AM"
    const regex = /(\d{1,2}):(\d{2})(AM|PM)/;
    const match = timeStr.match(regex);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    // AM/PM অনুযায়ী hours নির্ধারণ করা (sorting-এর জন্য)
    const periodValue = period === 'AM' ? 0 : 1;
    // ১২ AM কে 0 হিসেবে গণনা করা
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    // ১২ PM কে ঠিক রাখবো, অন্যান্য PM সময়ের জন্য 12 যোগ করবো
    else if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    return { periodValue, hours, minutes, original: timeStr };
  }

  // Helper ফাংশন: time array কে sort করা (প্রথমে AM তারপর PM, ascending order)
  function sortTimes(timeArray) {
    return timeArray.slice().sort((a, b) => {
      const timeA = parseTime(a);
      const timeB = parseTime(b);
      if (!timeA || !timeB) return 0;
      // প্রথমে period অনুযায়ী sort (AM=0, PM=1)
      if (timeA.periodValue !== timeB.periodValue) {
        return timeA.periodValue - timeB.periodValue;
      }
      // একই period হলে, hours অনুযায়ী sort
      if (timeA.hours !== timeB.hours) {
        return timeA.hours - timeB.hours;
      }
      // একই hours হলে, minutes অনুযায়ী sort
      return timeA.minutes - timeB.minutes;
    });
  }
}
