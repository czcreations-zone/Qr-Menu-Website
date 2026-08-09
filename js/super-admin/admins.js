/*
=========================================================
CZ MENU PLATFORM
Super Admin — Admin Management
File:
js/super-admin/admins.js
=========================================================
*/

import {
    requireSuperAdmin,
    logoutSuperAdmin
}
from
    "./auth.js";


import {
    getAllAdmins,
    getAllRestaurants,
    updateAdminRecord
}
from
    "../firebase/database.js";


let admins = [];

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

        await loadData();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadData() {

    try {

        const [
            adminRecords,
            restaurantRecords
        ] =
            await Promise.all(
                [

                    getAllAdmins(
                        500
                    ),

                    getAllRestaurants(
                        500
                    )

                ]
            );


        admins =
            adminRecords || [];


        restaurants =
            restaurantRecords || [];


        render();

    }

    catch (error) {

        console.error(
            "Admin data loading failed:",
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
            "admin-search"
        )
        ?.addEventListener(
            "input",
            render
        );


    document
        .getElementById(
            "admin-role"
        )
        ?.addEventListener(
            "change",
            render
        );


    document
        .getElementById(
            "admin-status"
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
            "admin-list"
        );


    const empty =
        document.getElementById(
            "admin-empty"
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
                "admin-search"
            )
            ?.value
            ?.trim()
            .toLowerCase() ||
        "";


    const role =
        document
            .getElementById(
                "admin-role"
            )
            ?.value ||
        "all";


    const status =
        document
            .getElementById(
                "admin-status"
            )
            ?.value ||
        "all";


    const filtered =
        admins.filter(
            admin => {

                const restaurant =
                    restaurants.find(
                        item =>
                            item.id ===
                            admin.restaurantId
                    );


                const searchable =
                    `${admin.name || ""}
                     ${admin.email || ""}
                     ${restaurant?.name || ""}`
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesRole =
                    role === "all" ||
                    admin.role === role;


                const isActive =
                    admin.active !== false;


                const matchesStatus =
                    status === "all" ||
                    (
                        status === "active" &&
                        isActive
                    ) ||
                    (
                        status === "inactive" &&
                        !isActive
                    );


                return (
                    matchesSearch &&
                    matchesRole &&
                    matchesStatus
                );

            }
        );


    container.innerHTML =
        filtered
            .map(
                admin =>
                    renderAdmin(
                        admin
                    )
            )
            .join("");


    empty.hidden =
        filtered.length !== 0;


    attachAdminActions();

}


// =========================================================
// ADMIN CARD
// =========================================================

function renderAdmin(
    admin
) {

    const restaurant =
        restaurants.find(
            item =>
                item.id ===
                admin.restaurantId
        );


    const active =
        admin.active !== false;


    return `

        <article
            class="
                super-admin-card
                glass
                reveal
            "
            data-admin-id="${escapeAttribute(
                admin.id
            )}"
        >

            <div
                class="
                    super-admin-card__top
                "
            >

                <div
                    class="
                        super-admin-avatar
                    "
                >
                    ${getInitial(
                        admin.name ||
                        admin.email ||
                        "A"
                    )}
                </div>


                <span
                    class="
                        super-status
                        ${
                            active
                                ? "is-active"
                                : "is-inactive"
                        }
                    "
                >
                    ${
                        active
                            ? "[ACTIVE]"
                            : "[INACTIVE]"
                    }
                </span>

            </div>


            <div
                class="
                    super-admin-card__body
                "
            >

                <h3>
                    ${escapeHTML(
                        admin.name ||
                        "[ADMIN NAME]"
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        admin.email ||
                        "[ADMIN EMAIL]"
                    )}
                </p>


                <span>
                    ${escapeHTML(
                        restaurant?.name ||
                        (
                            admin.role ===
                            "super_admin"
                                ? "[PLATFORM ADMIN]"
                                : "[NO RESTAURANT]"
                        )
                    )}
                </span>

            </div>


            <div
                class="
                    super-admin-card__actions
                "
            >

                <select
                    class="admin-inline-select"
                    data-action="role"
                    data-id="${escapeAttribute(
                        admin.id
                    )}"
                    aria-label="Admin role"
                >

                    <option
                        value="restaurant_admin"
                        ${
                            admin.role ===
                            "restaurant_admin"
                                ? "selected"
                                : ""
                        }
                    >
                        Restaurant Admin
                    </option>

                    <option
                        value="super_admin"
                        ${
                            admin.role ===
                            "super_admin"
                                ? "selected"
                                : ""
                        }
                    >
                        Super Admin
                    </option>

                </select>


                <button
                    type="button"
                    class="btn btn-secondary admin-toggle-button"
                    data-id="${escapeAttribute(
                        admin.id
                    )}"
                >
                    ${
                        active
                            ? "[DISABLE]"
                            : "[ENABLE]"
                    }
                </button>

            </div>

        </article>

    `;

}


// =========================================================
// ACTIONS
// =========================================================

function attachAdminActions() {

    document
        .querySelectorAll(
            ".admin-toggle-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        await toggleAdmin(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".admin-inline-select"
        )
        .forEach(
            select => {

                select.addEventListener(
                    "change",
                    async () => {

                        if (
                            select.dataset.action !==
                            "role"
                        ) {

                            return;

                        }


                        await changeRole(
                            select.dataset.id,
                            select.value
                        );

                    }
                );

            }
        );

}


// =========================================================
// TOGGLE
// =========================================================

async function toggleAdmin(
    uid
) {

    const admin =
        admins.find(
            item =>
                item.id === uid
        );


    if (!admin) {
        return;
    }


    const newStatus =
        admin.active === false;


    try {

        await updateAdminRecord(
            uid,
            {
                active:
                    newStatus
            }
        );


        admin.active =
            newStatus;


        render();

    }

    catch (error) {

        console.error(
            "Admin status update failed:",
            error
        );

    }

}


// =========================================================
// ROLE
// =========================================================

async function changeRole(
    uid,
    role
) {

    const admin =
        admins.find(
            item =>
                item.id === uid
        );


    if (!admin) {
        return;
    }


    if (
        role === "super_admin" &&
        admin.role !== "super_admin"
    ) {

        const confirmed =
            window.confirm(
                "[PROMOTE ADMIN CONFIRMATION MESSAGE]"
            );


        if (!confirmed) {

            render();

            return;

        }

    }


    try {

        await updateAdminRecord(
            uid,
            {
                role
            }
        );


        admin.role =
            role;


        render();

    }

    catch (error) {

        console.error(
            "Admin role update failed:",
            error
        );

        render();

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

function getInitial(
    value
) {

    return (
        String(
            value ||
            "A"
        )
            .trim()
            .charAt(0)
            .toUpperCase()
    );

}


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
