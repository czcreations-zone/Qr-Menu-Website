
/*
=========================================================
CZ MENU PLATFORM
Super Admin Restaurants
=========================================================
*/

import {
    requireSuperAdmin,
    logoutSuperAdmin
}
from
    "./auth.js";


import {
    getAllRestaurants
}
from
    "../firebase/database.js";


let restaurants = [];


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

        initializeFilters();

        await loadRestaurants();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadRestaurants() {

    try {

        restaurants =
            await getAllRestaurants(
                500
            );


        render();

    }

    catch (error) {

        console.error(
            "Restaurant loading failed:",
            error
        );

    }

}


// =========================================================
// FILTERS
// =========================================================

function initializeFilters() {

    document
        .getElementById(
            "restaurant-search"
        )
        ?.addEventListener(
            "input",
            render
        );


    document
        .getElementById(
            "restaurant-status"
        )
        ?.addEventListener(
            "change",
            render
        );

}


// =========================================================
// RENDER
// =========================================================

function render() {

    const container =
        document.getElementById(
            "restaurant-list"
        );


    const empty =
        document.getElementById(
            "restaurant-empty"
        );


    if (
        !container ||
        !empty
    ) {

        return;

    }


    const search =
        document
            .getElementById(
                "restaurant-search"
            )
            ?.value
            ?.trim()
            .toLowerCase() ||
        "";


    const status =
        document
            .getElementById(
                "restaurant-status"
            )
            ?.value ||
        "all";


    const filtered =
        restaurants.filter(
            restaurant => {

                const searchable =
                    `${restaurant.name || ""}
                     ${restaurant.slug || ""}
                     ${restaurant.city || ""}`
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesStatus =
                    status === "all" ||
                    (
                        status === "published" &&
                        restaurant.published === true
                    ) ||
                    (
                        status === "unpublished" &&
                        restaurant.published !== true
                    );


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    container.innerHTML =
        filtered
            .map(
                restaurant => `

                    <a
                        href="/pages/super-admin/restaurant-details.html?id=${encodeURIComponent(
                            restaurant.id
                        )}"
                        class="
                            super-restaurant-card
                            glass
                            reveal
                        "
                    >

                        <div
                            class="
                                super-restaurant-card__media
                            "
                        >

                            ${
                                restaurant.logo
                                    ? `
                                        <img
                                            src="${escapeAttribute(
                                                restaurant.logo
                                            )}"
                                            alt=""
                                        >
                                      `
                                    : `
                                        <span>
                                            ◎
                                        </span>
                                      `
                            }

                        </div>


                        <div
                            class="
                                super-restaurant-card__body
                            "
                        >

                            <div>

                                <span class="section-label">
                                    ${escapeHTML(
                                        restaurant.slug ||
                                        "[SLUG]"
                                    )}
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        restaurant.name ||
                                        "[RESTAURANT NAME]"
                                    )}
                                </h3>

                            </div>


                            <span
                                class="
                                    super-status
                                    ${
                                        restaurant.published
                                            ? "is-active"
                                            : "is-inactive"
                                    }
                                "
                            >
                                ${
                                    restaurant.published
                                        ? "[PUBLISHED]"
                                        : "[UNPUBLISHED]"
                                }
                            </span>

                        </div>

                    </a>

                `
            )
            .join("");


    empty.hidden =
        filtered.length !== 0;

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

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value ?? "";


    return element.innerHTML;

}


function escapeAttribute(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}
