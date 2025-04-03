/* 
    date-time-6-dashboard-xano.js
    - এই ফাইলে Xano API থেকে নতুন ডেটা স্ট্রাকচার (Start_date, End_date, Regular_time, Off_time) ফেচ করে 
      custom radio button group‑এ দেখানোর ফাংশন থাকবে।
*/

function initDateTimeXano() {
  // HTML উপাদানগুলো নির্বাচন করা হচ্ছে
  const form = document.getElementById('bookingForm');
  const dateOptionsContainer = document.getElementById('dateOptions');
  const timeOptionsContainer = document.getElementById('timeOptions');
  const hiddenDateInput = document.getElementById('date');
  const hiddenTimeInput = document.getElementById('time');

  // শুরুতে টাইম অপশন লুকানো থাকবে
  timeOptionsContainer.style.display = 'none';

  // HTML attribute থেকে endpoint URL নেওয়া
  const dashboardEndpointURL = form.getAttribute('data-dashboard-endpoint-url');

  // Xano API থেকে Date ও Time ডেটা ফেচ করা হচ্ছে
  fetch(dashboardEndpointURL)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        data = data[0]; // প্রথম row select করা
      }

      if (
        data.Start_date &&
        data.End_date &&
        Array.isArray(data.Regular_time)
      ) {
        const dateArray = generateDatesFromRange(
          data.Start_date,
          data.End_date
        );
        let today = new Date().toISOString().split('T')[0]; // আজকের তারিখ (YYYY-MM-DD)

        dateArray.forEach((dateValue) => {
          // শুধুমাত্র আজকের বা ভবিষ্যতের তারিখগুলো দেখানো হবে
          if (dateValue < today) return;

          let timesForDate = data.Regular_time.slice(); // টাইম array-র কপি

          // Off_time হ্যান্ডেল করা
          if (data.Off_time && Array.isArray(data.Off_time)) {
            data.Off_time.forEach((offEntry) => {
              const parts = offEntry.split(' - ');
              if (parts.length === 2) {
                const offDateStr = parts[0].trim();
                const offTime = parts[1].trim();
                if (offDateStr === formatDateForOffCheck(dateValue)) {
                  timesForDate = timesForDate.filter(
                    (time) => time !== offTime
                  );
                }
              }
            });
          }

          // প্রতিটি তারিখের অপশন তৈরি করা
          createDateOption(dateValue, timesForDate);
        });
      } else {
        console.error(
          'API data structure is invalid. Expected Start_date, End_date, and Regular_time.'
        );
      }
    })
    .catch((error) => {
      console.error('Xano API থেকে Date ও Time ডেটা ফেচ করতে সমস্যা:', error);
    });

  // নির্দিষ্ট সময়সীমা থেকে তারিখের তালিকা তৈরি করে
  function generateDatesFromRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      dateArray.push(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  // Off_time চেকের জন্য তারিখ ফরম্যাট করা
  function formatDateForOffCheck(dateStr) {
    const dateObj = new Date(dateStr);
    const options = { month: 'long', day: '2-digit' };
    return dateObj.toLocaleDateString('en-US', options).replace(',', '');
  }

  // Date অপশন তৈরি করার ফাংশন
  function createDateOption(dateValue, timeArray) {
    const dateItem = document.createElement('div');
    dateItem.className = 'radio-item';
    dateItem.textContent = formatDateDisplay(dateValue);

    dateItem.addEventListener('click', function () {
      // সকল তারিখ অপশনের active ক্লাস সরানো
      document
        .querySelectorAll('#dateOptions .radio-item')
        .forEach((item) => item.classList.remove('is-active'));
      dateItem.classList.add('is-active');
      hiddenDateInput.value = dateValue;

      // শুধু ব্যবহারকারীর ক্লিকে টাইম অপশনগুলো দেখানো হবে
      if (timeArray.length > 0) {
        populateTimeOptions(timeArray);
        timeOptionsContainer.style.display = 'flex';
      } else {
        timeOptionsContainer.style.display = 'none';
        hiddenTimeInput.value = '';
      }
    });

    dateOptionsContainer.appendChild(dateItem);
  }

  // টাইম অপশনগুলো Populate করার ফাংশন
  function populateTimeOptions(timeArray) {
    timeOptionsContainer.innerHTML = '';
    sortTimes(timeArray).forEach((timeValue) => {
      const timeItem = document.createElement('div');
      timeItem.className = 'radio-item';
      timeItem.textContent = timeValue;
      timeItem.addEventListener('click', function () {
        document
          .querySelectorAll('#timeOptions .radio-item')
          .forEach((item) => item.classList.remove('is-active'));
        timeItem.classList.add('is-active');
        hiddenTimeInput.value = timeValue;
      });
      timeOptionsContainer.appendChild(timeItem);
    });
  }

  // তারিখ প্রদর্শনের ফরম্যাট ফাংশন
  function formatDateDisplay(dateStr) {
    const dateObj = new Date(dateStr);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }

  // টাইম স্ট্রিং পার্স করার ফাংশন (AM/PM ভিত্তিক)
  function parseTime(timeStr) {
    const regex = /(\d{1,2}):(\d{2})(AM|PM)/;
    const match = timeStr.match(regex);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];
    const periodValue = period === 'AM' ? 0 : 1;
    if (period === 'AM' && hours === 12) hours = 0;
    else if (period === 'PM' && hours !== 12) hours += 12;
    return { periodValue, hours, minutes, original: timeStr };
  }

  // টাইমগুলো সঠিক ক্রমানুসারে সাজানোর ফাংশন
  function sortTimes(timeArray) {
    return timeArray.slice().sort((a, b) => {
      const timeA = parseTime(a);
      const timeB = parseTime(b);
      if (!timeA || !timeB) return 0;
      if (timeA.periodValue !== timeB.periodValue)
        return timeA.periodValue - timeB.periodValue;
      if (timeA.hours !== timeB.hours) return timeA.hours - timeB.hours;
      return timeA.minutes - timeB.minutes;
    });
  }
}
