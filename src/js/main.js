// counter shop
const counter = document.querySelector('.menu__counter-number');
const product = document.querySelectorAll('.shop__product-list-link');
var count = 0;
product.forEach(onProductClick);

function onProductClick(item) {
    item.addEventListener("click", function() {
        count = count + 1;
        counter.innerHTML = count;
    })
}