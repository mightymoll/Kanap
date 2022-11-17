/** Global Variables for:
 * defining cart
 * calculating totals
 * changing html content */

let cart = JSON.parse(localStorage.getItem('cart'));
let totalQty = 0;
let totalPrice = 0;
let header = document.querySelector("h1");
let cartList = document.getElementById("cart__items");
let articlesTotal = document.getElementById("totalQuantity").innerHTML;
let cartTotal = document.getElementById("totalPrice").innerHTML

/** Functions
 * get cart from localstorage
 * if cart is empty, show message and link to return to homepage
 * if cart is NOT empty, fetch API data and add to cart items
 * display cart */

async function getCart() {
  if (!cart || cart.length == 0) {
    header.innerHTML = (`Votre panier est vide<br><a href=./index.html style=font-size:18px;>trouvez un produit que vous allez aimer</a>`)
    articlesTotal = '0';
    cartTotal = '0';
    return console.log('cart is empty or does not exist');
  }
  else {
    await createCartItems()
    console.log('cart item data fetched')
  }
  return cart
};
getCart()
async function displayCart() {
  cart = await getCart()
  for (let item of cart) {
    cartList.innerHTML += (`<article class="cart__item" data-id="${item.id}" data-color="${item.color}">  
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
            <p class="deleteItem" onclick="removeItem()">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`)
    totalQty += item.qty
    totalPrice += (item.qty * item.price)
  };
  document.getElementById("totalQuantity").innerHTML = totalQty
  document.getElementById("totalPrice").innerHTML = (totalPrice.toLocaleString())
};

async function createCartItems() {
  cart = JSON.parse(localStorage.getItem('cart'));
  for (let item of cart) {
    let data = await getProductData()
    item['imageUrl'] = data.imageUrl;
    item['altTxt'] = data.altTxt;
    item['name'] = data.name;
    item['price'] = data.price;
  }
  console.log(cart)
};

async function getProductData() {
  cart = JSON.parse(localStorage.getItem('cart'));
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
};

if (document.readyState !== 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
}
else { ready }
function ready() {
  var deleteItem = document.getElementsByClassName("deleteItem")
  for (let i = 0; i < deleteItem.length; i++) {
    let supprimer = deleteItem[i]
    supprimer.addEventListener('click', removeItem)
  }

  var qtyInputs = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < qtyInputs.length; i++) {
    var qtyChanged = qtyInputs[i]
    qtyChanged.addEventListener('change', updateQty)
  }
};

function removeItem(event) {
  let clicked = event.currentTarget.closest('article')
  for (let item of cart) {
    if (item != clicked) {
      tempCart.push(item)
    }
  }
  clicked.remove()
  let cart = tempCart
  /*localStorage.setItem("cart", JSON.stringify(cart));*/
  console.log(cart)
}


// update item quantity if changed in input field
async function updateQty(e) {
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

/** SUBMIT ORDER SECTION **/

/* global variables for order form */
let form = document.querySelector(".cart__order__form");
let formInputs = document.querySelectorAll(".cart__order__form__question > input");

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");

let contact = {
  firstName: firstName.value,
  lastName: lastName.value,
  address: address.value,
  city: city.value,
  email: email.value
}

// Regular expressions to test if input is a valid type
const nameRGEX = /^[a-zA-Zéêëèîïâäçù ,"-]{3,20}$/;
const addressRGEX = /^[0-9]{1,3}[a-zA-Zéêëèîïâäçù ,"-]+$/;
const emailRGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Assign class name that assigns input validity when page loads
window.addEventListener('load', () => {
  for (let input of formInputs) {
    const isValid = input.value.length > 0;
    input.className = isValid ? 'valid' : 'invalid';
  }
});

// When user types in the field(s), test for validity
firstName.addEventListener("input", () => {
  let msg = document.getElementById("firstNameErrorMsg")
  const isValid = nameRGEX.test(firstName.value);
  if (isValid) {
    firstName.className = "valid";
    msg.textContent = "";
    console.log(firstName.value)
    Object.assign(contact, { firstName: firstName.value });
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
  }
  else {
    email.className = "invalid";
    msg.textContent = "Merci d\"entrer un adresse mail valide";
  }
  console.log(email.className)
});

// double check form values when 'submit' is clicked
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.getElementsByClassName('invalid').length > 0) {
    console.log("not all form values are valid")
  }
  else {
    submitOrder()
  }
});

/** send contact + order information to API
 * recieve order number in return */
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
}