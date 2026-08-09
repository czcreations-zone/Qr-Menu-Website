/*
=========================================================
CZ MENU PLATFORM
Restaurant Admin Activity
File:
js/admin/activity.js
=========================================================
*/

let activities = [];


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeNavigation();

        initializeBackButton();

        initializeLogout();

        initializeFilter();

        await loadActivity();

    }
);


// =========================================================
// LOAD
// =========================================================

async function loadActivity() {

    try {

        const activityModule =
            await import(
                "../firebase/activity-log.js"
            );


        if (
            typeof activityModule.getRestaurantActivity ===
            "function"
        ) {

            activities =
                await activityModule.getRestaurantActivity() ||
                [];

        }

        else {

            activities =
                [];

        }


        renderActivity();

    }

    catch (error) {

        console.error(
            "Activity loading failed:",
            error
        );


        activities =
            [];

        renderActivity();

    }

}


// =========================================================
// FILTER
// =========================================================

function initializeFilter() {

    document
        .getElementById(
            "activity-filter"
        )
        ?.addEventListener(
            "change",
            renderActivity
        );

}


// =========================================================
// RENDER
// =========================================================

function renderActivity() {

    const container =
        document.getElementById(
            "activity-list"
        );


    const empty =
        document.getElementById(
            "activity-empty"
        );


    const filter =
        document
            .getElementById(
                "activity-filter"
            )
            ?.value ||
        "all";


    if (
        !container ||
        !empty
    ) {
        return;
    }


    const filtered =
        activities.filter(
            activity =>
                filter === "all" ||
                activity.type ===
                filter
        );


    container.innerHTML =
        "";


    if (!filtered.length) {

        empty.hidden =
            false;

        return;

    }


    empty.hidden =
        true;


    container.innerHTML =
        filtered
            .map(
                renderActivityItem
            )
            .join("");

}


// =========================================================
// ITEM
// =========================================================

function renderActivityItem(
    activity
) {

    const date =
        formatDate(
            activity.createdAt ||
            activity.timestamp
        );


    const type =
        activity.type ||
        "system";


    return `

        <article
            class="
                admin-activity-item
                glass
            "
        >

            <div
                class="
                    admin-activity-item__icon
                "
            >
                ${getActivityIcon(
                    type
                )}
            </div>


            <div
                class="
                    admin-activity-item__content
                "
            >

                <strong>
                    ${escapeHTML(
                        activity.title ||
                        "[ACTIVITY TITLE]"
                    )}
                </strong>


                <p>
                    ${escapeHTML(
                        activity.description ||
                        "[ACTIVITY DESCRIPTION]"
                    )}
                </p>


                <span>
                    ${escapeHTML(
                        date
                    )}
                </span>

            </div>

        </article>

    `;

}


function getActivityIcon(
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
            overlay.hidden = true;
        }

    }


    menu?.addEventListener(
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

function formatDate(
    value
) {

    if (!value) {

        return "[DATE / TIME]";

    }


    let date;


    if (
        typeof value?.toDate ===
        "function"
    ) {

        date =
            value.toDate();

    }

    else {

        date =
            new Date(
                value
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
