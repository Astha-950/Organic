

//{Alert box for guest registration}


function showCustomAlert(message) {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertButton = document.getElementById('alertButton');

    alertMessage.textContent = message;
    alertBox.style.display = 'block';


    alertButton.onclick = function () {
        alertBox.style.display = 'none';
    };
}




// {guestRegistration.js}


$(document).ready(function () {
    $('#guestLoginButton').on('click', function () {

        fetch('http://localhost:4000/api/v1/guest/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.guestId) {
                    showCustomAlert('Guest registered successfully! ');
                    window.location.href = "index.html";
                } else {
                    showCustomAlert('Registration failed: ');
                    console.log("error", data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                showCustomAlert('An error occurred while registering the guest.');
            });
    });
});



// {Guest add to cart function}


async function addToCart(productId, quantity) {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
        alert('You need to be a guest user to add items to the cart');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/v1/add-to-cart-guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guestId: guestId,
                productId: productId,
                quantity: quantity,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Item added to cart');

            displayCart();
        } else {
            console.error('Error adding item to cart:', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// {Guest display cart function}

async function displayCart() {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
        alert('You need to be a guest user to view the cart');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/v1/get-cart-guest', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (response.ok) {
            const cart = result.cart;

            renderCartItems(cart);
        } else {
            console.error('Error fetching cart items:', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// {Guest render cart items function}



function renderCartItems(cart) {
    const cartContainer = document.getElementById('cartItemsContainer');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <p>${item.name}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ${item.price}</p>
            <button onclick="removeFromCart('${item.productId}')">Remove</button>
        `;
        cartContainer.appendChild(cartItemElement);
    });
}



// {Guest remove from cart function}


async function removeFromCart(productId) {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) {
        alert('You need to be a guest user to remove items from the cart');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/v1/remove-from-cart-guest/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Item removed from cart');
            displayCart();
        } else {
            console.error('Error removing item from cart:', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
