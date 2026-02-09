const PRODUCT_URL = "https://dummyjson.com/products";
function getProducts(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.products);
      displayProduct(data.products);
    })
    .catch((err) => console.log(err));
}

getProducts(PRODUCT_URL);
const allProducts = document.querySelector(".images");
function displayProduct(products) {
  products.forEach((product) => {
    const { title, price, description, images } = product;
    const productContainer = document.createElement("div");
    productContainer.innerHTML = `
   <img
            src="${images[0]}"
            alt=""
          />
          <h2>Title: ${title}</h2>
          <p>Description: ${description}</p>
          <h3>Price: ${price}</h2>

          
  `;
    allProducts.appendChild(productContainer);
  });
}
