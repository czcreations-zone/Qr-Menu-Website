
/*
=========================================================
CZ MENU PLATFORM
Restaurant Admin Authentication UI
File:
js/admin/auth.js

Handles:
- Login
- Signup
- Forgot password
- Reset password
- Password visibility
- Form validation
- Authentication messages

Firebase authentication operations are delegated to
js/firebase/auth.js when that layer is connected.
=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePasswordToggles();

        initializeLogin();

        initializeSignup();

        initializeForgotPassword();

        initializeResetPassword();

    }
);


// =========================================================
// PASSWORD VISIBILITY
// =========================================================

function initializePasswordToggles() {

    document
        .querySelectorAll(
            "[data-password-toggle]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const field =
                            button
                                .closest(
                                    ".password-field"
                                )
                                ?.querySelector(
                                    "input"
                                );


                        if (!field) {
                            return;
                        }


                        const isPassword =
                            field.type ===
                            "password";


                        field.type =
                            isPassword
                                ? "text"
                                : "password";


                        button.textContent =
                            isPassword
                                ? "Hide"
                                : "Show";


                        button.setAttribute(
                            "aria-label",
                            isPassword
                                ? "Hide password"
                                : "Show password"
                        );

                    }
                );

            }
        );

}


// =========================================================
// LOGIN
// =========================================================

function initializeLogin() {

    const form =
        document.getElementById(
            "admin-login-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearErrors(form);


            const email =
                form.email.value.trim();


            const password =
                form.password.value;


            let valid = true;


            if (!isValidEmail(email)) {

                showFieldError(
                    form,
                    "email",
                    "[INVALID EMAIL MESSAGE]"
                );

                valid = false;

            }


            if (!password) {

                showFieldError(
                    form,
                    "password",
                    "[PASSWORD REQUIRED MESSAGE]"
                );

                valid = false;

            }


            if (!valid) {
                return;
            }


            setButtonLoading(
                form.querySelector(
                    "button[type='submit']"
                ),
                true
            );


            try {

                /*
                 * Firebase Authentication will be
                 * connected here through the central
                 * Firebase authentication layer.
                 */


                await handleLogin(
                    email,
                    password
                );

            }

            catch (error) {

                showMessage(
                    "admin-login-message",
                    getAuthErrorMessage(
                        error
                    ),
                    "error"
                );

            }

            finally {

                setButtonLoading(
                    form.querySelector(
                        "button[type='submit']"
                    ),
                    false
                );

            }

        }
    );

}


// =========================================================
// SIGNUP
// =========================================================

function initializeSignup() {

    const form =
        document.getElementById(
            "admin-signup-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearErrors(form);


            const name =
                form.name.value.trim();


            const email =
                form.email.value.trim();


            const password =
                form.password.value;


            const confirmPassword =
                form.confirmPassword.value;


            let valid = true;


            if (!name) {

                showFieldError(
                    form,
                    "name",
                    "[NAME REQUIRED MESSAGE]"
                );

                valid = false;

            }


            if (!isValidEmail(email)) {

                showFieldError(
                    form,
                    "email",
                    "[INVALID EMAIL MESSAGE]"
                );

                valid = false;

            }


            if (
                !isValidPassword(
                    password
                )
            ) {

                showFieldError(
                    form,
                    "password",
                    "[PASSWORD REQUIREMENTS]"
                );

                valid = false;

            }


            if (
                password !==
                confirmPassword
            ) {

                showFieldError(
                    form,
                    "confirmPassword",
                    "[PASSWORD MATCH MESSAGE]"
                );

                valid = false;

            }


            if (!valid) {
                return;
            }


            setButtonLoading(
                form.querySelector(
                    "button[type='submit']"
                ),
                true
            );


            try {

                await handleSignup(
                    name,
                    email,
                    password
                );

            }

            catch (error) {

                showMessage(
                    "admin-signup-message",
                    getAuthErrorMessage(
                        error
                    ),
                    "error"
                );

            }

            finally {

                setButtonLoading(
                    form.querySelector(
                        "button[type='submit']"
                    ),
                    false
                );

            }

        }
    );

}


// =========================================================
// FORGOT PASSWORD
// =========================================================

function initializeForgotPassword() {

    const form =
        document.getElementById(
            "forgot-password-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearErrors(form);


            const email =
                form.email.value.trim();


            if (!isValidEmail(email)) {

                showFieldError(
                    form,
                    "email",
                    "[INVALID EMAIL MESSAGE]"
                );

                return;

            }


            setButtonLoading(
                form.querySelector(
                    "button[type='submit']"
                ),
                true
            );


            try {

                await handleForgotPassword(
                    email
                );


                showMessage(
                    "forgot-password-message",
                    "[PASSWORD RESET EMAIL SENT MESSAGE]",
                    "success"
                );

            }

            catch (error) {

                showMessage(
                    "forgot-password-message",
                    getAuthErrorMessage(
                        error
                    ),
                    "error"
                );

            }

            finally {

                setButtonLoading(
                    form.querySelector(
                        "button[type='submit']"
                    ),
                    false
                );

            }

        }
    );

}


