// get cart items from local storage
var cart = JSON.parse(localStorage.getItem('cart'));
console.log(cart);

var productIds = cart.map(product => product.id)
console.log(productIds);

let baseURL = "http://localhost:3000/api/products";
let productUrls = productIds.map((productId) => {
  return `${baseURL}/${productId}`
})
console.log(productUrls);

let requestData = productUrls.map(url => fetch(url));

Promise.all(requestData)
  .then(responses => {
    return responses;
  })
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(productData => displayCartItems(productData))

  .catch((error) => {
    document.getElementById("cartAndFormContainer").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

function displayCartItems(productData) {
  let cartItems = [];
  for (let i = 0; i < cart.length; i++) {
    cartItems.push({
      ...cart[i],
      ...productData[i]
    });
  }

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
          <p>${item.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" data-quantity="" min="1" max="100" value="${item.qty}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article> `)
  }

  // set variable for existing cart to compare changes to
  const product = document.querySelector('.cart__item');
  let datasetId = product.dataset.id
  let datasetColor = product.dataset.color

  var itemInCart = cart.find(function (cartItem) {
    return (cartItem['_id'] === datasetId && cartItem['color'] === datasetColor)
  })

  //remove item when 'supprimer' is clicked
  var deleteItems = document.getElementsByClassName("deleteItem")
  for (let i = 0; i < deleteItems.length; i++) {
    var supprimer = deleteItems[i]
    supprimer.addEventListener('click', removeItem)
  }

  function removeItem(event) {
    var clicked = event.target
    clicked.closest('article').remove()
    /*updateCartTotal()*/
  }

  // update item quantity if changed in input field
  var quantityInputs = document.getElementsByClassName("itemQuantity")
  for (let i = 0; i < quantityInputs.length; i++) {
    var inputQty = quantityInputs[i]
    inputQty.addEventListener('change', updateQty)
  }

  function updateQty(event) {
    var newQty = event.target.valueAsNumber

    if (isNaN(newQty) || newQty >= 101 || newQty <= 0) {
      alert('Merci d\'entrer une quantité entre 1 et 100 ou cliquez sur \'Supprimer\' pour le retirer de votre panier')
    }
    if (itemInCart && (itemInCart['qty'] != newQty)) {
      itemInCart['qty'] += newQty
    }
    /*updateCartTotal()*/
  }
}
