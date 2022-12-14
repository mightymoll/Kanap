// get products from API
/* if API responds, put data in products.json
/* then execute function 'getProducts' with data from API
/* if API does not respond, place error 404 msg in <h1> tag of html
*/


fetch('http://localhost:3000/api/products')
  .then(products => products.json())
  .then(products => showProducts(products))

  .catch((error) => {
    document.getElementsByClassName(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  })


// use data from API to change DOM of index.html 
/* create variable 'items' to be used in the 'items' section of index.html
/* use articles from the API to overwrite DOM elements
/* link to product page using product id 
/* product image and alt info
/* product name and description 
*/

function showProducts(products) {
  let product = document.querySelector("#items");
  for (let article of products) {
    product.innerHTML += (`<a href="./product.html?_id=${article._id}">
    <article>
      <img src="${article.imageUrl}" alt="${article.altTXT}"/>
      <h3>${article.name}</h3>
      <p>${article.description}</p>
    </article>
    </a>`);
  }
}
