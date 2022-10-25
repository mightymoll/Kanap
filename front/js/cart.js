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
  const cart = JSON.parse(localStorage.getItem('cart'));
  console.log(cart);

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

  let itemQty = cart.map(function (item) {
    return {
      qty: item.qty
    };
  });
  console.log(itemQty)

  let cartItems = catalog.filter(function (catalog_el) {
    return cart.filter(function (cart_el) {
      return ((cart_el.id === catalog_el.id) && (cart_el.color === catalog_el.color));
    }).length != 0
  });
  console.log(cartItems)

  let addQty = Object.assign(...cartItems, ...itemQty);
  console.log(addQty)

  let cartItem = document.querySelector("#cart__items");
  for (let product of cartItems) {
    cartItem.innerHTML += (`
      <article class="cart__item" data-id="${product.id}" data-color="${product.color}">  
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${product.color}</p>
          <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`);
  }
}

