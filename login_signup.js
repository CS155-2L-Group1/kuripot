function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

function isValidEmail(inputElement){
    return inputElement.target.value.includes("@");
}

function signupSamePassword(inputElement, inputElement2){
    return (inputElement===inputElement2);
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const forgotPasswordForm = document.querySelector("#forgotPassword");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
        forgotPasswordForm.classList.add("form--hidden");
    });

    document.querySelector("#linkForgotPassword").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.add("form--hidden");
        forgotPasswordForm.classList.remove("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        //e.preventDefault();

        window.location.href = 'index.html';

        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        let password;
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
            if (e.target.id === "signupEmail") {
                if (!isValidEmail(e))
                {
                    setInputError(inputElement, "This is not a valid email");
                }
                
            }
            if (e.target.id === "signupPassword") {
                password = e.target.value;
                setInputError(inputElement, password);
            }
            if (e.target.id === "signupConfirmPassword") {
                setInputError(inputElement, signupSamePassword(password, e.target.value));
            }
        });

})});