// =========================================================
// RESET PASSWORD
// =========================================================

function initializeResetPassword() {

    const form =
        document.getElementById(
            "reset-password-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearErrors(form);


            const password =
                form.password.value;


            const confirmPassword =
                form.confirmPassword.value;


            let valid = true;


            if (
                !isValidPassword(
                    password
                )
            ) {

                showFieldError(
                    form,
                    "password",
                    "[PASSWORD REQUIREMENTS]"
                );

                valid = false;

            }


            if (
                password !==
                confirmPassword
            ) {

                showFieldError(
                    form,
                    "confirmPassword",
                    "[PASSWORD MATCH MESSAGE]"
                );

                valid = false;

            }


            if (!valid) {
                return;
            }


            setButtonLoading(
                form.querySelector(
                    "button[type='submit']"
                ),
                true
            );


            try {

                const query =
                    new URLSearchParams(
                        window.location.search
                    );


                const actionCode =
                    query.get(
                        "oobCode"
                    );


                if (!actionCode) {

                    throw new Error(
                        "missing-reset-code"
                    );

                }


                await handleResetPassword(
                    actionCode,
                    password
                );


                showMessage(
                    "reset-password-message",
                    "[PASSWORD UPDATED MESSAGE]",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "/pages/restaurant-admin/login.html";

                    },
                    1500
                );

            }

            catch (error) {

                showMessage(
                    "reset-password-message",
                    getAuthErrorMessage(
                        error
                    ),
                    "error"
                );

            }

            finally {

                setButtonLoading(
                    form.querySelector(
                        "button[type='submit']"
                    ),
                    false
                );

            }

        }
    );

}


// =========================================================
// FIREBASE BRIDGE
// =========================================================

async function handleLogin(
    email,
    password
) {

    /*
     * This bridge intentionally keeps the page
     * independent from Firebase implementation.
     *
     * js/firebase/auth.js will provide the actual
     * authentication function.
     */

    const module =
        await import(
            "../firebase/auth.js"
        );


    if (
        typeof module.loginAdmin !==
        "function"
    ) {

        throw new Error(
            "authentication-not-configured"
        );

    }


    return module.loginAdmin(
        email,
        password
    );

}


async function handleSignup(
    name,
    email,
    password
) {

    const module =
        await import(
            "../firebase/auth.js"
        );


    if (
        typeof module.signupAdmin !==
        "function"
    ) {

        throw new Error(
            "authentication-not-configured"
        );

    }


    return module.signupAdmin(
        name,
        email,
        password
    );

}


async function handleForgotPassword(
    email
) {

    const module =
        await import(
            "../firebase/auth.js"
        );


    if (
        typeof module.sendPasswordReset !==
        "function"
    ) {

        throw new Error(
            "authentication-not-configured"
        );

    }


    return module.sendPasswordReset(
        email
    );

}


async function handleResetPassword(
    actionCode,
    password
) {

    const module =
        await import(
            "../firebase/auth.js"
        );


    if (
        typeof module.resetPassword !==
        "function"
    ) {

        throw new Error(
            "authentication-not-configured"
        );

    }


    return module.resetPassword(
        actionCode,
        password
    );

}


// =========================================================
// VALIDATION
// =========================================================

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function isValidPassword(
    password
) {

    /*
     * Keep the actual requirement centralized
     * later through config/validation.
     */

    return (
        typeof password === "string" &&
        password.length >= 8
    );

}


// =========================================================
// UI HELPERS
// =========================================================

function showFieldError(
    form,
    field,
    message
) {

    const error =
        form.querySelector(
            `[data-error-for="${field}"]`
        );


    if (error) {

        error.textContent =
            message;

    }

}


function clearErrors(
    form
) {

    form.querySelectorAll(
        ".form-error"
    )
    .forEach(
        element => {

            element.textContent =
                "";

        }
    );

}


function showMessage(
    id,
    message,
    type
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.hidden = false;

    element.textContent =
        message;


    element.dataset.type =
        type;

}


function setButtonLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.dataset.originalText =
            button.textContent;

        button.disabled =
            true;

        button.textContent =
            "[LOADING TEXT]";

    }

    else {

        button.disabled =
            false;

        button.textContent =
            button.dataset.originalText ||
            button.textContent;

    }

}


function getAuthErrorMessage(
    error
) {

    if (
        error?.message ===
        "authentication-not-configured"
    ) {

        return "[AUTHENTICATION NOT CONFIGURED MESSAGE]";

    }


    if (
        error?.message ===
        "missing-reset-code"
    ) {

        return "[INVALID RESET LINK MESSAGE]";

    }


    return (
        error?.message ||
        "[GENERIC AUTHENTICATION ERROR MESSAGE]"
    );

      }
