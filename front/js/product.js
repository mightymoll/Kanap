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
  .then((response) => console.log(response))
  .then(() => productDisplay())

  .catch((error) => {
    document.getElementsByClassName(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });


/*
function productDisplay() {
  const { imgUrl, altTxt, name, price, description, colors } = attributes;
  let info = document.querySelector("#items");
  for (let product of all) {
    info.innerHTML +=
      //product image and alt info
      let img = document.createElement('img');
    img.src = imgUrl;
    img.alt = altTxt;
    document.getElementsByClassName('item__img')[0].appendChild(img);*/