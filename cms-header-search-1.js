document.addEventListener('DOMContentLoaded', function() {
  // সার্চ ইনপুট ফিল্ড (data-name="Search")
  const searchInput = document.querySelector('[data-name="Search"]');
  
  // CMS প্রোডাক্ট আইটেমগুলো (data-products="product-item")
  const productItems = document.querySelectorAll('[data-products="product-item"]');
  
  // পেজ লোডে সব প্রোডাক্ট আইটেম দৃশ্যমান থাকবে (যদি কোনো item লুকানো থাকে, তা দেখানোর জন্য)
  productItems.forEach(item => {
    item.style.display = 'block';
  });
  
  // Enter key চাপলে ফর্ম submit হওয়া আটকাতে
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });
  
  // ইনপুট ইভেন্ট: ইউজারের টাইপ অনুযায়ী CMS আইটেম ফিল্টার করা হবে
  searchInput.addEventListener('input', function() {
    // ইনপুট ভ্যালু lower case ও trim করা হচ্ছে
    const query = searchInput.value.toLowerCase().trim();
    
    productItems.forEach(item => {
      // প্রতিটি প্রোডাক্ট আইটেমের মধ্যে প্রোডাক্ট নাম (data-products="product-name") সিলেক্ট করা হচ্ছে
      const productNameElement = item.querySelector('[data-products="product-name"]');
      if (productNameElement) {
        const productName = productNameElement.textContent.toLowerCase().trim();
        // যদি প্রোডাক্ট নাম ইনপুটের সাথে মিল খায়, তাহলে দেখাবে, না হলে hide করবে
        if (productName.includes(query)) {\n          item.style.display = 'block';\n        } else {\n          item.style.display = 'none';\n        }\n      }\n    });\n  });\n});\n"}
