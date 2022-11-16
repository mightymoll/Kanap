// Global Variables
let cart = JSON.parse(localStorage.getItem('cart'))

let totalQty = 0;
let totalPrice = 0;

let header = document.querySelector("h1")
let cartList = document.getElementById("cart__items")
let articlesTotal = document.getElementById("totalQuantity")
let priceTotal = document.getElementById("totalPrice")

getCart().then(displayCart())

async function getCart() {
  if (!cart || cart.length == 0) {
    header.innerHTML = (`Votre panier est vide<br><a href=./index.html style=font-size:18px;>trouvez un produit que vous allez aimer</a>`)
    return console.log('cart is empty or does not exist');
  }
  else {
    await createCartItems()
    console.log('cart item data fetched')
  }
  return cart
}

async function createCartItems() {
  for (let item of cart) {
    let productData = await getProductData(item.id)
    item['imageUrl'] = productData.imageUrl;
    item['altTxt'] = productData.altTxt;
    item['name'] = productData.name;
    item['price'] = productData.price;
  }
}

async function displayCart() {
  await getCart()
  console.log(cart)
  for (let item of cart) {
    let cartListItem = document.createElement('article')
    cartListItem.innerHTML = (`<article class="cart__item" data-id="${item.id}" data-color="${item.color}">  
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
    </article>`);
    cartList.appendChild(cartListItem);

    totalQty += item.qty
    totalPrice += (item.qty * item.price)
  };
  console.log(totalPrice)
  console.log(totalQty)

  articlesTotal.innerHTML = totalQty
  priceTotal.innerHTML = new Intl.NumberFormat().format(totalPrice)
}

async function calcCartTotals() {
  await createCartItems()
  for (let item of cart) {
    let itemCost = item.qty * item.price

  }
  totalQty += item.qty
  totalPrice += itemCost
  console.log(totalQty, totalPrice)
}


async function getProductData() {
  for (let item of cart) {
    return fetch("http://localhost:3000/api/products/" + item.id)
      .then(function (res) {
        return res.json();
      })
      .catch((error) => {
        totalQty = '?';
        totalPrice = '?';
        header.innerHTML = (`Sacre Bleu!<p style=font-size:18px;>une erreur est survenue<br>merci de revenir plus tard</p></h1>`)
        console.log("could not connect to item's API" + error);
      })
  }
}

async function eventListeners() {
  document.querySelectorAll('.itemQuantity').forEach(input => {
    input.addEventListener('change', updateQty)
  });

  document.querySelectorAll(".deleteItem").forEach(p => {
    p.addEventListener('click', removeItem)
  });
}
eventListeners()


// remove item if 'supprimer' is clicked
function removeItem(event) {
  getCart()
  let clicked = event.target.closest('article')
  console.log(clicked.dataset.id, clicked.dataset.color)
  let tempCart = [];
  for (let i = 0; i < cart.length; i++) {
    let toDelete = cart.find(item => (item.id === clicked.dataset.id && item.color === clicked.dataset.color));
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
  let newQty = event.target
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
      let hasNewQty = cart.find(item => (item.id === changed.dataset.id && item.color === changed.dataset.color));
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