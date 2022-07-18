function getListProduct() {
  //pending
  document.getElementById("loading").style.display = "block"

  /**
   * Promise:
   *      - Pending (chờ)
   *      - Fulfill (thành công)
   *      - Reject (thất bại)
   */

  axios({
    url: "https://616e3665a83a850017caa886.mockapi.io/api/products",
    method: "GET",
  })
    .then(function (res) {
      renderProduct(res.data)
    })
    .catch(function (error) {
      document.getElementById("loading").style.display = "none"
      console.log(error)
    })
}

getListProduct()

function createProduct() {
  var proID = document.getElementById("productId").value
  var prodName = document.getElementById("name").value
  var prodPrice = document.getElementById("price").value
  var prodScreen = document.getElementById("screen").value
  var prodBackCamera = document.getElementById("backCamera").value
  var prodFrontCamera = document.getElementById("frontCamera").value
  var prodImage = document.getElementById("img").value
  var prodDescription = document.getElementById("desc").value
  var prodType = document.getElementById("type").value

  var product = new Product(
    proID,
    prodName,
    prodPrice,
    prodScreen,
    prodBackCamera,
    prodFrontCamera,
    prodImage,
    prodDescription,
    prodType
  )

  axios({
    url: "https://616e3665a83a850017caa886.mockapi.io/api/products",
    method: "POST",
    data: product,
  })
    .then(function (res) {
      getListProduct()
      document.getElementById("btnCloseModal").click()
    })
    .catch(function (err) {
      console.log(err)
    })

  // GET POST  DELETE PATCH PUT (Restful API)
}

function deleteProduct(id) {
  axios({
    url: "https://616e3665a83a850017caa886.mockapi.io/api/products/" + id,
    method: "DELETE",
  })
    .then(function (res) {
      alert("xoá thành công")
      getListProduct()
    })
    .catch(function (err) {
      console.log(err)
    })
}

function getProduct(id) {
  axios({
    url: "https://616e3665a83a850017caa886.mockapi.io/api/products/" + id,
    method: "GET",
  })
    .then(function (res) {
      document.getElementById("btnThemSP").click()
      document.getElementById("productId").value = res.data.id
      document.getElementById("name").value = res.data.name
      document.getElementById("price").value = res.data.price
      document.getElementById("screen").value = res.data.screen
      document.getElementById("backCamera").value = res.data.backCamera
      document.getElementById("frontCamera").value = res.data.frontCamera
      document.getElementById("img").value = res.data.img
      document.getElementById("desc").value = res.data.desc
      document.getElementById("type").value = res.data.type

      document.getElementById("btnSaveInfo").style.display = "none"
      document.getElementById("btnUpdate").style.display = "inline"
    })
    .catch(function (err) {
      console.log(err)
    })
}

function updateProduct() {
  let proID = document.getElementById("productId").value
  let prodName = document.getElementById("name").value
  let prodPrice = document.getElementById("price").value
  let prodScreen = document.getElementById("screen").value
  let prodBackCamera = document.getElementById("backCamera").value
  let prodFrontCamera = document.getElementById("frontCamera").value
  let prodImage = document.getElementById("img").value
  let prodDescription = document.getElementById("desc").value
  let prodType = document.getElementById("type").value

  let product = new Product(
    proID,
    prodName,
    prodPrice,
    prodScreen,
    prodBackCamera,
    prodFrontCamera,
    prodImage,
    prodDescription,
    prodType
  )

  axios({
    url: "https://616e3665a83a850017caa886.mockapi.io/api/products/" + proID,
    method: "PUT",
    data: product,
  })
    .then(function (res) {
      document.getElementById("btnCloseModal").click()
      getListProduct()
    })
    .catch(function (err) {
      console.log(err)
    })
}

function renderProduct(data) {
  let contentHTML = ""

  for (let i in data) {
    contentHTML += `
        <tr>
            <td>${+i + 1}</td>
            <td>${data[i].name}</td>
            <td>${data[i].price}</td>
            <td>
                <img width="50px" src="${data[i].img}" alt="${data[i].name}" />
            </td>
            <td>${data[i].desc}</td>
            <td>
              <button onclick="deleteProduct(${
                data[i].id
              })" class="btn btn-danger">Xoá</button>

              <button onclick="getProduct('${
                data[i].id
              }')" class="btn btn-info">Cập nhật</button>
            </td>
      

        </tr>
    `
  }

  document.getElementById("tblDanhSachSP").innerHTML = contentHTML
}
