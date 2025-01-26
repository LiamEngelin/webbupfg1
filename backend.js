const productAmount = document.getElementById("product-amount");
const addProductButton = document.querySelectorAll(".add-product-button");
const productsInCart = document.getElementById("products-in-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Uppdatera kundvagnens produktantal
function updateCartCount() {
    const totalAmount = cart.reduce((sum, product) => sum + product.quantity, 0);
    if (productAmount) {
        productAmount.textContent = totalAmount;
    }
}

// Lägg till produkt i kundvagnen
function addProductToCart(button) {
    const productCard = button.closest(".card");
    const productName = productCard.querySelector(".product-name").textContent;
    const productPrice = parseInt(productCard.querySelector(".product-price").textContent);
    const productImage = productCard.querySelector(".product-image") ? productCard.querySelector(".product-image").getAttribute("src") : '';
    const productId = `${productName}-${productPrice}`;

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const product = {
            id: productId,
            name: productName,
            quantity: 1,
            price: productPrice,
            image: productImage
        };
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Uppdatera kundvagnens antal
    displayCart(); // Uppdatera kundvagnens visning
}

addProductButton.forEach(button => {
    button.addEventListener("click", function () {
        addProductToCart(button);
    });
});

// Visa och uppdatera kundvagnens innehåll
function displayCart() {
    if (!productsInCart) return;

    productsInCart.innerHTML = ""; // Rensa nuvarande innehåll

    if (cart.length > 0) {
        cart.forEach((product, index) => {
            const productElement = document.createElement("div");
            productElement.className = "product-item pb-2 mb-2";

            productElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" class="me-3 product-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <h5 class="mb-0">${product.name}</h5>
                            <small class="text-muted">Antal: ${product.quantity}</small>
                        </div>
                    </div>
                    <div>
                        <p class="mb-0 text-end">${product.price} SEK</p>
                        <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Ta bort</button>
                    </div>
                </div>
            `;

            productsInCart.appendChild(productElement);
        });

        // Visa totalpris
        const totalPrice = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
        const totalPriceElement = document.createElement("div");
        totalPriceElement.className = "total-price text-end mt-3";
        totalPriceElement.innerHTML = `<h5>Totalsumma: ${totalPrice} SEK</h5>`;
        productsInCart.appendChild(totalPriceElement);

        // Lägg till "Köp alla"-knappen
        const checkoutButton = document.createElement("button");
        checkoutButton.className = "btn btn-success w-100 mt-3";
        checkoutButton.textContent = "Köp alla";
        checkoutButton.addEventListener("click", () => {
            alert("Tack för ditt köp!");
            cart = []; // Töm kundvagnen
            localStorage.setItem("cart", JSON.stringify(cart)); // Spara tom kundvagn
            updateCartCount(); // Uppdatera antal produkter
            displayCart(); // Uppdatera visningen
        });
        productsInCart.appendChild(checkoutButton);

        // Lägg till funktionalitet för "Ta bort"-knapparna
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1); // Ta bort produkten från kundvagnen
                localStorage.setItem("cart", JSON.stringify(cart)); // Uppdatera localStorage
                updateCartCount(); // Uppdatera antal produkter
                displayCart(); // Uppdatera visningen
            });
        });
    } else {
        productsInCart.innerHTML = "<p>Din kundvagn är tom.</p>";
    }
}

// Initial uppdatering av kundvagnens visning
updateCartCount();
displayCart();
