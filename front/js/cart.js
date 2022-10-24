// get all product data from API
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((allProducts) => cartItems(allProducts))

  .catch((error) => {
    document.getElementById("cartAndFormContainer").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

// filter API product data ('catalog') using product/color combinations in cart
/* returns data for use in DOM manipulation */
function cartItems(allProducts) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  console.log(cart)

  const catalog = allProducts.flatMap(product => {
    return product.colors.map(color => {
      return {
        id: product._id,
        color: color,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        altTxt: product.altTxt,
      };
    });
  });
  console.log(catalog)

  const cartProdData = catalog.filter(function (catalog_el) {
    return cart.filter(function (cart_el) {
      return ((cart_el.id === catalog_el.id) && (cart_el.color === catalog_el.color));
    }).length != 0
  });
  console.log(cartProdData)
}

/* UNDER CONSTRUCTION */
function displayCartItems(cartProdData) {
  let cartItem = document.createElement("ARTICLE");

  for (let article of cartProdData) {
    cartItem.innerHTML += (`<article class="cart__item" data-id="${article.id}" data-color="${article.color}">  
    <div class="cart__item__img">
        <img src="${article.imageUrl}" alt="${article.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>${article.color}</p>
          <p>${article.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>`);
  } document.getElementById('cart__items')[0].appendChild(cartItem);
}