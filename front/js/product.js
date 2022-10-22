// Get product id from url & store it in variable 'productId'
/* create variable for search parameters (searches url listed in browser window)
/* productId = value associated with '_id' after applying search parameters 
/* log result in console for verification */

let searchUrl = new URLSearchParams(window.location.search)
let productId = searchUrl.get('_id');
console.log(productId);

//* create url that returns only the array associated with the product id
/* log result in console for verification */

let productInfo = "http://localhost:3000/api/products/" + productId;
console.log(productInfo);

// get product array from API
/* convert to .json and log response
/* then run 'productDisplay' function
/* if no response, place 404 error in h1 title of page */

fetch(productInfo)
  .then((response) => response.json())
  .then((product) => productDisplay(product))

  .catch((error) => {
    document.getElementsByClassName(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

// populate DOM with product info from API
function productDisplay(product) {
  const item = product; //make 'product' object iterable
  console.log(item); //log results for verification

  // product image //
  let img = document.createElement("img"); //create img in DOM w/product values
  img.src = item.imageUrl;
  img.alt = item.altTxt;
  document.getElementsByClassName('item__img')[0].appendChild(img); //add img element to DOM

  // product name //
  let name = document.getElementById('title');
  name.innerHTML += (`<h1>${item.name}</h1>`);

  // product price //
  let price = document.getElementById('price');
  price.innerHTML += (`<span>${item.price}</span>`);

  // product description //
  let productDesc = document.getElementById('description');
  productDesc.innerHTML += (`<p>${item.description}</p>`);

  // product select color options //
  /* Until number of colors (i) = 0,
  /* add 1 new <option> element to DOM with values from 'colors' */

  let colors = item.colors;
  console.log(colors); //for verification purposes

  for (let i = 0; i < colors.length; i++) {
    let colorName = colors[i];
    const option = document.createElement("option");
    option.value = colorName;
    option.textContent = colorName;
    const optionAdd = document.getElementById('colors'); //location of select dropdown
    optionAdd.appendChild(option);
  }
}

// set button event - when clicked, run function 'logOptions' */

let button = document.getElementById('addToCart');
button.addEventListener("click", logOptions);

// log customer product choices
/* retrieve selected color and item quantity from DOM
/* define variable for 'productToAdd' (to cart)
/* if both a color and qty are entered, run function 'addToCart'
/* if not, alert customer to complete selections */

function logOptions() {
  let productColor = document.getElementById('colors').value;
  console.log(productColor);

  let productQty = Number(document.getElementById('quantity').value);
  console.log(productQty);

  var productToAdd = {
    id: (`${productId}`),
    color: (`${productColor}`),
    qty: (`${productQty}`)
  }
  console.log(productToAdd)

  if (productColor !== "" && productQty > 0) {
    addToCart(productToAdd)
  }
  else {
    console.log("product options incomplete");
    alert('Merci de choisir une couleur ET une quantité pour ce produit')
  }
}

// Add product to cart in local storage 
/* get current 'cart' array from local storage
/* if no cart found, create cart array and add product
/* if cart is not empty:
/* add product if no existing product with same color color
/* if existing product/color item, update quantity value only */

function addToCart(productToAdd) {
  var cart = JSON.parse(localStorage.getItem('cart'));

  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', '[]');
  }

  if (cart.length === 0) {
    cart.push(productToAdd);
    alert('Article ajouté au panier avec succès!');
  }
  else {
    let res = cart.find(element => (element.id === productToAdd.id && element.color === productToAdd.color));

    if (res === undefined) {
      cart.push(productToAdd);
      alert('Article ajouté au panier avec succès!');
    }
    else {
      cart.find(element => (element.quantity += productToAdd.quantity));
      cart.push(element.quantity);
      alert('Quantité d\'article mise à jour dans le panier!');
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}
