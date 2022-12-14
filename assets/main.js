/* -------------------- ELEMENTS ------------------------- */

let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let discount = document.getElementById('discount');
let count = document.getElementById('count');
let total = document.getElementById('total');
let createBtn = document.getElementById('create');
let countError = document.getElementById('countError');
let tBody = document.getElementById('tBody');
let deleteContainer = document.getElementById('deleteContainer');
let searchContainer = document.getElementById('searchContainer');

// functionality mood

let mood = 'create';

let tempIndx;

/* -------------------- TOTAL PRICE ---------------------*/

function getTotal() {
  if (price.value != '' || price.value >= 0) {
    totalPrice = +price.value + +taxes.value - +discount.value;
  }
  total.innerHTML = totalPrice;
}

/* -------------------- CREATE PRODUCTS & SAVE TO LOCAL STORAGE  ------------------- */

//store products in array

let productList;

if (localStorage.product != null) {
  productList = JSON.parse(localStorage.product);
} else {
  productList = [];
}

// get the selected category

function selectedCategory() {
  let categoryList = document.getElementById('category');
  let category = categoryList.options[categoryList.selectedIndex].value;
  return category;
}

// create

createBtn.addEventListener('click', () => {
  let newProduct = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    discount: discount.value,
    count: count.value,
    total: total.innerHTML,
    category: selectedCategory(),
  };

  if (
    title.value != '' &&
    price.value != '' &&
    newProduct.category != '' &&
    newProduct.count < 200
  ) {
    if (mood === 'create') {
      if (newProduct.count > 1) {
        for (let i = 0; i < parseInt(newProduct.count); i++) {
          productList.push(newProduct);
        }
      } else {
        productList.push(newProduct);
      }
    }
    if (mood === 'update') {
      productList[tempIndx] = newProduct;
      count.style.display = 'block';
      createBtn.innerHTML = 'create';
    }
    clearInputs();
  }

  localStorage.setItem('product', JSON.stringify(productList));

  showProduct();
});

/* -------------------- CLEAR INPUT FIELDS ------------------- */

function clearInputs() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  discount.value = '';
  total.innerHTML = '';
  count.value = '';
  category.value = '';
}

/* -------------------- READ ----------------------- */

function showProduct() {
  let bodyData = '';
  for (let i = 0; i < productList.length; i++) {
    let product = productList[i];
    bodyData += `<tr>
                <td>${i}</td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.taxes}</td>
                <td>${product.discount}</td>
                <td>${product.total}</td>
                <td>${product.category}</td>
                <td><button class="btn sm-padding" onClick="updateProduct(${i})">update</button></td>
                <td>
                  <button class="btn sm-padding delete_btn" onClick="deleteProduct(${i})">delete</button>
                </td>
              </tr>`;
  }

  tBody.innerHTML = bodyData;

  // display the delete button
  if (productList.length > 0) {
    deleteContainer.innerHTML = `
  <button class="btn delete_btn" id="deleteAll" onClick="deleteAll()">Delete All (${productList.length})</button>
  `;
    searchContainer.style.display = 'block';
  } else {
    deleteContainer.innerHTML = '';
  }
}

showProduct();

/* -------------------- COUNT --------------- */

//  showing error message
count.addEventListener('change', function () {
  if (count.value == '' || count.value == 0) {
    countError.classList.add('show-error');
  } else {
    countError.classList.remove('show-error');
  }
});

/* -------------------- UPDATE ---------------------- */

function updateProduct(id) {
  tempIndx = id;
  let product = productList[id];
  title.value = product.title;
  price.value = product.price;
  taxes.value = product.taxes;
  discount.value = product.discount;
  total.innerHTML = product.total;
  category.value = product.category;
  count.style.display = 'none';
  createBtn.innerHTML = 'update';
  mood = 'update';
}
/* -------------------- DELETE --------------------- */

function deleteProduct(id) {
  productList.splice(id, 1);
  localStorage.product = JSON.stringify(productList);
  showProduct();
}

/* -------------------- DLETE All products ------------------ */

function deleteAll() {
  localStorage.clear();
  productList.splice(0);
  showProduct();
  searchContainer.style.display = 'none';
}

/* -------------------- SEARCH  ----------------- */

let searchInput = document.getElementById('searchInput');
let searchPills = document.getElementById('searchPills');
let backBtn = document.getElementById('back');
let noResult = document.getElementById('noResult');

let pillsArr = [
  'TV & Home Theater',
  'Computers & Tablets',
  'Cell Phones',
  'Cameras & Camcorders',
  'Audio',
  'Wearable Technology',
  'Video Games',
  'Toys, Games & Collectibles',
];

document.getElementById('titleSearch').addEventListener('click', () => {
  searchInput.placeholder = 'search by title';
  searchInput.style.display = 'block';
  searchPills.style.display = 'none';
  backBtn.style.display = 'block';
});

document.getElementById('categorySearch').addEventListener('click', () => {
  searchInput.style.display = 'none';
  let pills = '';
  for (let i = 0; i < pillsArr.length; i++) {
    let pill = pillsArr[i];
    pills += `
        <span class="search-pill" onclick="search(${i})">${pill}</span>
    `;
  }
  searchPills.innerHTML = pills;
  searchPills.style.display = 'grid';
  backBtn.style.display = 'block';
});

function search(value) {
  let bodyData = '';
  if (isNaN(value)) {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].title.includes(value)) {
        let product = productList[i];
        bodyData += `<tr>
                    <td>${i}</td>
                    <td>${product.title}</td>
                    <td>${product.price}</td>
                    <td>${product.taxes}</td>
                    <td>${product.discount}</td>
                    <td>${product.total}</td>
                    <td>${product.category}</td>
                    <td><button class="btn sm-padding" onClick="updateProduct(${i})">update</button></td>
                    <td>
                      <button class="btn sm-padding delete_btn" onClick="deleteProduct(${i})">delete</button>
                    </td>
                  </tr>`;
        noResult.innerHTML = '';
      } else {
        deleteContainer.innerHTML = '';
        bodyData = '';
        noResult.innerHTML = 'No result found';
      }
    }
  } else {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].category === pillsArr[value]) {
        let product = productList[i];
        bodyData += `<tr>
                    <td>${i}</td>
                    <td>${product.title}</td>
                    <td>${product.price}</td>
                    <td>${product.taxes}</td>
                    <td>${product.discount}</td>
                    <td>${product.total}</td>
                    <td>${product.category}</td>
                    <td><button class="btn sm-padding" onClick="updateProduct(${i})">update</button></td>
                    <td>
                      <button class="btn sm-padding delete_btn" onClick="deleteProduct(${i})">delete</button>
                    </td>
                  </tr>`;
        noResult.innerHTML = '';
      } else {
        deleteContainer.innerHTML = '';
        bodyData = '';
        noResult.innerHTML = 'No result found';
      }
    }
  }
  tBody.innerHTML = bodyData;
}

// back to original list
backBtn.addEventListener('click', () => {
  showProduct();
  searchInput.style.display = 'none';
  searchPills.style.display = 'none';
  backBtn.style.display = 'none';
});
