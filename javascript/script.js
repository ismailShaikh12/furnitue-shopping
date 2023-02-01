const cartContainer = document.querySelector('.cart__container');

const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart__list');
const cartTotal = document.getElementById('cart__total__value');
const cartTotalCount = document.getElementById('cart__count');

let cartItemId = 1;

eventListners();
// All Event Listner
function eventListners() {
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });

    document.querySelector('.navbar__toggler').addEventListener('click', () => {
        document.querySelectorAll('.navbar__collapse').classList.toggle('show-navbar');
    });

    document.getElementById('cart__btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show__cart__container')
    })

    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);
}

// Update  cart   info
function updateCartInfo() {
    let cartInfo = findCartInfo();
    // console.log(cartInfo);
    cartTotalCount.textContent = cartInfo.productCount;
    cartTotal.textContent = cartInfo.total;
}
updateCartInfo();
function loadJSON() {
    fetch('furniture.json')
        .then(response => response.json())
        .then(data => {
            let html = '';
            data.forEach(product => {
                // console.log(product)
                const cate = Object.values(product).filter((value) => value.includes("Chair"))
                    .reduce((obj, value) => {
                        return Object.assign(obj, {
                            [value]: product[value]
                        });

                    }, {});
                console.log(cate)
                html += `<div class="product-item">
            <div class="product-img">
                <img src="${product.imgSrc}" alt="product image">
                <button type="button" class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i>Add To Cart
                </button>
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-category">${product.categorie}</span>
                <p class="product-price">${product.price}</p>
            </div>
        </div>
            `
            });
            productList.innerHTML = html;
        })
        .catch(error => {
            alert(`User Live Server  or local Server 
          `)
        })
}

// product purchase starts
function purchaseProduct(e) {
    // console.log(e.target);4
    if (e.target.classList.contains('add-to-cart-btn')) {
        // console.log(e.target);
        let product = e.target.parentElement.parentElement;
        // console.log(product);
        getProductInfo(product);

    }
}

// add get product info  after  add to cart button click

function getProductInfo(product) {
    let productInfo = {
        id: cartItemId,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        categorie: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemId++;
    // console.log(productInfo);

    addToCartList(productInfo);
    saveProductInStaorage(productInfo);
}
// add to selected  product  to  the  cart list 

function addToCartList(product) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart__item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
    <img src="${product.imgSrc}" alt="chair">
                                <div class="cart__item__info">
                                    <h3 class="cart__item__name">${product.name}</h3>
                                    <span class="cart__item__categories">${product.categorie}</span>
                                    <span class="cart__item__price">${product.price}</span>
                                </div>
                                <button type="button" class="cart__item__del__btn">
                                    <i class="fas fa-times"></i>
                                </button>
    `
    cartList.appendChild(cartItem);
}

// save the product in the local storage
function saveProductInStaorage(item) {
    let product = getProductFromStorage();
    // console.log(product);
    product.push(item);
    localStorage.setItem('product', JSON.stringify(product));
    updateCartInfo();
}

// get all the product  info if there is any in the local

function getProductFromStorage() {
    return localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];
    // return empty array  if  there  isn't  any product  info
}

// load cart product
function loadCart() {
    let product = getProductFromStorage();
    if (product.length < 1) {
        cartItemId = 1;  //if there is no any product  in the local storage 
    }
    else {
        cartItemId = product[product.length - 1].id;
        cartItemId++;   //else get the id of last product and increses it by one
    }
    // console.log(cartItemId);
    product.forEach(product => addToCartList(product));
}

// calculate  total price   of the  cart and other info

function findCartInfo() {
    let product = getProductFromStorage();
    // console.log(product)
    let total = product.reduce((acc, product) => {
        let price = parseFloat(product.price);
        return acc += price;
    }, 0);
    console.log(total);

    return {
        total: total.toFixed(2),
        productCount: product.length
    }
}

// delete product from cartlist and  local storage
function deleteProduct(e) {
    // console.log(e.target);
    let cartItem;
    if (e.target.tagName == "BUTTON") {
        cartItem = e.target.parentElement;
        cartItem.remove();
    } else if (e.target.tagName == "I") {
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }
    // console.log(cartItem);
    let product = getProductFromStorage();
    let updateProduct = product.filter(product => {
        return product.id != parseInt(cartItem.dataset.id);
    })
    localStorage.setItem('product',JSON.stringify(updateProduct));
    updateCartInfo();
    // console.log(product);
    // console.log(updateProduct);
    
}