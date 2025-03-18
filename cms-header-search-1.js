document.addEventListener('DOMContentLoaded', function() {
  // সার্চ ইনপুট ফিল্ড (data-name="Search")
  const searchInput = document.querySelector('[data-name="Search"]');
  
  // CMS প্রোডাক্ট আইটেমগুলো ধারণ করে এমন wrapper (যদি থাকে, উদাহরণস্বরূপ data-products="list-wrapper")
  const productListWrapper = document.querySelector('[data-products="list-wrapper"]');
  
  // প্রত্যেক CMS প্রোডাক্ট আইটেম (data-products="product-item")
  const productItems = document.querySelectorAll('[data-products="product-item"]');
  
  // Enter key চাপলে ফর্ম submit হওয়া আটকাতে\n",
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });
  
  // ইনপুট ইভেন্ট: সার্চ ইনপুটের উপর ভিত্তি করে প্রোডাক্টের নাম (data-products="product-name") ফিল্টার করা হবে\n",
  searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase().trim();
    
    productItems.forEach(item => {
      // CMS প্রোডাক্ট আইটেমের মধ্যে প্রোডাক্টের নাম খুঁজতে\n",
      const productNameElement = item.querySelector('[data-products="product-name"]');
      if (productNameElement) {
        const productName = productNameElement.textContent.toLowerCase();
        if (productName.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      }
    });
  });
});
