document.addEventListener('DOMContentLoaded', function() {
  // সার্চ ইনপুট ফিল্ড (data-name="Search")
  const searchInput = document.querySelector('[data-name="Search"]');
  
  // CMS আইটেমগুলো ধারণ করা wrapper (data-search="product-list-wrapper")
  const productListWrapper = document.querySelector('[data-search="product-list-wrapper"]');
  
  // প্রত্যেক CMS আইটেম (data-search="product-item")
  const productItems = document.querySelectorAll('[data-search="product-item"]');
  
  // Enter key চাপলে ফর্ম submit হওয়া আটকানোর জন্য
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });
  
  // ইনপুট ইভেন্ট: ইনপুট পরিবর্তনের উপর ভিত্তি করে CMS আইটেম ফিল্টার করা হবে
  searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase().trim();
    
    productItems.forEach(item => {
      // CMS item এর নাম (data-search="product-name") খুঁজে বের করা হচ্ছে
      const productNameElement = item.querySelector('[data-search="product-name"]');
      if (productNameElement) {
        const productName = productNameElement.textContent.toLowerCase();
        // যদি সার্চ query আইটেমের নামের সাথে মিল পায়, তাহলে দেখাবে, নাহলে লুকিয়ে রাখবে
        if (productName.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      }
    });
  });
});
