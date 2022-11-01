// get cart items from local storage
var cart = JSON.parse(localStorage.getItem("cart")) || [];

var productIds = cart.map(cart => cart.id)
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
  .then(productData => cartDisplay(productData))

  .catch((error) => {
    document.getElementById("cartAndFormContainer").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  })

function cartDisplay(productData) {
  let cartItems = []
  let products = productData.map(({ name, imageUrl, altTxt, price }) => ({ name, imageUrl, altTxt, price }))
  for (let i = 0; i < cart.length; i++)
    cartItems.push({
      ...cart[i],
      ...products[i]
    });

  console.log(cartItems)

  for (let item of cartItems) {
    let cartDisplay = document.querySelector("#cart__items");
    cartDisplay.innerHTML += (`
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
    cartTotals()
  }

  //remove item when 'supprimer' is clicked
  var deleteItem = document.getElementsByClassName("cart__item__content__settings__delete")
  for (let i = 0; i < deleteItem.length; i++) {
    let supprimer = deleteItem[i]
    supprimer.addEventListener('click', removeItem)
  }

  function removeItem() {
    let clicked = this.closest('article')
    console.log(clicked.dataset.id, clicked.dataset.color)
    let tempCart = [];
    for (let item of cartItems) {
      let toDelete = cartItems.find(item => (item.id === clicked.dataset.id && item.color === clicked.dataset.color));
      if (item != toDelete) {
        tempCart.push(item)
        console.log(tempCart)
      }
      else {
        clicked.closest('article').remove()
      }
      var cart = tempCart
    } localStorage.setItem('cart', JSON.stringify(cart));
  }

  // update item quantity if changed in input field
  let qtyChange = document.getElementsByClassName('itemQuantity');
  for (let i = 0; i < qtyChange.length; i++) {
    let inputQty = qtyChange[i]
    inputQty.addEventListener('change', updateQty)
  }

  function updateQty(input) {
    const inputQty = input.target.valueAsNumber
    console.log(inputQty)
    let newQty = input.target.closest("article")
    console.log(newQty.dataset.id, newQty.dataset.color)
    let tempCart = [];
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    for (let item of currentCart) {
      let qtyChanged = currentCart.find(item => (item.id === newQty.dataset.id && item.color === newQty.dataset.color));
      if (inputQty === 0) { alert('Merci de cliquez sur \'Supprimer\' pour retirer un article de votre panier') }
      if (inputQty > 100) { alert('Merci d\'entrer une quantité entre 1 et 100') }
      if (item === qtyChanged) {
        item.qty = inputQty
        console.log(item)
        tempCart.push(item)
        alert('Quantité d\'article mise à jour')
      }
      else {
        tempCart.push(item)
      }
    } var cart = tempCart
    console.log(cart)
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function cartTotals() {
    let sumItems = parseInt(cart.map((item) => item.qty).reduce((x, y) => x + y, 0));

    let totalQty = document.getElementById('totalQuantity')
    totalQty.innerHTML = sumItems;

    let costValues = []
    for (let item of cartItems) {
      let itemCost = (item.price * item.qty)
      costValues.push(itemCost)
    }
    console.log(costValues)
    let totalCost = parseInt(costValues.reduce((x, y) => x + y, 0));
    console.log(totalCost)

    const cartPrice = new Intl.NumberFormat().format(totalCost)

    let totalPrice = document.getElementById('totalPrice')
    totalPrice.innerHTML = cartPrice;
  }
}

function updateTotals() {
  if (updateQty() === true || removeItem() === true) {
    cartTotals()
  }
}
