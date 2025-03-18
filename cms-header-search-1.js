document.addEventListener('DOMContentLoaded', function() {
  // সার্চ ইনপুট ফিল্ড (data-name="Search")
  const searchInput = document.querySelector('[data-name="Search"]');
  
  // CMS প্রোডাক্ট লিস্ট র‍্যাপার (যদি প্রয়োজন হয়)
  const productListWrapper = document.querySelector('[data-products="list-wrapper"]');
  
  // প্রতিটি CMS প্রোডাক্ট আইটেম (data-products="product-item")
  const productItems = document.querySelectorAll('[data-products="product-item"]');
  
  // Enter key চাপলে ফর্ম submit হওয়া আটকানোর জন্য
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });
  
  // ইনপুট ইভেন্ট: ইউজারের ইনপুট অনুযায়ী CMS আইটেম ফিল্টার করা হবে
  searchInput.addEventListener('input', function() {
    // ইনপুট ভ্যালু lower case এবং trim করে নেওয়া
    const query = searchInput.value.toLowerCase().trim();
    
    productItems.forEach(item => {
      // CMS আইটেমের মধ্যে প্রোডাক্ট নাম সিলেক্ট করা (data-products="product-name")
      const productNameElement = item.querySelector('[data-products="product-name"]');
      if (productNameElement) {
        // প্রোডাক্ট নাম lower case এবং trim করে নেওয়া
        const productName = productNameElement.textContent.toLowerCase().trim();
        
        // Debug: console এ প্রোডাক্ট নাম এবং ইনপুট দেখানো হচ্ছে\n",
        console.log('Product:', productName, ' | Query:', query);
        
        // যদি প্রোডাক্ট নাম ইনপুটের সাথে মিল পায়, তাহলে দেখাবে, না পেলে লুকাবে
        if (productName.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      }
    });
  });
});
