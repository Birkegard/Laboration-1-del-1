const productList = document.getElementById("productList");

const getData = async () => {
  try {
    const response = await fetch ("./products.json");
    if (!response.ok){
      console.error("Fel från servern: " + response.status)
    }
    const products = await response.json();
    renderProducts(products);
    
  } catch (error) {
    console.error("Fel: ", error)
  }
};

const renderProducts = (products) => {
  products.forEach((product) => {
    console.log("Product: ", product);
    const article = document.createElement("article")
    article.classList.add("card");
    const name = document.createElement("h3")
    name.classList.add("h3")
    const img = document.createElement("img")
    img.classList.add("car-img");
    const price = document.createElement("p")
    price.classList.add("price");
    const description = document.createElement("p")
    description.classList.add("description");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = 1;
    quantityInput.min = 1;
    quantityInput.classList.add("quantity");
    const buyButton = document.createElement("button")
    buyButton.classList.add("button");
    buyButton.addEventListener("click", () => {
      const quantity = Number(quantityInput.value);
      window.alert(`Tillagd i varukorg: ${product.name}`);
      addToCart(product.name, Number(product.price), quantity, product.image)
    })
    let badge = null;
    if (product.badge) {
      badge = document.createElement("span");
      badge.classList.add("discount");
      badge.textContent = product.badge;
    }

    name.textContent = product.name;
    img.src = product.image;
    img.alt = `Bild av ${product.name}`
    price.textContent = `Pris: ${product.price.toLocaleString('sv-SE')} kr`;
    description.textContent = product.description;
    buyButton.textContent = "Lägg till i varukorg";
    
    article.appendChild(name);
    article.appendChild(img);
    article.appendChild(price);
    article.appendChild(quantityInput);
    article.appendChild(description);
    article.appendChild(buyButton);

    if(badge) {
    article.appendChild(badge);
    }

    productList.appendChild(article);
  });
};

getData();

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

function addToCart(name, price, quantity, img) {
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