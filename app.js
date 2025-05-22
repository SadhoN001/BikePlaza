// Variables
const productSlider = document.getElementById('slides');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const productCount = document.getElementById('product-count');
const productPrice = document.getElementById('product-price');
const deliveryCharge = document.getElementById('delivery-charge');
const tax = document.getElementById('tax');
const shipping = document.getElementById('shipping');
const total = document.getElementById('total');

const discountBtn = document.getElementById('discount-btn');
const discountedTotal = document.getElementById('discounted-total');
const discountValue = document.getElementById('discount-value');

const reviewBtn = document.getElementById('reviewBtn');
const reviewSection = document.getElementById('reviewSection');


let currentIndex = 0;
let products = [];
let cart = {}; // Now using object to track items by ID

function updateCartUI() {
  let count = 0;
  let price = 0;

  for (const id in cart) {
    count += cart[id].quantity;
    price += cart[id].quantity * cart[id].price;
  }

  const delivery = Math.round(price * 0.02);
  const taxAmount = Math.round(price * 0.25);
  const shippingCost = Math.round(price * 0.01);
  const totalAmount = price + delivery + taxAmount + shippingCost;

  productCount.textContent = count;
  productPrice.textContent = price;
  deliveryCharge.textContent = delivery;
  tax.textContent = taxAmount;
  shipping.textContent = shippingCost;
  total.textContent = totalAmount;

  discountedTotal.classList.add('hidden');
  
}

discountBtn.onclick = () => {
    let price = 0;
    for (const id in cart) {
      price += cart[id].quantity * cart[id].price;
    }
  
    const delivery = Math.round(price * 0.02);
    const taxAmount = Math.round(price * 0.25);
    const shippingCost = Math.round(price * 0.01);
    const totalAmount = price + delivery + taxAmount + shippingCost;
  
    if (totalAmount >= 1000000) { // 10 lakh = 1,000,000
      const discounted = Math.round(totalAmount * 0.9); // 10% off
      discountedTotal.textContent = `🎉 Discounted Total:(10% off) ${discounted} BDT`;
      discountedTotal.classList.remove('hidden');
      discountedTotal.classList.add('text-green-600');
      discountedTotal.classList.remove('text-red-600');
    } else {
      discountedTotal.innerHTML  = '❌ Sorry, no discount you have.<br>(You will get a discount if you buy products above 10 lakhs BDT.)';
      discountedTotal.classList.remove('hidden');
      discountedTotal.classList.add('text-red-600');
      discountedTotal.classList.remove('text-green-600');
    }
  };
  
  
  

function createProductCard(product) {
   const div = document.createElement('div');
 div.className = "bg-white rounded-xl shadow-md p-4 flex flex-col justify-between h-full w-[280px] flex-shrink-0";


  div.innerHTML = `
    <div class="flex flex-col justify-between h-full">
      <div>
        <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded mb-3"> 
        <!-- w-full & fixed height 40 for consistency -->
        <h3 class="text-lg font-semibold">${product.name}</h3>
        <p class="text-sm text-gray-600">Brand: ${product.brand}</p>
        <p class="text-sm text-gray-700">${product.description}</p>
        <p class="text-md font-bold mt-1">${product.price} BDT</p>
        <p class="text-red-500">⭐ ${product.rating}</p>
      </div>

      <div class="mt-3">
        <div class="flex flex-wrap gap-2">
          <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded add-btn text-sm">Add</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded remove-btn text-sm">Remove</button>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded review-btn text-sm">Review</button>
        </div>
        <div class="mt-2 hidden review-section text-sm text-gray-600"></div>
      </div>
    </div>
  `;


  const addBtn = div.querySelector('.add-btn');
  const removeBtn = div.querySelector('.remove-btn');
  const reviewBtn = div.querySelector('.review-btn');
  const reviewSection = div.querySelector('.review-section');

  addBtn.onclick = () => {
    if (!cart[product.id]) {  // If the product doesn't exist in the cart, add it
      cart[product.id] = {
        ...product,  // Copy all properties from the product object
        quantity: 1
      };
    } else {
      cart[product.id].quantity++;
    }
    updateCartUI();
  };

  removeBtn.onclick = () => {
    if (cart[product.id] && cart[product.id].quantity > 0)
      {
      cart[product.id].quantity--;
        if (cart[product.id].quantity === 0)
        {
          delete cart[product.id];
        }
      updateCartUI();
    }
  };

reviewBtn.onclick = async () => {
    if (reviewSection.classList.contains('hidden')) {
      const res = await fetch("https://sadhon001.github.io/api/motor-review.json");
      const reviews = await res.json();
      const selected = reviews.slice(0, 2);

      reviewSection.innerHTML = selected.map(r => `
        <div class="my-2 border p-2 rounded shadow bg-white">
          <img src="${r.image}" alt="${r.name}" class="h-40 w-full object-cover rounded mb-2">
          <p class="font-semibold text-blue-600">${r.name}</p>
          <p class="text-sm font-serif">${r.review}</p>
        </div>
      `).join('');

      reviewSection.classList.remove('hidden');
    } else {
      reviewSection.classList.add('hidden');
    }
  };

  return div;
}
//product cart here looping.......................................>
function showSlides() {
  const slice = products.slice(currentIndex, currentIndex + 3);// Select 3 products from currentIndex
  productSlider.innerHTML = '';// Clear existing content
  slice.forEach(prod => productSlider.appendChild(createProductCard(prod)));// Add each product card
}

// Slide forward by 3 items instead of 1
nextBtn.onclick = () => {
    if (currentIndex + 3 < products.length) {
      currentIndex += 3;
      showSlides();
    }
  };
  
  // Slide backward by 3 items
  prevBtn.onclick = () => {
    if (currentIndex - 3 >= 0) {
      currentIndex -= 3;
      showSlides();
    }
  };
  

async function init() {
  const res = await fetch("https://sadhon001.github.io/api/motorcycle.json");
  products = await res.json();
  showSlides();
}

init();
// wait for its result before moving on to the next step.