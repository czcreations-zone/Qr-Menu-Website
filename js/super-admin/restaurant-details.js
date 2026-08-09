/*
=========================================================
CZ MENU PLATFORM
Super Admin Restaurant Details
=========================================================
*/

import {
    requireSuperAdmin,
    logoutSuperAdmin
}
from
    "./auth.js";


import {
    getRestaurant,
    updateRestaurant,
    deleteRestaurant
}
from
    "../firebase/database.js";


const restaurantId =
    new URLSearchParams(
        window.location.search
    ).get(
        "id"
    );


let restaurant =
    null;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            !await requireSuperAdmin()
        ) {

            return;

        }


        if (!restaurantId) {

            window.location.href =
                "/pages/super-admin/restaurants.html";

            return;

        }


        initializeNavigation();

        initializeBack();

        initializeLogout();

        initializeForm();

        await loadRestaurant();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadRestaurant() {

    try {

        restaurant =
            await getRestaurant(
                restaurantId
            );


        if (!restaurant) {

            window.location.href =
                "/pages/super-admin/restaurants.html";

            return;

        }


        populate();

    }

    catch (error) {

        console.error(
            "Restaurant details loading failed:",
            error
        );

    }

}


// =========================================================
// POPULATE
// =========================================================

function populate() {

    setText(
        "page-title",
        restaurant.name ||
        "[RESTAURANT NAME]"
    );


    setText(
        "restaurant-name",
        restaurant.name ||
        "[RESTAURANT NAME]"
    );


    setText(
        "restaurant-slug",
        restaurant.slug ||
        "[RESTAURANT SLUG]"
    );


    setText(
        "restaurant-description",
        restaurant.description ||
        "[RESTAURANT DESCRIPTION]"
    );


    setValue(
        "restaurant-name-input",
        restaurant.name
    );


    setValue(
        "restaurant-slug-input",
        restaurant.slug
    );


    setValue(
        "restaurant-description-input",
        restaurant.description
    );


    const published =
        document.getElementById(
            "restaurant-published"
        );


    if (published) {

        published.checked =
            restaurant.published === true;

    }


    const status =
        document.getElementById(
            "restaurant-status"
        );


    if (status) {

        status.textContent =
            restaurant.published
                ? "[PUBLISHED]"
                : "[UNPUBLISHED]";


        status.classList.toggle(
            "is-active",
            restaurant.published === true
        );


        status.classList.toggle(
            "is-inactive",
            restaurant.published !== true
        );

    }

}


// =========================================================
// SAVE
// =========================================================

function initializeForm() {

    document
        .getElementById(
            "restaurant-form"
        )
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await save();

            }
        );


    document
        .getElementById(
            "delete-restaurant"
        )
        ?.addEventListener(
            "click",
            removeRestaurant
        );

}


async function save() {

    const data = {

        name:
            getValue(
                "restaurant-name-input"
            ),

        slug:
            getValue(
                "restaurant-slug-input"
            ),

        description:
            getValue(
                "restaurant-description-input"
            ),

        published:
            document
                .getElementById(
                    "restaurant-published"
                )
                ?.checked === true

    };


    try {

        await updateRestaurant(
            restaurantId,
            data
        );


        restaurant = {

            ...restaurant,

            ...data

        };


        populate();


        showToast(
            "[RESTAURANT SAVED MESSAGE]",
            "success"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showToast(
            "[RESTAURANT SAVE ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// DELETE
// =========================================================

async function removeRestaurant() {

    const confirmed =
        window.confirm(
            "[DELETE RESTAURANT CONFIRMATION MESSAGE]"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteRestaurant(
            restaurantId
        );


        window.location.href =
            "/pages/super-admin/restaurants.html";

    }

    catch (error) {

        console.error(
            "Restaurant deletion failed:",
            error
        );


        showToast(
            "[RESTAURANT DELETE ERROR MESSAGE]",
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


function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ||
            "";

    }

}


function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "super-dashboard-toast"
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


    setTimeout(
        () => {

            toast.hidden =
                true;

        },
        3500
    );

}
