// import { cartItems } from "../models/cartItem.js"
// import { Product } from "../models/product.js"
let cart = []
let listProducts = []
let totalQuantity = 0

function getListProducts() {
  axios({
    url: "https://616e3665a83a850017caa886.mockapi.io/api/products",
    method: "GET",
  })
    .then((res) => {
      for (let i in res.data) {
        let id = i
        let nameAPI = res.data[i].name
        let priceAPI = res.data[i].price
        let screenAPI = res.data[i].screen
        let backCameraAPI = res.data[i].backCamera
        let frontCameraAPI = res.data[i].frontCamera
        let imgAPI = res.data[i].img
        let descAPI = res.data[i].desc
        let typeAPI = res.data[i].type

        let productAPI = new Product(
          id,
          nameAPI,
          priceAPI,
          screenAPI,
          backCameraAPI,
          frontCameraAPI,
          imgAPI,
          descAPI,
          typeAPI
        )
        listProducts.push(productAPI)
      }
      console.log(listProducts)
      renderProduct(listProducts)
    })
    .catch((err) => {
      console.log(err)
    })
}

getListProducts()

let addToCart = (id) => {
  let index = findById(id, listProducts)

  let idItem = listProducts[index].id
  let nameItem = listProducts[index].name
  let priceItem = listProducts[index].price
  let imgItem = listProducts[index].img
  let quantity = 1
  let i = findById(id, cart)

  if (i === -1) {
    let cartItem = new cartItems(idItem, nameItem, priceItem, imgItem, quantity)
    cart.push(cartItem)
  } else {
    cart[i].quantity += 1
  }

  totalQuantity++
  document.getElementById("total-qty").innerHTML = totalQuantity

  saveLocalStorage()
  renderCart(cart)
}

let plusItem = (id) => {
  let i = findById(id, cart)
  cart[i].quantity += 1
  totalQuantity++
  document.getElementById("total-qty").innerHTML = totalQuantity
  saveLocalStorage()
  renderCart(cart)
}

let subItem = (id) => {
  let i = findById(id, cart)
  if (cart[i].quantity > 1) {
    cart[i].quantity -= 1
  } else {
    deleteItem(cart[i].id)
  }
  totalQuantity--
  document.getElementById("total-qty").innerHTML = totalQuantity
  saveLocalStorage()
  renderCart(cart)
}

let deleteItem = (id) => {
  let i = findById(id, cart)
  let result = confirm("Bạn có muốn xoá sản phẩm?")
  if (result) {
    cart.splice(i, 1)
  }
  saveLocalStorage()
  renderCart(cart)
}

let clearCart = () => {
  let result = confirm("Bạn có muốn xoá giỏ hàng hiện tại?")
  if (result) {
    cart = []
    totalQuantity = 0
    document.getElementById("total-qty").innerHTML = totalQuantity
  }
  saveLocalStorage()
  renderCart(cart)
}

const purchase = () => {
  let result = confirm("Bạn muốn thanh toán?")
  let totalPrice = 0

  for (let item of cart) {
    totalPrice += item.quantity * item.price
  }

  console.log(totalPrice)
  if (result) {
    let result2 = confirm("Tổng số tiền là " + totalPrice)
    if (result2) {
      alert("Bạn đã mua hàng thành công")
      cart = []
    }
  }
  saveLocalStorage()
  renderCart(cart)
}

function renderProduct(data) {
  let contentHTML = ""

  for (let i in data) {
    var productImg = data[i].img

    contentHTML += `
    <div class="col">
    <div class="item">
      <div class="card">
        <div class="card-header">
          <img
            src="${productImg}"
            ,
            alt="${data[i].name}"
          />
        </div>
        <div class="card-content">
          <span class="price">$${data[i].price}</span>
          <p>
            Specification: <br />
            * Screen: ${data[i].screen} <br />  
            * Camera-back: ${data[i].backCamera} <br />
            * Camera-front: ${data[i].frontCamera}
          </p>
          <p class="desc">
            Description: <br />
            "${data[i].desc}"
          </p>
        </div>
      </div>
      <div class="action">
        <button id="'${data[i].id}'" class="btn-add" onclick="addToCart('${data[i].id}')"=>
          ADD TO CART
        </button>
      </div>  
    </div>
  </div>
    `
  }

  document.getElementById("list-products").innerHTML = contentHTML
}

function renderCart(data) {
  let contentHTML = ""

  for (let i in data) {
    contentHTML += `
     <div class="cart-item">
      <div class="cart-img">
        <img
        src="${data[i].img}"
        alt=""
      />
    </div>
    <p class="cart-name">${data[i].name}</p>
    <div class="quantity-change">
      <button class="btn-qty" onclick="plusItem('${data[i].id}')">
        <i class="fa-solid fa-plus"></i>
      </button>
      <p class="qty">${data[i].quantity}</p>
      <button class="btn-qty" onclick="subItem('${data[i].id}')">
        <i class="fa-solid fa-minus"></i>
      </button>
    </div>
    <span class="price">${data[i].price * data[i].quantity}$</span>
    <button class="remove" onclick="deleteItem('${data[i].id}')">
      <i class="fa-solid fa-trash"></i>
    </button>
    </div>
    `
  }
  document.getElementById("cart-items").innerHTML = contentHTML
}

function findById(id, data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return i
    }
  }
  return -1
}
//event listener
const changeDisplayCart = () =>
  (document.getElementById("cart-section").style.display = "block")
const closeCart = () =>
  (document.getElementById("cart-section").style.display = "none")

//OPEN: display cart
document.getElementById("cart-btn").addEventListener("click", changeDisplayCart)
document.getElementById("btn-close").addEventListener("click", closeCart)
document.getElementById("btn-clear").addEventListener("click", clearCart)
document.getElementById("btn-buy").addEventListener("click", purchase)
//END: display cart

//Local Storage
function saveLocalStorage() {
  var cartJSON = JSON.stringify(cart)
  localStorage.setItem("list1", cartJSON)
  var qtyJSON = JSON.stringify(totalQuantity)
  localStorage.setItem("qty", qtyJSON)
}

function getLocalStorage() {
  var cartJSON = localStorage.getItem("list1")
  if (!cartJSON) return
  var cartLocal = JSON.parse(cartJSON)
  cart = mapData(cartLocal)
  renderCart(cart)

  var qtyJSON = localStorage.getItem("qty")
  if (!qtyJSON) return
  var qtyLocal = JSON.parse(qtyJSON)
  totalQuantity = qtyLocal
  console.log(totalQuantity)
}

function mapData(data) {
  var result = []
  for (var i = 0; i < data.length; i++) {
    var copiedCartItem = data[i]
    result.push(copiedCartItem)
  }
  return result
}

getLocalStorage()
document.getElementById("total-qty").innerHTML = totalQuantity
