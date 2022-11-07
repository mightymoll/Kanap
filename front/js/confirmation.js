let searchUrl = new URLSearchParams(window.location.search)
let orderId = searchUrl.get('order');
console.log(orderId);

let displayId = document.getElementById("orderId")
displayId.innerHTML += (`${orderId}`)