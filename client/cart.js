const buyerId = localStorage.getItem('buyerId');
const productContainer = document.getElementById('product-container');
let displayedProducts = 0;
let products = [];


/*{Notification function} */

function displayNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;


    document.body.appendChild(notification);


    setTimeout(() => {
        notification.remove();
    }, 1000);
}


 

// Fetch products from the database
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:4000/api/v1/getAllProduct');
        const data = await response.json();
        console.log("data", data);

        if (data.success) {
            products = data.product;
            console.log("products", products);
            displayProducts(0, 4);
        } else {
            console.error("Failed to fetch products");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}



// Function to display products dynamically
function displayProducts(startIndex, endIndex) {
    const slicedProducts = products.slice(startIndex, endIndex);

    // Append products to the container
    productContainer.innerHTML += slicedProducts.map((item) => {
        const { pid, productImage, name, price } = item;
        return `
            <div class="col-lg-3 mb-5 text-center">
                <div class="card border-0 bg-light mb-2">
                    <div class="card-body">
                        <img class='images' src="${productImage}" alt="${name}" height="90%" width="90%">
                    </div>
                </div>
                <div>
                    <h6>${name}</h6>
                    <p><i class="bi bi-currency-rupee"></i> ${price}  per Kg</p>
                    <button onclick='addtocart("${pid}")' class="btn1">Add to Cart</button>
                </div>
            </div>`;
    }).join('');

    // Update displayed product count
    displayedProducts += slicedProducts.length;

    // Disable "Load More" button if all products are displayed
    if (displayedProducts >= products.length) {
        loadMoreButton.textContent = "No more products";
        loadMoreButton.disabled = true;
    }
}

 
fetchProducts();

// Load more products on button click
const loadMoreButton = document.getElementById('loadMore');
loadMoreButton.addEventListener('click', () => {
    displayProducts(displayedProducts, displayedProducts + 4);
});



// {Add product to cart}

async function addtocart(pid) {
    const item = products.find(product => product.pid === pid);

    if (!item) {
        displayNotification('Product not found!', 'error');
        return;
    }

    const cartItem = {
        product_id: item.pid,
        buyer_id: buyerId,
        image: item.productImage,
        quantity: 1,
        price: item.price,
        description: item.description ? item.description.trim() : ''
    };

    console.log('Cart Item:', cartItem);

    try {
        const response = await fetch('http://localhost:4000/api/v1/createCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        });

        const result = await response.json();

        if (response.ok) {
            displayNotification(result.message, 'success');
            displaycart();
        } else {
            displayNotification(result.message, 'error');
        }
    } catch (error) {
        displayNotification('Error adding to cart: ', 'error');
    }
}


//{ Delete product from cart}


async function delElement(productId) {
    try {
        const response = await fetch('http://localhost:4000/api/v1/deleteitem', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                buyer_id: buyerId
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
            displayNotification('Product deleted', 'success');

            displaycart();
        } else {
            console.error('Error deleting cart item:', result.message);
            displayNotification('Error deleting product', 'error');
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
        displayNotification('Error deleting product', 'error');
    }
}


// Fetch all cart items


async function fetchCartItems() {
    try {

        const response = await fetch(`http://localhost:4000/api/v1/getAllCartItem/${encodeURIComponent(buyerId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            return result.data || [];
        } else {
            console.error('Error fetching cart items:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}


// Render cart items dynamically



function renderCart(cartItems) {
    const cartContainer = document.getElementById('cartItem');
    let total = 0;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "Your cart is empty";
        document.getElementById('total').innerHTML = "$0.00";
    } else {
        cartContainer.innerHTML = cartItems.map((item, index) => {
            const { product_id, image, name, price, quantity, _id } = item;

            const itemTotal = price * quantity;
            total += itemTotal;

            return `
                <div class='cart-item'>
                    <div class='row-img'>
                        <img class='rowimg' src="${image}" alt="${name}">
                    </div>
                    <p style='font-size:24px;'>${name}</p>
                    <h2 style='font-size:15px;'><i class="bi bi-currency-rupee"></i>${price}.00</h2> 
                    <div style='font-size:15px;' class="quant-btn">
                        <button onclick='decQuantity(${index})'>-</button>
                        <span class="ml-3 mr-3">${quantity}</span>
                        <button onclick='incQuantity(${index})'>+</button>
                    </div>
                    <i class='fa-solid fa-trash' onclick='delElement("${product_id}")'></i>
                </div>
            `;
        }).join('');

        document.getElementById('total').innerHTML = `<i class="bi bi-currency-rupee"></i> ${total.toFixed(2)}`;
    }
}



// Fetch and display cart items


async function displaycart() {
    const cartItems = await fetchCartItems();
    renderCart(cartItems);
}


//{ Increase quantity of cart items}

 


async function incQuantity(index) {
    try {
        const cartItems = await fetchCartItems();
        const item = cartItems[index];
        const updatedQuantity = (item.quantity || 0) + 0.25;

        const response = await fetch('http://localhost:4000/api/v1/updateCart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: item.product_id,
                buyer_id: buyerId,
                quantity: updatedQuantity
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
            displaycart();
        } else {
            console.error('Error updating quantity:', result.message);
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}


// {Decrease the quantity of an item in the cart}



async function decQuantity(index) {
    try {
        const cartItems = await fetchCartItems();
        const item = cartItems[index];
        const updatedQuantity = Math.max((item.quantity || 0) - 0.25, 0.25);

        // Update the cart on the backend
        const response = await fetch('http://localhost:4000/api/v1/updateCart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: item.product_id,
                buyer_id: buyerId,
                quantity: updatedQuantity
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
            displaycart();
        } else {
            console.error('Error updating quantity:', result.message);
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

// {Toggle cart visibility}

async function setupCartToggle() {
    const cart = document.getElementById("mycart");
    const toggleCartButton = document.getElementById("toggleCart");

    toggleCartButton.addEventListener('click', async () => {
        // Toggle the visibility of the cart
        if (cart.classList.contains('visible')) {
            cart.classList.remove('visible');
        } else {
            cart.classList.add('visible');


            await displaycart();
        }
    });
}


setupCartToggle();







