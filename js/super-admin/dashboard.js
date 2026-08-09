
/*
=========================================================
CZ MENU PLATFORM
Super Admin Dashboard
File:
js/super-admin/dashboard.js
=========================================================
*/

import {
    requireSuperAdmin,
    logoutSuperAdmin
}
from
    "./auth.js";


import {
    getAllRestaurants,
    getPlatformStatistics,
    getPlatformActivity
}
from
    "../firebase/database.js";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const allowed =
            await requireSuperAdmin();


        if (!allowed) {
            return;
        }


        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        await loadDashboard();

    }
);


// =========================================================
// DASHBOARD
// =========================================================

async function loadDashboard() {

    try {

        const [
            statistics,
            restaurants,
            activity
        ] =
            await Promise.all(
                [

                    getPlatformStatistics(),

                    getAllRestaurants(
                        5
                    ),

                    getPlatformActivity(
                        5
                    )

                ]
            );


        renderStatistics(
            statistics
        );


        renderRestaurants(
            restaurants
        );


        renderActivity(
            activity
        );

    }

    catch (error) {

        console.error(
            "Super admin dashboard loading failed:",
            error
        );

    }

}


// =========================================================
// STATISTICS
// =========================================================

function renderStatistics(
    statistics = {}
) {

    const container =
        document.getElementById(
            "super-statistics"
        );


    if (!container) {
        return;
    }


    const cards = [

        {
            label:
                "[TOTAL RESTAURANTS LABEL]",

            value:
                statistics.totalRestaurants ??
                0,

            icon:
                "◎"
        },

        {
            label:
                "[PUBLISHED RESTAURANTS LABEL]",

            value:
                statistics.publishedRestaurants ??
                0,

            icon:
                "◉"
        },

        {
            label:
                "[TOTAL ADMINS LABEL]",

            value:
                statistics.totalAdmins ??
                0,

            icon:
                "○"
        },

        {
            label:
                "[RECENT ACTIVITY LABEL]",

            value:
                statistics.recentActivity ??
                0,

            icon:
                "◷"
        }

    ];


    container.innerHTML =
        cards
            .map(
                card => `

                    <article
                        class="
                            super-stat-card
                            glass
                            reveal
                        "
                    >

                        <span
                            class="
                                super-stat-card__icon
                            "
                        >
                            ${card.icon}
                        </span>

                        <span>
                            ${card.label}
                        </span>

                        <strong>
                            ${card.value}
                        </strong>

                    </article>

                `
            )
            .join("");

}


// =========================================================
// RESTAURANTS
// =========================================================

function renderRestaurants(
    restaurants = []
) {

    const container =
        document.getElementById(
            "recent-restaurants"
        );


    if (!container) {
        return;
    }


    if (!restaurants.length) {

        container.innerHTML =
            `
                <div class="super-empty-state glass">

                    <strong>
                        [NO RESTAURANTS TITLE]
                    </strong>

                    <p>
                        [NO RESTAURANTS DESCRIPTION]
                    </p>

                </div>
            `;

        return;

    }


    container.innerHTML =
        restaurants
            .map(
                restaurant => `

                    <a
                        href="/pages/super-admin/restaurant-details.html?id=${encodeURIComponent(
                            restaurant.id
                        )}"
                        class="
                            super-admin-list-item
                            glass
                        "
                    >

                        <div
                            class="
                                super-admin-list-item__icon
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
                                    : "◎"
                            }
                        </div>


                        <div>

                            <strong>
                                ${escapeHTML(
                                    restaurant.name ||
                                    "[RESTAURANT NAME]"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    restaurant.slug ||
                                    "[RESTAURANT SLUG]"
                                )}
                            </span>

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

                    </a>

                `
            )
            .join("");

}


// =========================================================
// ACTIVITY
// =========================================================

function renderActivity(
    activities = []
) {

    const container =
        document.getElementById(
            "recent-activity"
        );


    if (!container) {
        return;
    }


    if (!activities.length) {

        container.innerHTML =
            `
                <div class="super-empty-state glass">

                    <strong>
                        [NO ACTIVITY TITLE]
                    </strong>

                    <p>
                        [NO ACTIVITY DESCRIPTION]
                    </p>

                </div>
            `;

        return;

    }


    container.innerHTML =
        activities
            .map(
                activity => `

                    <div
                        class="
                            super-admin-list-item
                            glass
                        "
                    >

                        <div
                            class="
                                super-admin-list-item__icon
                            "
                        >
                            ◷
                        </div>


                        <div>

                            <strong>
                                ${escapeHTML(
                                    activity.title ||
                                    "[ACTIVITY TITLE]"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    activity.description ||
                                    "[ACTIVITY DESCRIPTION]"
                                )}
                            </span>

                        </div>

                    </div>

                `
            )
            .join("");

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


    function closeSidebar() {

        sidebar?.classList.remove(
            "is-open"
        );


        if (overlay) {
            overlay.hidden = true;
        }

    }


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

function initializeBackButton() {

    document
        .getElementById(
            "super-admin-back"
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
                        "/index.html";

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
