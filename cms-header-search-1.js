document.addEventListener('DOMContentLoaded', function() {
  // সার্চ ইনপুট ফিল্ড (data-name="Search")
  const searchInput = document.querySelector('[data-name="Search"]');
  
  // CMS আইটেমগুলো ধারণ করা wrapper (data-search="product-list-wrapper")
  const productListWrapper = document.querySelector('[data-search="product-list-wrapper"]');
  
  // প্রত্যেক CMS আইটেম (data-search="product-item")
  const productItems = document.querySelectorAll('[data-search="product-item"]');
  
  // ইনপুট পরিবর্তনের ইভেন্ট হ্যান্ডলার\nsearch query অনুযায়ী ফিল্টার করবে
  searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase();
    
    productItems.forEach(item => {
      // প্রত্যেক আইটেমের নাম (data-search="product-name")
      const nameElement = item.querySelector('[data-search="product-name"]');
      if (nameElement) {
        const productName = nameElement.textContent.toLowerCase();
        // যদি সার্চ query আইটেমের নামের সাথে মিল খায়, তবে দেখাবে, নাহলে লুকিয়ে রাখবে\n\n"
        if (productName.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      }
    });
  });
});
