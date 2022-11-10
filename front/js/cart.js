// Global Variables
var header = document.querySelector("h1")
var cart = JSON.parse(localStorage.getItem('cart'))
var itemQuantities = [];
var itemTotals = [];
var tempCart = [];
var productUrls = [];

var products = [];
var cartItems = [];

var item = "";
var product = "";

var totalItems = document.getElementById("totalQuantity")
var cartTotal = document.getElementById("totalPrice")
// Functions 
getCart()

function getCart() {
  JSON.parse(localStorage.getItem('cart'))
  if (!localStorage.getItem('cart') || cart.length === 0 || localStorage.getItem('cart') == null) {
    header.innerHTML = (`Votre panier est vide<br><a href=./index.html style=font-size:18px;>trouvez un produit que vous allez aimer</a>`)
    totalItems.innerHTML = '0'
    cartTotal.innerHTML = '0'
  }
  if (cart.length >= 1) {
    let item = cart.map(({ id, color, qty }) => ({ id, color, qty }))
    cartItems.push(...item)
    console.log(cartItems)
    for (let item of cartItems) {
      itemQuantities.push(item.qty)
      let itemAPI = "http://localhost:3000/api/products/" + item.id
      productUrls.push(itemAPI)
    }
    console.log(itemQuantities)
    console.log(productUrls)
  }
}

let getProductData = productUrls.map(url => fetch(url))

Promise.all(getProductData)
  .then(responses => {
    return responses;
  })
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(productData => productArray(productData))

  .catch((error) => {
    totalItems.innerHTML = '0'
    header.innerHTML = (`Sacre Bleu!<p style=font-size:18px;>une erreur est survenue<br>merci de revenir plus tard</p></h1>`)
    console.log("could not connect to product's API" + error);
  });

function productArray(productData) {
  let product = productData.map(({ name, imageUrl, altTxt, price }) => ({ name, imageUrl, altTxt, price }))
  products.push(...product)
  console.log(products)
  displayCart()
}
console.log(itemTotals)

function displayCart() {
  for (let i = 0; i < cartItems.length; i++) {
    let item = cartItems[i]
    let product = products[i]
    itemTotals.push((item.qty * product.price))
    console.log(itemTotals)
    let cartDisplay = document.getElementById("cart__items")
    cartDisplay.innerHTML += (`<article class="cart__item" data-id="${item.id}" data-color="${item.color}">  
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${item.color}</p>
          <p>${product.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qty}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" onclick="removeItem()">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`)
  }
  displayTotals()
}

function displayTotals() {
  let cartPrice = parseInt(itemTotals.reduce((x, y) => x + y, 0));
  let cartPriceFormatted = new Intl.NumberFormat().format(cartPrice)
  let totalQty = parseInt(itemQuantities.reduce((x, y) => x + y, 0));
  totalItems.innerHTML = totalQty
  cartTotal.innerHTML = cartPriceFormatted
}

//remove item when "supprimer" is clicked
document.addEventListener('DOMContentLoaded', function () {

  var deleteItem = document.getElementsByClassName("cart__item__content__settings__delete")
  for (let i = 0; i < deleteItem.length; i++) {
    var supprimer = deleteItem[i]
    supprimer.addEventListener('click', removeItem)
  }

  var qtyChange = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < qtyChange.length; i++) {
    var qtyChanged = qtyChange[i]
    qtyChanged.addEventListener('change', updateQty)
  }
});

function removeItem() {
  let clicked = event.currentTarget.closest('article');
  console.log(clicked.dataset.id, clicked.dataset.color)
  let tempCart = [];
  let currentCart = getCart()
  for (let item of currentCart) {
    let toDelete = currentCart.find(item => (item.id === clicked.dataset.id && item.color === clicked.dataset.color));
    if (item != toDelete) {
      tempCart.push(item)
      console.log(tempCart)
    }
    else {
      clicked.closest('article').remove()
    }
  }
  let cart = tempCart
  localStorage.setItem('cart', JSON.stringify(cart))
  displayTotals();
}

/** END OF RECONFIG 1 UPDATE **/

// update item quantity if changed in input field
function updateQty() {
  var newQty = event.target.valueAsNumber
  console.log(newQty)
  var qtyChanged = event.target.closest('article');
  console.log(qtyChanged.dataset.id, qtyChanged.dataset.color)
  let tempCart = [];
  let currentCart = getCart()
  for (let item of currentCart) {
    let qtyChanged = cart.find(item => (item.id === changedQty.dataset.id && item.color === changedQty.dataset.color));
    if (inputQty === 0 || inputQty === NaN) { alert("Merci de cliquez sur \"Supprimer\" pour retirer un article de votre panier") }
    if (inputQty > 100 || inputQty === NaN) { alert("Merci d\"entrer une quantité entre 1 et 100") }
    if (item != qtyChanged) {
      tempCart.push(item)
    }
    else {
      item.qty = newQty
      console.log(item)
      tempCart.push(item)
      alert("Quantité d\"article mise à jour")
    }
  }
  let cart = tempCart
  /*localStorage.setItem("cart", JSON.stringify(cart));*/
  console.log(cart)
  displayTotals();
}

