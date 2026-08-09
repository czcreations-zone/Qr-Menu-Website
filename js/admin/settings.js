
/*
=========================================================
CZ MENU PLATFORM
Restaurant Settings
File:
js/admin/settings.js
=========================================================
*/


let settings = {

    websiteEnabled:
        true,

    showUnavailable:
        true,

    menuSearchEnabled:
        true,

    menuFiltersEnabled:
        true

};


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        initializeForms();

        await loadSettings();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadSettings() {

    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.getCurrentRestaurant !==
            "function"
        ) {

            return;

        }


        const restaurant =
            await database.getCurrentRestaurant();


        if (
            restaurant?.settings
        ) {

            settings = {

                ...settings,

                ...restaurant.settings

            };

        }


        populateSettings();

    }

    catch (error) {

        console.error(
            "Settings loading failed:",
            error
        );

    }

}


// =========================================================
// POPULATE
// =========================================================

function populateSettings() {

    setChecked(
        "website-enabled",
        settings.websiteEnabled
    );


    setChecked(
        "show-unavailable",
        settings.showUnavailable
    );


    setChecked(
        "menu-search-enabled",
        settings.menuSearchEnabled
    );


    setChecked(
        "menu-filters-enabled",
        settings.menuFiltersEnabled
    );

}


// =========================================================
// FORM
// =========================================================

function initializeForms() {

    document
        .getElementById(
            "website-settings-form"
        )
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveSettings();

            }
        );


    document
        .getElementById(
            "copy-menu-url"
        )
        ?.addEventListener(
            "click",
            copyMenuUrl
        );


    document
        .getElementById(
            "reset-settings"
        )
        ?.addEventListener(
            "click",
            resetSettings
        );

}


// =========================================================
// SAVE
// =========================================================

async function saveSettings() {

    settings = {

        websiteEnabled:
            isChecked(
                "website-enabled"
            ),

        showUnavailable:
            isChecked(
                "show-unavailable"
            ),

        menuSearchEnabled:
            isChecked(
                "menu-search-enabled"
            ),

        menuFiltersEnabled:
            isChecked(
                "menu-filters-enabled"
            )

    };


    try {

        const database =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof database.updateCurrentRestaurant !==
            "function"
        ) {

            throw new Error(
                "settings-update-not-configured"
            );

        }


        await database.updateCurrentRestaurant(
            {
                settings
            }
        );


        showToast(
            "[SETTINGS SAVED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Settings save failed:",
            error
        );


        showToast(
            "[SETTINGS SAVE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// COPY MENU URL
// =========================================================

async function copyMenuUrl() {

    const url =
        new URL(
            "/pages/restaurant/index.html",
            window.location.origin
        )
            .href;


    try {

        await navigator.clipboard.writeText(
            url
        );


        showToast(
            "[MENU LINK COPIED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "[MENU LINK COPY ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// RESET
// =========================================================

async function resetSettings() {

    const confirmed =
        window.confirm(
            "[RESET SETTINGS CONFIRMATION MESSAGE]"
        );


    if (!confirmed) {
        return;
    }


    settings = {

        websiteEnabled:
            true,

        showUnavailable:
            true,

        menuSearchEnabled:
            true,

        menuFiltersEnabled:
            true

    };


    populateSettings();


    await saveSettings();

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
// LOGOUT
// =========================================================

function initializeLogout() {

    document
        .getElementById(
            "admin-logout"
        )
        ?.addEventListener(
            "click",
            async () => {

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
                        error
                    );

                }

            }
        );

}


// =========================================================
// HELPERS
// =========================================================

function setChecked(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.checked =
            Boolean(
                value
            );

    }

}


function isChecked(
    id
) {

    return (
        document
            .getElementById(
                id
            )
            ?.checked ===
        true
    );

}


function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "settings-toast"
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
        window.CZSettingsToastTimer
    );


    window.CZSettingsToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}
