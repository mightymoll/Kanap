
// get all product data from API
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((allProducts) => cartProductData(allProducts))

  .catch((error) => {
    document.getElementById("cartAndFormContainer").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

// filter API product data using cart item id's
/* includes only data for products currently in the cart */

function cartProductData(allProducts) {

  let catalog = allProducts
  console.log(catalog)

  var cart = JSON.parse(localStorage.getItem('cart'));
  console.log(cart)

  const cartItems = catalog.filter(cartItem => cart.some(product =>
    cartItem._id === product._id));
  console.log(cartItems)
}