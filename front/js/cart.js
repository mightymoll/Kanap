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

  //remove item when 'supprimer' is clicked
  var deleteItem = document.getElementsByClassName("deleteItem")
  for (let i = 0; i < deleteItem.length; i++) {
    let supprimer = deleteItem[i]
    supprimer.addEventListener('click', removeItem)
  }

  function removeItem(event) {
    let clicked = event.target.closest('article')
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
    localStorage.setItem('cart', JSON.stringify(cart))
    cartTotals()
  }

  // update item quantity if changed in input field
  let qtyChange = document.getElementsByClassName('itemQuantity');
  for (let i = 0; i < qtyChange.length; i++) {
    var inputQty = qtyChange[i]
    inputQty.addEventListener('change', updateQty)
  }

  function updateQty() {
    let newQty = inputQty.valueAsNumber
    let changedQty = inputQty.closest("article")
    console.log(changedQty.dataset.id, changedQty.dataset.color)
    let tempCart = [];
    for (let item of cartItems) {
      let qtyChanged = cartItems.find(item => (item.id === changedQty.dataset.id && item.color === changedQty.dataset.color));
      if (inputQty === 0) { alert('Merci de cliquez sur \'Supprimer\' pour retirer un article de votre panier') }
      if (inputQty > 100) { alert('Merci d\'entrer une quantité entre 1 et 100') }
      if (item === qtyChanged) {
        item.qty = newQty
        console.log(item)
        tempCart.push(item)
        alert('Quantité d\'article mise à jour')
      }
      else {
        tempCart.push(item)
      }
    }
    let cart = tempCart
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart)
    cartTotals();
  }

  function cartTotals() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let itemQuantities = [];
    let costValues = [];

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i]
      itemQuantities.push(item.qty)
      let itemCost = (item.price * item.qty)
      costValues.push(itemCost)
    }

    let sumItems = parseInt(itemQuantities.reduce((x, y) => x + y, 0));
    let showTotalQty = document.getElementById('totalQuantity')
    showTotalQty.innerHTML = sumItems;

    let totalCost = parseInt(costValues.reduce((x, y) => x + y, 0));
    console.log(totalCost)

    const cartPrice = new Intl.NumberFormat().format(totalCost)

    let showTotalPrice = document.getElementById('totalPrice')
    showTotalPrice.innerHTML = cartPrice;
  }
}

// cart order form
let firstName = document.getElementById('firstName')
let lastName = document.getElementById('lastName')
let address = document.getElementById('address')
let city = document.getElementById('city')
let email = document.getElementById('email')

let commander = document.getElementById("order");

// RGEX for form input validation
var nameRGEX = /^[a-zA-Zéêëèîïâäçù ,'-]{3,20}$/;
var addressRGEX = /^[0-9]{1,3}[a-zA-Zéêëèîïâäçù ,'-]+$/;
var emailRGEX = /^(([^<()[\]\\.,;:\s@\]+(\.[^<()[\]\\.,;:\s@\]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

// form input listeners to verify inputs
firstName.addEventListener('change', verifyFirstName)
lastName.addEventListener('change', verifyLastName)
address.addEventListener('change', verifyAddress)
city.addEventListener('change', verifyCity)
email.addEventListener('change', verifyEmail)

function verifyForm() {
  let customerData = JSON.parse(localStorage.getItem('customerData')) || [];
  let formInputs = document.getElementsByClassName('cart__order__form__question');
  for (let i = 0; i < formInputs.length; i++) {
    let response = formInputs[1].value
    if (response = true) {
      customerData.push(response)
      console.log(response)
    }
    else if (Promise.all(formInputs))
      console.log(orderInfo)
    /*submitOrder()*/
  }
  localStorage.setItem('customerData', JSON.stringify(input));
}

function verifyFirstName() {
  let msg = document.getElementById("firstNameErrorMsg")
  if (nameRGEX.test(firstName.value)) {
    msg.innerHTML += ('')
    console.log('first name validated:' + firstName.value)
    return true;
  }
  else {
    msg.innerHTML += ('Merci d\'entrer un prenom valid')
    return false;
  }
}
function verifyLastName() {
  let msg = document.getElementById("lastNameErrorMsg")
  if (nameRGEX.test(lastName.value)) {
    msg.innerHTML += ('');
    console.log('last name validated:' + lastName.value)
    return true;
  }
  else {
    msg.innerHTML += ('Merci d\'entrer un nom valid');
    return false;
  }
}

function verifyAddress() {
  let msg = document.getElementById("addressErrorMsg")
  if (addressRGEX.test(address.value)) {
    msg.innerHTML += ('')
    console.log('address validated:' + address.value)
    return true;
  }
  else {
    msg.innerHTML += ('Merci d\'entrer un address valid');
    return false;
  }
}

function verifyCity() {
  let msg = document.getElementById("cityErrorMsg")
  if (nameRGEX.test(city.value)) {
    msg.innerHTML += ('')
    console.log('city validated:' + city.value)
    return true;
  }
  else {
    msg.innerHTML += ('Merci d\'entrer une ville valide');
    return false;
  }
}

function verifyEmail() {
  let msg = document.getElementById("emailErrorMsg")
  if (emailRGEX.test(email.value)) {
    msg.innerHTML += ('')
    console.log('email validated:' + email.value)
    return true;
  }
  else {
    msg.innerHTML += ('Merci d\'entrer un adresse mail valide');
  } return false;
}

function submitOrder() {
  for (let question of formInputs) {
    console.log((question[0] + ": " + question[1].value))
    let orderInfo = Object.fromEntries(formInputs + [cart]);
    console.log(orderInfo)
  }
  localStorage.setItem('order', JSON.stringify(orderInfo)) || [];
}