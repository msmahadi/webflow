function sendEmailToGoogleAppsScript(data) {
  const formID = document.getElementById('msf-bookingForm');

  // **নতুন যুক্ত করা: HTML attribute থেকে appScriptURL URL নিয়েছি**
  const appScriptURL = formID.getAttribute('data-google-sheet-appscript-url');

  // Xano API থেকে Date ও Time ডেটা ফেচ করা হচ্ছে
  fetch(appScriptURL, {
    method: 'POST',
    mode: 'no-cors', // ✅ CORS সমস্যা এড়ানোর জন্য
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(() => {
      // console.log("Email request sent.");
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
}
