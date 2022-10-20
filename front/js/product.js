// Get product id from url & store it in variable 'productId'
/* create variable for search parameters (searches url listed in browser window)
/* productId = value associated with '_id' after applying search parameters 
/* log result in console for verification */

let searchUrl = new URLSearchParams(window.location.search)
let productId = searchUrl.get('_id');
console.log(productId);

// Get product information for use in DOM manipulation
/* create url that returns only the array associated with the product id
/* log result in console for verification

/* fetch product information from API
/* create .json and log response
/* then run 'productDisplay' function
/* if no response, place 404 error in h1 title of page */

let productInfo = "http://localhost:3000/api/products/" + productId;
console.log(productInfo);

fetch(productInfo)
  .then((response) => response.json())
  .then((product) => productDetails(product))

  .catch((error) => {
    document.getElementsByClassName(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });


function productDetails(product) {
  const item = product; //make 'product' object iterable
  console.log(item); //log results for verification
  // photo //
  let img = document.createElement("img"); //create img in DOM w/product values
  img.src = item.imageUrl;
  img.alt = item.altTxt;
  document.getElementsByClassName('item__img')[0].appendChild(img); //add img element to DOM

  // name //
  let name = document.getElementById('title');
  name.innerHTML += (`<h1>${item.name}</h1>`);

  // price //
  let price = document.getElementById('price');
  price.innerHTML += (`<span>${item.price}</span>`);

  // description //
  let productDesc = document.getElementById('description');
  productDesc.innerHTML += (`<p>${item.description}</p>`);

  // color select //
  let colors = item.colors;
  console.log(colors); //for verification purposes

  // Until number of colors = 0
  /* continue to add <option> elements to DOM 
  /* with values from 'colors' array */

  //i represents the variable 'colors'

  for (let i = 0; i < colors.length; i++) {
    let colorName = colors[i];
    const option = document.createElement("option");
    option.textContent = colorName;
    option.value = colorName;
    const optionAdd = document.getElementById('colors'); //location of select dropdown
    optionAdd.appendChild(option);
  }
}
