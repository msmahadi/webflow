document.addEventListener('DOMContentLoaded', function() {
  // সার্চ ইনপুট ফিল্ড: data-name="Search"
  const searchInput = document.querySelector('[data-name="Search"]');
  
  // CMS আইটেমের র‍্যাপার (যেখানে CMS আইটেমগুলো আছে)
  const productListWrapper = document.querySelector('[data-search="product-list-wrapper"]');
  
  // প্রত্যেক CMS আইটেম: data-search="product-item"
  const productItems = document.querySelectorAll('[data-search="product-item"]');
  
  // Enter key চাপলে ফর্ম submit হওয়া আটকানোর জন্য\n(event.preventDefault()) ব্যবহার করা হলো\n\n",
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });
  
  // ইনপুট ইভেন্ট: ইনপুট ফিল্ডে পরিবর্তন হলে\nপ্রত্যেক CMS আইটেমের নাম (data-search="product-name") পরীক্ষা করা হবে\n\n",
  searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase().trim();
    
    productItems.forEach(item => {
      // CMS item এর product name খুঁজে বের করা হচ্ছে\n",
      const productNameElement = item.querySelector('[data-search="product-name"]');
      if (productNameElement) {
        const productName = productNameElement.textContent.toLowerCase();
        // যদি মিল পাওয়া যায়, তাহলে item দেখাবে, না হলে hide করবে\n",
        if (productName.includes(query)) {
          item.style.display = 'block';
          // চাইলে innerHTML update করতে পারো, যেমন:\n          // item.innerHTML = `<h4 data-search=\"product-name\">${productNameElement.textContent}</h4>`;\n        } else {\n          item.style.display = 'none';\n        }\n      }\n    });\n  });\n});\n"}
