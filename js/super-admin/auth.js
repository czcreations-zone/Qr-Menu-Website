/*
=========================================================
CZ MENU PLATFORM
Super Admin Authentication
File:
js/super-admin/auth.js
=========================================================
*/

import {
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin,
    observeAuth
}
from
    "../firebase/auth.js";


import {
    getCurrentAdminRecord
}
from
    "../firebase/database.js";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const page =
            getPageType();


        if (
            page ===
            "login"
        ) {

            initializeLogin();

        }


        if (
            page ===
            "protected"
        ) {

            await requireSuperAdmin();

        }

    }
);


// =========================================================
// LOGIN
// =========================================================

function initializeLogin() {

    const form =
        document.getElementById(
            "super-admin-login-form"
        );


    form?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await login();

        }
    );

}


async function login() {

    const email =
        document
            .getElementById(
                "super-admin-email"
            )
            ?.value
            ?.trim();


    const password =
        document
            .getElementById(
                "super-admin-password"
            )
            ?.value ||
        "";


    const button =
        document.getElementById(
            "super-admin-login-button"
        );


    if (
        !email ||
        !password
    ) {

        showMessage(
            "[LOGIN REQUIRED MESSAGE]",
            "error"
        );

        return;

    }


    const originalText =
        button?.textContent ||
        "Sign In";


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "[SIGNING IN TEXT]";

        }


        await loginAdmin(
            email,
            password
        );


        const admin =
            await getCurrentAdminRecord();


        if (
            admin?.role !==
            "super_admin"
        ) {

            await logoutAdmin();


            throw new Error(
                "super-admin/access-denied"
            );

        }


        window.location.href =
            "/pages/super-admin/dashboard.html";

    }

    catch (error) {

        console.error(
            "Super admin login failed:",
            error
        );


        showMessage(
            getLoginErrorMessage(
                error
            ),
            "error"
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                originalText;

        }

    }

}


// =========================================================
// PROTECTION
// =========================================================

export async function requireSuperAdmin() {

    const user =
        getCurrentAdmin();


    if (!user) {

        redirectToLogin();

        return false;

    }


    try {

        const admin =
            await getCurrentAdminRecord();


        if (
            admin?.role !==
            "super_admin"
        ) {

            await logoutAdmin();

            redirectToLogin();

            return false;

        }


        return true;

    }

    catch (error) {

        console.error(
            "Super admin verification failed:",
            error
        );


        redirectToLogin();

        return false;

    }

}


// =========================================================
// OBSERVER
// =========================================================

export function observeSuperAdmin(
    callback
) {

    return observeAuth(
        async user => {

            if (!user) {

                callback(
                    null,
                    false
                );

                return;

            }


            try {

                const admin =
                    await getCurrentAdminRecord();


                callback(
                    user,
                    admin?.role ===
                    "super_admin"
                );

            }

            catch {

                callback(
                    user,
                    false
                );

            }

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

export async function logoutSuperAdmin() {

    await logoutAdmin();


    window.location.href =
        "/pages/super-admin/login.html";

}


// =========================================================
// HELPERS
// =========================================================

function redirectToLogin() {

    window.location.href =
        "/pages/super-admin/login.html";

}


function getPageType() {

    const path =
        window.location.pathname;


    if (
        path.endsWith(
            "/login.html"
        )
    ) {

        return "login";

    }


    return "protected";

}


function showMessage(
    message,
    type = "info"
) {

    const element =
        document.getElementById(
            "super-admin-login-message"
        );


    if (!element) {
        return;
    }


    element.hidden =
        false;


    element.dataset.type =
        type;


    element.textContent =
        message;

}


function getLoginErrorMessage(
    error
) {

    const code =
        error?.code ||
        error?.message ||
        "";


    if (
        code.includes(
            "invalid-credential"
        ) ||
        code.includes(
            "wrong-password"
        )
    ) {

        return "[INVALID LOGIN MESSAGE]";

    }


    if (
        code.includes(
            "user-not-found"
        )
    ) {

        return "[ACCOUNT NOT FOUND MESSAGE]";

    }


    if (
        code.includes(
            "too-many-requests"
        )
    ) {

        return "[TOO MANY ATTEMPTS MESSAGE]";

    }


    if (
        code.includes(
            "access-denied"
        )
    ) {

        return "[SUPER ADMIN ACCESS DENIED MESSAGE]";

    }


    return "[LOGIN ERROR MESSAGE]";

}
