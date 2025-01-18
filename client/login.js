/*{Customer Alert } */
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

//     // Handle Sign-Up form submission

document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signin-form");
    const signUpForm = document.getElementById("signup-form");
    const switchToSignUp = document.getElementById("switchToSignUp");
    const switchToSignIn = document.getElementById("switchToSignIn");

    // Switch to Sign-Up form
    switchToSignUp.addEventListener("click", (e) => {
        e.preventDefault();
        signInForm.style.opacity = 0;
        signInForm.style.visibility = 'hidden';
        signUpForm.style.opacity = 1;
        signUpForm.style.visibility = 'visible';
    });

    // Switch to Sign-In form
    switchToSignIn.addEventListener("click", (e) => {
        e.preventDefault();
        signUpForm.style.opacity = 0;
        signUpForm.style.visibility = 'hidden';
        signInForm.style.opacity = 1;
        signInForm.style.visibility = 'visible';
    });

    // Handle Sign-Up form submission
    signUpForm.addEventListener("submit", async (e) => {
        if (signUpForm.style.visibility === 'hidden') return;
        e.preventDefault();
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const phoneNo = document.getElementById("signupPhoneNo").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/v1/buyersignup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: name,
                    email: email,
                    phoneNo: phoneNo,
                    password: password,
                    confirmPassword: confirmPassword
                })
            });

            const result = await response.json();
            console.log("Response from sign-up:", result);

            if (response.ok) {
                console.log("Buyer ID stored in localStorage:", localStorage.getItem('buyerId'));
                localStorage.setItem('buyerId', result.buyerId);

                showCustomAlert("Sign-Up successful !");
                window.location.href = "index.html";
            } else {
                showCustomAlert(result.message);
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            showCustomAlert(error.message);
        }
    });

    // Handle Sign-In form submission
    signInForm.addEventListener("submit", async (e) => {
        if (signInForm.style.visibility === 'hidden') return;
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch('http://localhost:4000/api/v1/buyerlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('buyerId', result.buyerId);
                showCustomAlert('Welcome back!');
                window.location.href = "index.html";
            } else {
                showCustomAlert(result.message);
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            showCustomAlert(error.message);
        }
    });
});
