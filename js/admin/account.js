/*
=========================================================
CZ MENU PLATFORM
Restaurant Admin Account
File:
js/admin/account.js
=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        initializeForms();

        await loadAccount();

    }
);


// =========================================================
// LOAD ACCOUNT
// =========================================================

async function loadAccount() {

    try {

        const auth =
            await import(
                "../firebase/auth.js"
            );


        if (
            typeof auth.getCurrentAdmin !==
            "function"
        ) {

            return;

        }


        const user =
            await auth.getCurrentAdmin();


        if (!user) {
            return;
        }


        setValue(
            "account-name",
            user.displayName ||
            ""
        );


        setValue(
            "account-email",
            user.email ||
            ""
        );

    }

    catch (error) {

        console.error(
            "Account loading failed:",
            error
        );

    }

}


// =========================================================
// FORMS
// =========================================================

function initializeForms() {

    document
        .getElementById(
            "profile-form"
        )
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveProfile();

            }
        );


    document
        .getElementById(
            "password-form"
        )
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await changePassword();

            }
        );


    document
        .getElementById(
            "account-logout"
        )
        ?.addEventListener(
            "click",
            logout
        );

}


// =========================================================
// PROFILE
// =========================================================

async function saveProfile() {

    const name =
        getValue(
            "account-name"
        );


    try {

        const auth =
            await import(
                "../firebase/auth.js"
            );


        if (
            typeof auth.updateAdminProfile !==
            "function"
        ) {

            throw new Error(
                "profile-update-not-configured"
            );

        }


        await auth.updateAdminProfile(
            {
                displayName:
                    name
            }
        );


        showToast(
            "[PROFILE SAVED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Profile update failed:",
            error
        );


        showToast(
            "[PROFILE SAVE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// PASSWORD
// =========================================================

async function changePassword() {

    const currentPassword =
        getValue(
            "current-password"
        );


    const newPassword =
        getValue(
            "new-password"
        );


    const confirmPassword =
        getValue(
            "confirm-password"
        );


    const message =
        document.getElementById(
            "password-message"
        );


    if (
        !newPassword ||
        newPassword.length <
        6
    ) {

        showPasswordMessage(
            "[PASSWORD REQUIREMENT MESSAGE]",
            "error"
        );

        return;

    }


    if (
        newPassword !==
        confirmPassword
    ) {

        showPasswordMessage(
            "[PASSWORD MATCH MESSAGE]",
            "error"
        );

        return;

    }


    try {

        const auth =
            await import(
                "../firebase/auth.js"
            );


        if (
            typeof auth.changeAdminPassword !==
            "function"
        ) {

            throw new Error(
                "password-change-not-configured"
            );

        }


        await auth.changeAdminPassword(
            currentPassword,
            newPassword
        );


        document
            .getElementById(
                "password-form"
            )
            ?.reset();


        showPasswordMessage(
            "[PASSWORD CHANGED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Password change failed:",
            error
        );


        showPasswordMessage(
            "[PASSWORD CHANGE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// LOGOUT
// =========================================================

async function logout() {

    try {

        const auth =
            await import(
                "../firebase/auth.js"
            );


        if (
            typeof auth.logoutAdmin ===
            "function"
        ) {

            await auth.logoutAdmin();

        }


        window.location.href =
            "/pages/restaurant-admin/login.html";

    }

    catch (error) {

        console.error(
            "Logout failed:",
            error
        );

    }

}


// =========================================================
// NAVIGATION
// =========================================================

function initializeNavigation() {

    const sidebar =
        document.getElementById(
            "admin-sidebar"
        );


    const overlay =
        document.getElementById(
            "admin-sidebar-overlay"
        );


    const menu =
        document.getElementById(
            "admin-menu-button"
        );


    const close =
        document.getElementById(
            "admin-sidebar-close"
        );


    function closeSidebar() {

        sidebar?.classList.remove(
            "is-open"
        );


        if (overlay) {

            overlay.hidden =
                true;

        }

    }


    menu?.addEventListener(
        "click",
        () => {

            sidebar?.classList.add(
                "is-open"
            );


            if (overlay) {

                overlay.hidden =
                    false;

            }

        }
    );


    close?.addEventListener(
        "click",
        closeSidebar
    );


    overlay?.addEventListener(
        "click",
        closeSidebar
    );

}


// =========================================================
// BACK
// =========================================================

function initializeBackButton() {

    document
        .getElementById(
            "admin-back-button"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    window.history.length >
                    1
                ) {

                    window.history.back();

                }

                else {

                    window.location.href =
                        "/pages/restaurant-admin/dashboard.html";

                }

            }
        );

}


// =========================================================
// PASSWORD MESSAGE
// =========================================================

function showPasswordMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "password-message"
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


// =========================================================
// TOAST
// =========================================================

function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "account-toast"
        );


    if (!toast) {
        return;
    }


    toast.hidden =
        false;


    toast.dataset.type =
        type;


    toast.textContent =
        message;


    clearTimeout(
        window.CZAccountToastTimer
    );


    window.CZAccountToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}


// =========================================================
// HELPERS
// =========================================================

function getValue(
    id
) {

    return (
        document
            .getElementById(
                id
            )
            ?.value
            ?.trim() ||
        ""
    );

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ||
            "";

    }

}
