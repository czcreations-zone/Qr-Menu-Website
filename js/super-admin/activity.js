/*
=========================================================
CZ MENU PLATFORM
Super Admin — Platform Activity
=========================================================
*/

import {
    requireSuperAdmin,
    logoutSuperAdmin
}
from
    "./auth.js";


import {
    getPlatformActivity
}
from
    "../firebase/database.js";


let activities = [];


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

        await loadActivity();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadActivity() {

    try {

        activities =
            await getPlatformActivity(
                500
            );


        render();

    }

    catch (error) {

        console.error(
            "Platform activity loading failed:",
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
            "activity-search"
        )
        ?.addEventListener(
            "input",
            render
        );


    document
        .getElementById(
            "activity-type"
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
            "platform-activity-list"
        );


    const empty =
        document.getElementById(
            "activity-empty"
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
                "activity-search"
            )
            ?.value
            ?.trim()
            .toLowerCase() ||
        "";


    const type =
        document
            .getElementById(
                "activity-type"
            )
            ?.value ||
        "all";


    const filtered =
        activities.filter(
            activity => {

                const searchable =
                    `${activity.title || ""}
                     ${activity.description || ""}
                     ${activity.restaurantName || ""}
                     ${activity.userEmail || ""}`
                        .toLowerCase();


                return (

                    (
                        !search ||
                        searchable.includes(
                            search
                        )
                    )

                    &&

                    (
                        type === "all" ||
                        activity.type === type
                    )

                );

            }
        );


    container.innerHTML =
        filtered
            .map(
                renderItem
            )
            .join("");


    empty.hidden =
        filtered.length !== 0;

}


// =========================================================
// ITEM
// =========================================================

function renderItem(
    activity
) {

    return `

        <article
            class="
                super-activity-item
                glass
                reveal
            "
        >

            <div
                class="
                    super-activity-icon
                "
            >
                ${getIcon(
                    activity.type
                )}
            </div>


            <div
                class="
                    super-activity-content
                "
            >

                <div>

                    <strong>
                        ${escapeHTML(
                            activity.title ||
                            "[ACTIVITY TITLE]"
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            activity.restaurantName ||
                            "[RESTAURANT]"
                        )}
                    </span>

                </div>


                <p>
                    ${escapeHTML(
                        activity.description ||
                        "[ACTIVITY DESCRIPTION]"
                    )}
                </p>


                <small>
                    ${escapeHTML(
                        activity.userEmail ||
                        "[ADMIN EMAIL]"
                    )}
                    ·
                    ${formatDate(
                        activity.createdAt
                    )}
                </small>

            </div>

        </article>

    `;

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

function getIcon(
    type
) {

    const icons = {

        menu:
            "≡",

        restaurant:
            "◎",

        appearance:
            "✦",

        account:
            "○",

        system:
            "◷"

    };


    return (
        icons[type] ||
        icons.system
    );

}


function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "[DATE / TIME]";

    }


    let date;


    if (
        typeof timestamp.toDate ===
        "function"
    ) {

        date =
            timestamp.toDate();

    }

    else {

        date =
            new Date(
                timestamp
            );

    }


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "[DATE / TIME]";

    }


    return date.toLocaleString(
        "en-IN",
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
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
