const productContainer = document.getElementById("product-container");

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");

  // Adding "active" class to the "Men" tab by default
  tabs.forEach((tab) => {
    if (tab.innerText.trim() === "Men") {
      tab.classList.add("active");
    }

    tab.addEventListener("click", function () {
      tabs.forEach((e) => e.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

function DisplayProducts(category) {
  // Fetch data from the API
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
  ) // Replace with your actual API endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      const categories = data.categories || [];
      const selectedCategory = categories.find(
        (item) => item.category_name === category
      );

      if (selectedCategory) {
        const products = selectedCategory.category_products || [];
        renderProducts(products);
      } else {
        console.error(`Category "${category}" not found.`);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderProducts(products) {
  // Clearing existing products
  productContainer.innerHTML = "";

  // Render each product
  products.forEach((product) => {
    const EachProductCard = document.createElement("div");
    EachProductCard.className = "card";

    // Calculating discount percentage
    const discount = calculateDiscount(product.price, product.compare_at_price);

    // Rendering each product details
    EachProductCard.innerHTML = `
             ${
               product.badge_text !== null && product.badge_text !== undefined
                 ? `<div class="badge">${product.badge_text}</div>`
                 : ""
             }
            <img src="${product?.image}" alt="${product.title}">
            <div class="product-details">
              <div class="product-details-top">
                <h2>${
                  product?.title.split(" ").length > 2
                    ? product?.title.split(" ").slice(0, 2).join(" ") + "..."
                    : product?.title
                }</h2>
                <span class="dot"></span>
                <p> ${product?.vendor}</p>
              </div>
              <div class="product-details-bottom">
                <h3 class="discounted-price">Rs ${product?.price}</h3>
                <h3 class="original-price">${
                  product?.compare_at_price + ".00"
                }</h3>
                <h3 class="discount">${discount}% Off</h3>
              </div>
              <button class="btn">Add to Cart</button>
            </div>
        `;

    productContainer.appendChild(EachProductCard);
  });
}

function calculateDiscount(price, compare_at_price) {
  const discount = ((compare_at_price - price) / compare_at_price) * 100;
  return discount.toString().split(".").slice(0, 1);
}

// Initial category set
DisplayProducts("Men");
