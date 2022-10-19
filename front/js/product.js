const param = new URLSearchParams(window.location.search)
const productId = param.get('_id');
console.log(productId);


fetch('http://localhost:3000/api/products')
  .then(data => data.json())
  .then(data => productInfo(data))

  .catch((error) => {
    document.getElementsByClassName(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("error 404, could not connect to API" + error);
  });

/*
function productInfo(all) {
  const { imgUrl, altTxt, name, price, description, colors } = attributes;
  let info = document.querySelector("#items");
  for (let product of all) {
    if (id = product._id) {
      info.innerHTML += 
      //product image and alt info
      let img = document.createElement('img');
      img.src = imgUrl;
      img.alt = altTxt;
      document.getElementsByClassName('item__img')[0].appendChild(img);
    }
  }
}*/