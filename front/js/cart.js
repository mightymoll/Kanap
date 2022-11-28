// Global variables for cart page //
let cart = JSON.parse(localStorage.getItem('cart'))
let header = document.querySelector("h1")
let articlesTotal = document.getElementById("totalQuantity")
let priceTotal = document.getElementById("totalPrice")


/** FUNCTIONS FOR CART DISPLAY:
 * checkCartStatus = if cart is empty, display link to homepage
 * getProductData = fetch item data from API using product's id
 * createCartItems = for each item, await the return of productData JSON, then combine with cart data
 * displayCart = loop over 'cartItems' to display data from API and localstorage for each item
 * calcCartTotals = get price from 'cartItems' and calculate total quantities & price based on existing cart
 * addEventListeners = once cartData is displayed, create event listeners for html elements
 *  -removeItem = if 'supprimer' is clicked, delete item and update cart in localstorage
 *  -qtyChange = if input quantity is changed by user, update localstorage
 *  if either eventListener is triggered; calcCartTotals again 
 *  calcCartTotals returns to checkCartStatus if cart is empty
 */

function checkCartStatus() {
  cart = JSON.parse(localStorage.getItem('cart'))
  console.log(cart)
  if (!cart || cart.length < 1) {
    header.innerHTML = (`Votre panier est vide<br><a href=./index.html style=font-size:18px;>trouvez un produit que vous allez aimer</a>`)
    articlesTotal.innerHTML = '0'
    priceTotal.innerHTML = '0'
    console.log('cart is empty or does not exist / le panier est vide ou il n\'existe pas');
  }
  else {
    console.log('cart is not empty / le panier n\'est pas vide')
  }
}
checkCartStatus()

async function getProductData(id) {
  return fetch("http://localhost:3000/api/products/" + id)
    .then(res => res.json())
    .catch((error) => {
      articlesTotal.innerHTML = '?';
      priceTotal.innerHTML = '?';
      header = (`Sacre Bleu!<p style=font-size:18px;>une erreur est survenue<br>merci de revenir plus tard</p></h1>`)
      response = console.log("could not connect to item's API" + error);
    })
}

async function createCartItems() {
  let cartItems = [];
  for (let i = 0; i < cart.length; i++) {
    let productData = await getProductData(cart[i].id)
    const product = { ...cart[i], ...productData }
    cartItems.push(product)
  }
  return cartItems
}

async function displayCart() {
  let cartItems = await createCartItems(console.log)
  for (let item of cartItems) {
    const itemDisplay = document.querySelector('#cart__items')

    itemDisplay.innerHTML += (`<article class="cart__item" data-id="${item.id}" data-color="${item.color}">  
      <div class="cart__item__img">
        <img src="${item.imageUrl}" alt="${item.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.color}</p>
          <p">${item.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qty}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`)
  }
}

async function calcCartTotals() {
  let totalQty = 0;
  let totalPrice = 0;
  let cart = JSON.parse(localStorage.getItem('cart'))
  if (!cart || cart.length < 1) {
    checkCartStatus()
  }
  else {
    let cartItems = await createCartItems()
    for (i = 0; i < cart.length; i++) {
      let price = cartItems[i].price
      let quantity = cart[i].qty
      totalQty += parseInt(quantity);
      totalPrice += parseInt(price * quantity);
    }
    articlesTotal.innerHTML = totalQty
    priceTotal.innerHTML = new Intl.NumberFormat().format(totalPrice)
  }
}
calcCartTotals()

async function addEventListeners() {
  await displayCart()
  const qtyInputs = document.getElementsByClassName('itemQuantity')
  for (let input of qtyInputs) {
    input.addEventListener('change', updateQty)
  }
  const deleteItems = document.getElementsByClassName('deleteItem')
  for (let p of deleteItems) {
    p.addEventListener('click', removeItem)
  }
  console.log("event listener\'s listening on (" + (qtyInputs.length) + ") quantity inputs & ("
    + (deleteItems.length) + ") 'supprimer'")
}
addEventListeners()

async function updateQty(e) {
  const newQty = e.target
  console.log(newQty.value)
  // check that value entered is valid data
  if (newQty.value === 0) {
    alert("Merci de cliquez sur \"Supprimer\" pour retirer un article de votre panier")
  }
  if (newQty.value > 100 || isNaN(newQty.value)) {
    alert("Merci d\"entrer une quantité entre 1 et 100")
  }
  else {
    const changed = newQty.closest('article')
    console.log(changed.dataset.id, changed.dataset.color)
    //use map to find item and assign new quantity
    cart.map((item) => {
      if (item.id === changed.dataset.id && item.color === changed.dataset.color) {
        item.qty = Number(newQty.value)
      }
    });
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`Quantité d'article mise à jour`)
  }
  calcCartTotals()
}

async function removeItem(e) {
  let cart = JSON.parse(localStorage.getItem('cart'))
  const clicked = e.target.closest('article')
  console.log('item to be deleted: ' + clicked.dataset.id, clicked.dataset.color)
  const toDelete = cart.find(item => ((item.id && item.color) === (clicked.dataset.id && clicked.dataset.color)));
  // filter cart to consist of remaining items only
  const filtered = cart.filter(item => item !== toDelete)
  cart = localStorage.setItem('cart', JSON.stringify(filtered))
  clicked.remove(e)
  alert(`produit a été supprimé`)
  calcCartTotals()
}

// --- ORDER FORM --- //
// Variables for order form //
const form = document.querySelector(".cart__order__form");

let questions = document.querySelectorAll(".cart__order__form__question > input")
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
window.addEventListener('load', () => {
  for (let question of questions) {
    const isValid = question.value.length > 0;
    question.className = isValid ? 'valid' : 'invalid';
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
  const invalid = document.getElementsByClassName("invalid")
  if (invalid.length >= 1) {
    console.log("not all form values are valid")
  }
  else {
    submitOrder()
  }
});

//function runs if all form question inputs are valid
/* send order information to API
/* request order number in return */

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
      localStorage.clear('cart')
      console.log('localstorage cart has been cleared')
      console.log(response.orderId)
      const baseURL = "./confirmation.html?order="
      const confirmationURL = (baseURL + response.orderId)
      console.log(confirmationURL)
      window.location = confirmationURL
    })
    .catch(error => console.error('Error:', error))
}