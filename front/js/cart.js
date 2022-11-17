// Global Variables for Cart Display //
let cart = JSON.parse(localStorage.getItem('cart'))

let totalQty = 0;
let totalPrice = 0;

let header = document.querySelector("h1")
const itemDisplay = document.querySelector('#cart__items')
let articlesTotal = document.getElementById("totalQuantity")
let priceTotal = document.getElementById("totalPrice")

console.log(cart)
if (!cart || cart.length == 0) {
  header.innerHTML = (`Votre panier est vide<br><a href=./index.html style=font-size:18px;>trouvez un produit que vous allez aimer</a>`)
  console.log('cart is empty or does not exist');
}

async function displayCart() {
  for (i = 0; i < cart.length; i++) {
    const productData = await getProductData((cart[i].id))
    const item = { ...cart[i], ...productData }
    const itemCost = parseInt(item.price * item.qty)

    totalQty += item.qty
    totalPrice += itemCost

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
    articlesTotal.innerHTML = totalQty
    priceTotal.innerHTML = new Intl.NumberFormat().format(totalPrice)
  }
}

async function getProductData(id) {
  return fetch("http://localhost:3000/api/products/" + id)
    .then(res => res.json())
    .then(function (response) {
      return response;
    })
    .catch((error) => {
      totalQty = '?';
      totalPrice = '?';
      header = (`Sacre Bleu!<p style=font-size:18px;>une erreur est survenue<br>merci de revenir plus tard</p></h1>`)
      response = console.log("could not connect to item's API" + error);
    })
}
displayCart()


document.querySelectorAll('.itemQuantity').forEach(input => {
  input.addEventListener('change', updateQty)
});

document.querySelectorAll(".deleteItem").forEach(p => {
  p.addEventListener('click', removeItem)
});


// remove item if 'supprimer' is clicked
function removeItem(event) {
  getCart()
  let clicked = event.target.closest('article')
  console.log(clicked.dataset.id, clicked.dataset.color)
  const tempCart = [];
  for (let i = 0; i < cart.length; i++) {
    const toDelete = cart.find(item => (item.id === clicked.dataset.id && item.color === clicked.dataset.color));
    if (item != toDelete) {
      tempCart.push(item[qty, color, id])
    }
    else {
      console.log(item)
      clicked.remove()
    }
  }
  console.log(tempCart)
  let cart = tempCart
  /*localStorage.setItem('cart', JSON.stringify(cart))*/
}

// update item quantity if changed in input field
async function updateQty(event) {
  await displayCart()
  const newQty = event.target
  console.log(newQty.value)
  if (newQty.value === 0) {
    alert("Merci de cliquez sur \"Supprimer\" pour retirer un article de votre panier")
  }
  if ((isNan(newQty.value) || newQty.value > 100)) {
    alert("Merci d\"entrer une quantité entre 1 et 100")
  }
  else {
    const changed = newQty.closest('article')
    console.log(changed.dataset.id, changed.dataset.color)
    for (let item of cart) {
      const hasNewQty = cart.find(item => (item.id === changed.dataset.id && item.color === changed.dataset.color));
      if (item != hasNewQty) {
        tempCart.push(item[id, qty, color])
      }
      else {
        item.qty = newQty
        console.log(item)
        tempCart.push(item[id, qty, color])
        alert("Quantité d\"article mise à jour")
      }
      let cart = tempCart
      /*localStorage.setItem("cart", JSON.stringify(cart));*/
      console.log(cart)
    }
  }
}

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
      console.log(response.orderId)
      const baseURL = "./confirmation.html?order="
      const confirmationURL = (baseURL + response.orderId)
      console.log(confirmationURL)
      window.location = confirmationURL
    })
    .catch(error => console.error('Error:', error))
}