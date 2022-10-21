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
  .then((product) => productDetails(product))

  .catch((error) => {
    document.getElementsByClassName(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

// populate DOM with product info from API
function productDetails(product) {
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
    option.textContent = colorName;
    option.value = colorName;
    const optionAdd = document.getElementById('colors'); //location of select dropdown
    optionAdd.appendChild(option);
  }
}

// log customer choices

// button - set click event
/* when button is clicked, run function 'addToCart' */
let button = document.getElementById('addToCart');
button.addEventListener("click", addToCart);

// create cart item (product w/customer selections) map to store locally
/* retrieve selected color and item quantity from DOM
/* create map 'cartItem' (product id, color choice, quantity)
/* if color and quantity are both complete, set cartItem in localstorage (stringified for easy retrieval)
/* if not, prompt user to check that they have selected a color and entered a quantity */

function addToCart() {
  let selectedColor = document.getElementById('colors').selectedOptions[0].value;
  let itemQuantity = document.getElementById('quantity').value;

  let cartItem = new Map();
  cartItem.set('product', productId)
    .set('color', selectedColor)
    .set('quantity', itemQuantity);

  if (selectedColor && itemQuantity > 0) {
    localStorage.setItem('cartItem', JSON.stringify(Map))
    alert('Article ajouté au panier avec succès');
  }
  else {
    console.log("product options incomplete");
    alert('Assurez-vous d\'avoir choisi une couleur et une quantité pour ce produit')
  }
}