const form = document.querySelector(".cart__order__form");

var questions = document.querySelectorAll(".cart__order__form__question > input")
console.log(questions)

const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const address = document.getElementById("address")
const city = document.getElementById("city")
const email = document.getElementById("email")

const contact = {
  firstName: firstName.value,
  lastName: lastName.value,
  address: address.value,
  city: city.value,
  email: email.value
}

// Regular expressions to test input validity
const nameRGEX = /^[a-zA-Zéêëèîïâäçù ,"-]{3,20}$/;
const addressRGEX = /^[0-9]{1,3}[a-zA-Zéêëèîïâäçù ,"-]+$/;
const emailRGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Assign class name that references input validity when page loads
window.addEventListener("load", () => {
  for (let question of questions) {
    const isValid = question.value.length > 0;
    question.className = isValid ? "valid" : "invalid";
  }
});

// When user types in the field(s)
firstName.addEventListener("input", () => {
  let msg = document.getElementById("firstNameErrorMsg")
  const isValid = nameRGEX.test(firstName.value);
  if (isValid) {
    firstName.className = "valid";
    msg.textContent = "";
    console.log(firstName.value)
    Object.assign(contact, { firstName: firstName.value });
    localStorage.setItem('contactData', JSON.stringify(contact))
  }
  else {
    firstName.className = "invalid";
    msg.textContent = "Merci d\"entrer un prénom valide";
  }
  console.log(firstName.className)
});

lastName.addEventListener("input", () => {
  let msg = document.getElementById("lastNameErrorMsg")
  const isValid = nameRGEX.test(lastName.value);
  if (isValid) {
    lastName.className = "valid";
    msg.textContent = "";
    console.log(lastName.value)
    Object.assign(contact, { lastName: lastName.value });
    localStorage.setItem('contactData', JSON.stringify(contact))
  }
  else {
    firstName.className = "invalid";
    msg.textContent = "Merci d\"entrer un nom valide";
  }
  console.log(lastName.className)
});

address.addEventListener("input", () => {
  let msg = document.getElementById("addressErrorMsg")
  const isValid = addressRGEX.test(address.value);
  if (isValid) {
    address.className = "valid";
    msg.textContent = "";
    console.log(address.value)
    Object.assign(contact, { address: address.value });
    localStorage.setItem('contactData', JSON.stringify(contact))
  }
  else {
    address.className = "invalid";
    msg.textContent = "Merci d\"entrer un adrese valide";
  }
  console.log(address.className)
});

city.addEventListener("input", () => {
  let msg = document.getElementById("cityErrorMsg")
  const isValid = nameRGEX.test(city.value);
  if (isValid) {
    city.className = "valid";
    msg.textContent = "";
    console.log(city.value)
    Object.assign(contact, { city: city.value });
    localStorage.setItem('contactData', JSON.stringify(contact))
  }
  else {
    city.className = "invalid";
    msg.textContent = "Merci d\"entrer une ville valide";
  }
  console.log(city.className)
});

email.addEventListener("input", () => {
  let msg = document.getElementById("emailErrorMsg")
  const isValid = emailRGEX.test(email.value);
  if (isValid) {
    email.className = "valid";
    msg.textContent = "";
    console.log(email.value)
    Object.assign(contact, { email: email.value });
    localStorage.setItem('contactData', JSON.stringify(contact))
  }
  else {
    email.className = "invalid";
    msg.textContent = "Merci d\"entrer un adresse mail valide";
  }
  console.log(email.className)
});

// When user submits data (check all for validity)
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let validResponses = document.getElementsByClassName("valid")
  console.log(validResponses.length)
  if (validResponses.length = form.length) {
    submitOrder()
  }
  else {
    console.log("not all form values are valid")
  }
});

//function runs if all form question inputs are valid
/* send order information to API
/* request order number in return */
/*
async function submitOrder() {
  const products = cart.map(item => item.id)
  const order = { contact, products }
  console.log(order)


  await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response.orderId)
      let baseURL = "./confirmation.html?order="
      let confirmationURL = (baseURL + response.orderId)
      console.log(confirmationURL)
      window.location = confirmationURL
    })

    .catch(error => console.error('Error:', error))
}*/


