// get cart items from local storage
var cart = JSON.parse(localStorage.getItem("cart"));

let productIds = cart.map(cart => cart.id)
console.log(productIds);

let baseURL = "http://localhost:3000/api/products";
let productUrls = productIds.map((productId) => {
  return `${baseURL}/${productId}`
})
console.log(productUrls);

let getProductData = productUrls.map(url => fetch(url))

Promise.all(getProductData)
  .then(responses => {
    return responses;
  })
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(productData => productArray(productData))

  .catch((error) => {
    document.getElementById("cartAndFormContainer").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

let cartItems = []

function productArray(productData) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let products = productData.map(({ name, imageUrl, altTxt, price }) => ({ name, imageUrl, altTxt, price }))
  for (let i = 0; i < cart.length; i++)
    cartItems.push({
      ...cart[i],
      ...products[i]
    });
  console.log(cartItems)
  cartDisplay()
}

function cartDisplay() {
  if (cartItems.length < 1) {
    document.getElementById("cartAndFormContainer").innerHTML = "<h1>Votre panier est vide<br><a href=./index.html style=font-size:18px;>trouvez un produit que vous allez adorer</a></h1>";
  }
  else {
    for (let item of cartItems) {
      let displayCart = document.querySelector("#cart__items");
      displayCart.innerHTML += (`
      <article class="cart__item" data-id="${item.id}" data-color="${item.color}">  
      <div class="cart__item__img">
        <img src="${item.imageUrl}" alt="${item.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.color}</p>
          <p>${item.price}€</p>
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
    </article> `)
    }
    cartTotals();
  }

  //remove item when "supprimer" is clicked
  var deleteItem = document.getElementsByClassName("deleteItem")
  for (let i = 0; i < deleteItem.length; i++) {
    let supprimer = deleteItem[i]
    supprimer.addEventListener("click", removeItem)
  }

  function removeItem(event) {
    let clicked = event.target.closest("article")
    console.log(clicked.dataset.id, clicked.dataset.color)
    let tempCart = [];
    for (let item of cartItems) {
      let toDelete = cartItems.find(item => (item.id === clicked.dataset.id && item.color === clicked.dataset.color));
      if (item != toDelete) {
        tempCart.push(item)
      }
      else {
        console.log(item)
        clicked.remove()
      }
    }
    console.log(tempCart)
    let cart = tempCart
    localStorage.setItem("cart", JSON.stringify(cart))
    cartTotals()
  }

  // update item quantity if changed in input field
  let qtyChange = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < qtyChange.length; i++) {
    var inputQty = qtyChange[i]
    inputQty.addEventListener("change", updateQty)
  }

  function updateQty() {
    let newQty = inputQty.valueAsNumber
    let changedQty = inputQty.closest("article")
    console.log(changedQty.dataset.id, changedQty.dataset.color)
    let tempCart = [];
    for (let item of cartItems) {
      let qtyChanged = cartItems.find(item => (item.id === changedQty.dataset.id && item.color === changedQty.dataset.color));
      if (inputQty === 0) { alert("Merci de cliquez sur \"Supprimer\" pour retirer un article de votre panier") }
      if (inputQty > 100) { alert("Merci d\"entrer une quantité entre 1 et 100") }
      if (item === qtyChanged) {
        item.qty = newQty
        console.log(item)
        tempCart.push(item)
        alert("Quantité d\"article mise à jour")
      }
      else {
        tempCart.push(item)
      }
    }
    let cart = tempCart
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart)
    cartTotals();
  }

  function cartTotals() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let itemQuantities = [];
    let costValues = [];

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i]
      itemQuantities.push(Number(item.qty))
      let itemCost = (item.price * item.qty)
      costValues.push(itemCost)
    }

    let sumItems = parseInt(itemQuantities.reduce((x, y) => x + y, 0));
    let showTotalQty = document.getElementById("totalQuantity")
    showTotalQty.innerHTML = sumItems;

    let totalCost = parseInt(costValues.reduce((x, y) => x + y, 0));
    console.log(totalCost)

    const cartPrice = new Intl.NumberFormat().format(totalCost)

    let showTotalPrice = document.getElementById("totalPrice")
    showTotalPrice.innerHTML = cartPrice;
  }
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
    const isValid = question.value.length === 0;
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

async function submitOrder() {
  const products = cart.map(item => item.id)
  const order = { contact, products }
  console.log(order)

  await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  })
    .then(response => response.json())
    .then(response => console.log(response.orderId))

    .catch(error => console.error('Error:', error));
}