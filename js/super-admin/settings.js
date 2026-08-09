
/*
=========================================================
CZ MENU PLATFORM
Super Admin — Platform Settings
=========================================================
*/

import {
    requireSuperAdmin,
    logoutSuperAdmin
}
from
    "./auth.js";


import {
    getPlatformSettings,
    updatePlatformSettings
}
from
    "../firebase/database.js";


let settings = {

    platformName:
        "",

    platformDescription:
        "",

    platformActive:
        true

};


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            !await requireSuperAdmin()
        ) {

            return;

        }


        initializeNavigation();

        initializeBack();

        initializeLogout();

        initializeForm();

        await loadSettings();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadSettings() {

    try {

        const stored =
            await getPlatformSettings();


        if (stored) {

            settings = {

                ...settings,

                ...stored

            };

        }


        populate();

    }

    catch (error) {

        console.error(
            "Platform settings loading failed:",
            error
        );

        populate();

    }

}


// =========================================================
// POPULATE
// =========================================================

function populate() {

    setValue(
        "platform-name",
        settings.platformName
    );


    setValue(
        "platform-description",
        settings.platformDescription
    );


    const active =
        document.getElementById(
            "platform-active"
        );


    if (active) {

        active.checked =
            settings.platformActive !==
            false;

    }

}


// =========================================================
// FORM
// =========================================================

function initializeForm() {

    document
        .getElementById(
            "platform-settings-form"
        )
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await saveSettings();

            }
        );

}


// =========================================================
// SAVE
// =========================================================

async function saveSettings() {

    settings = {

        platformName:
            getValue(
                "platform-name"
            ),

        platformDescription:
            getValue(
                "platform-description"
            ),

        platformActive:
            document
                .getElementById(
                    "platform-active"
                )
                ?.checked === true

    };


    try {

        await updatePlatformSettings(
            settings
        );


        showToast(
            "[PLATFORM SETTINGS SAVED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Platform settings save failed:",
            error
        );


        showToast(
            "[PLATFORM SETTINGS SAVE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// NAVIGATION
// =========================================================

function initializeNavigation() {

    const sidebar =
        document.getElementById(
            "super-admin-sidebar"
        );


    const overlay =
        document.getElementById(
            "super-admin-overlay"
        );


    const open =
        document.getElementById(
            "super-sidebar-open"
        );


    const close =
        document.getElementById(
            "super-sidebar-close"
        );


    const closeSidebar =
        () => {

            sidebar?.classList.remove(
                "is-open"
            );


            if (overlay) {
                overlay.hidden = true;
            }

        };


    open?.addEventListener(
        "click",
        () => {

            sidebar?.classList.add(
                "is-open"
            );


            if (overlay) {
                overlay.hidden = false;
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

function initializeBack() {

    document
        .getElementById(
            "super-admin-back"
        )
        ?.addEventListener(
            "click",
            () => {

                window.history.back();

            }
        );

}


// =========================================================
// LOGOUT
// =========================================================

function initializeLogout() {

    document
        .getElementById(
            "super-admin-logout"
        )
        ?.addEventListener(
            "click",
            logoutSuperAdmin
        );


    document
        .getElementById(
            "settings-logout"
        )
        ?.addEventListener(
            "click",
            logoutSuperAdmin
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


function showToast(
    message,
    type = "info"
) {

    let toast =
        document.getElementById(
            "super-settings-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "super-settings-toast";


        toast.className =
            "admin-toast";


        document.body.appendChild(
            toast
        );

    }


    toast.hidden =
        false;


    toast.dataset.type =
        type;


    toast.textContent =
        message;


    clearTimeout(
        window.CZSuperSettingsToast
    );


    window.CZSuperSettingsToast =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}
