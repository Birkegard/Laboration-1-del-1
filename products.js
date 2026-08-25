let cart = {};

function extractPrice(text) {
  return Number(text.replace(/[^\d]/g, ''));
};

function openCartView() {
  document.querySelector("#cart-window").classList.add("active");
};

function closeCartView() {
  document.querySelector("#cart-window").classList.remove("active");
};

function addToCart(button, quantity) {
  let addItem = button.closest('.card');
  let name = addItem.querySelector("h3").textContent;
  let price = extractPrice(addItem.querySelector(".price").textContent);
  let img = addItem.querySelector(".car-img").src;

  if(cart[name]) {
    cart[name].quantity += quantity;
  } else {
    cart[name] = {quantity, price, img};
  }

  renderCart();
};

function removeCartItem(name) {
    delete cart[name];
    renderCart();
};

function clearAllItems(){
    cart = {};
    renderCart();
};

function renderCart(){
    let userCart = document.querySelector("#cart-items-container ul");
    userCart.innerHTML = '';

    let total = 0;

    for (let name in cart) {
        let item = cart[name];
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        userCart.innerHTML += `
    <li>
                    <div class="cart-item">
                      <div class="item-1">
                        <div class="cart-item-img">
                          <img src="${item.img}" alt="${name}">
                          <button class="remove-button" data-name="${name}">
                            <i class="fa-solid fa-trash-can" style="color: rgb(252, 250, 250);"></i>
                          </button>
                        </div>

                        <div class="cart-item-desc">
                          <span>${name}</span>
                          <span>Antal: ${item.quantity}</span>
                        </div>
                      </div>
                      <div class="cart-item-price">
                        <span>${itemTotal.toLocaleString('sv-SE')} kr</span>
                      </div>
                    </div>
                  </li>
                  `;
    }
    document.querySelector('#cart-checkout .price').innerHTML = `${total.toLocaleString('sv-SE')} kr`;
};

document.addEventListener("DOMContentLoaded", () => {
  //Visa varukorgen
  document
    .querySelector("nav .cart-link")
    .addEventListener("click", openCartView);

  //Stäng varukorgen
  document
    .querySelector("#cart-box .close-button")
    .addEventListener("click", closeCartView);

    //Lägg till i varukorgen
    document.querySelectorAll(".buyButton").forEach((button) => {
        button.addEventListener("click", () => {
            let card = button.closest('.card');
            let quantity = Number (card.querySelector('.quantity').value);
            addToCart(button, quantity)
        });
    });

    //Ta bort en specifik produkt
    document
    .querySelector("#cart-items-container ul")
    .addEventListener("click", (event) => {
        let targetElement = event.target.closest('.remove-button');
        if(targetElement) {
            let name = targetElement.dataset.name;
            removeCartItem(name);
        }
    });

    //Töm hela varukorgen
    document
    .querySelector('#checkout-button')
    .addEventListener('click', clearAllItems);

});
