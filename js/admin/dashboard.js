
/*
=========================================================
CZ MENU PLATFORM
Restaurant Admin Dashboard
File:
js/admin/dashboard.js

Purpose:
- Dashboard initialization
- Restaurant summary
- Menu statistics
- Website status
- Template/theme information
- Recent activity
- Sidebar controls
- Logout
- Publish action

Firebase data is accessed through the central Firebase
layer rather than directly from the HTML.
=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializeSidebar();

        initializeBackButton();

        initializeProfileButton();

        initializeLogout();

        initializePublish();

        await loadDashboard();

    }
);


// =========================================================
// DASHBOARD LOAD
// =========================================================

async function loadDashboard() {

    try {

        const restaurant =
            await loadRestaurantData();


        if (!restaurant) {
            return;
        }


        window.CZAdminRestaurant =
            restaurant;


        renderRestaurantIdentity(
            restaurant
        );


        renderStatistics(
            restaurant
        );


        renderWebsiteStatus(
            restaurant
        );


        renderRecentActivity(
            restaurant.activity || []
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );


        showToast(
            "[DASHBOARD LOAD ERROR MESSAGE]",
            "error"
        );

    }

}


// =========================================================
// LOAD RESTAURANT DATA
// =========================================================

async function loadRestaurantData() {

    /*
     * Firebase database integration will provide
     * the real restaurant data.
     *
     * Keeping this behind one function prevents
     * the dashboard from becoming dependent on
     * Firebase implementation details.
     */

    try {

        const module =
            await import(
                "../firebase/database.js"
            );


        if (
            typeof module.getCurrentRestaurant !==
            "function"
        ) {

            return getDevelopmentRestaurant();

        }


        return await module.getCurrentRestaurant();

    }

    catch (error) {

        console.warn(
            "Firebase database unavailable:",
            error
        );


        return getDevelopmentRestaurant();

    }

}


// =========================================================
// DEVELOPMENT DATA
// =========================================================

function getDevelopmentRestaurant() {

    return {

        id:
            "[RESTAURANT_ID]",

        websiteId:
            "[WEBSITE_ID]",

        name:
            "[RESTAURANT NAME]",

        ownerName:
            "[OWNER NAME]",

        status:
            "active",

        template:
            "template-1",

        theme:
            "theme-1",

        menuItems:
            [],

        categories:
            [],

        activity:
            []

    };

}


// =========================================================
// RESTAURANT IDENTITY
// =========================================================

function renderRestaurantIdentity(
    restaurant
) {

    const name =
        restaurant.name ||
        "[RESTAURANT NAME]";


    const owner =
        restaurant.ownerName ||
        "[OWNER NAME]";


    const nameElement =
        document.getElementById(
            "admin-restaurant-name"
        );


    const ownerElement =
        document.getElementById(
            "admin-owner-name"
        );


    const avatar =
        document.getElementById(
            "admin-restaurant-avatar"
        );


    const profileAvatar =
        document.getElementById(
            "admin-profile-avatar"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    if (ownerElement) {

        ownerElement.textContent =
            owner;

    }


    const letter =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "R";


    if (avatar) {

        avatar.textContent =
            letter;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            (
                owner
                    .trim()
                    .charAt(0) ||
                "A"
            )
            .toUpperCase();

    }

}


// =========================================================
// STATISTICS
// =========================================================

function renderStatistics(
    restaurant
) {

    const menuItems =
        Array.isArray(
            restaurant.menuItems
        )
            ? restaurant.menuItems
            : [];


    const categories =
        Array.isArray(
            restaurant.categories
        )
            ? restaurant.categories
            : [];


    const available =
        menuItems.filter(
            item =>
                item.available !== false
        ).length;


    setText(
        "stat-menu-items",
        menuItems.length
    );


    setText(
        "stat-categories",
        categories.length
    );


    setText(
        "stat-available",
        available
    );


    setText(
        "stat-website-status",
        getStatusLabel(
            restaurant.status
        )
    );

}


// =========================================================
// WEBSITE STATUS
// =========================================================

function renderWebsiteStatus(
    restaurant
) {

    const status =
        restaurant.status ||
        "draft";


    const active =
        status === "active";


    const statusDot =
        document.getElementById(
            "admin-status-dot"
        );


    const statusText =
        document.getElementById(
            "admin-status-text"
        );


    const visual =
        document.getElementById(
            "dashboard-website-status"
        );


    const title =
        document.getElementById(
            "dashboard-website-title"
        );


    const description =
        document.getElementById(
            "dashboard-website-description"
        );


    if (statusDot) {

        statusDot.classList.toggle(
            "is-active",
            active
        );

        statusDot.classList.toggle(
            "is-inactive",
            !active
        );

    }


    if (statusText) {

        statusText.textContent =
            getStatusLabel(
                status
            );

    }


    if (visual) {

        visual.dataset.status =
            status;

        const statusSpan =
            visual.querySelector(
                "span"
            );


        if (statusSpan) {

            statusSpan.textContent =
                getStatusLabel(
                    status
                );

        }

    }


    if (title) {

        title.textContent =
            restaurant.name ||
            "[WEBSITE TITLE]";

    }


    if (description) {

        description.textContent =
            getStatusDescription(
                status
            );

    }


    setText(
        "dashboard-template",
        restaurant.template ||
        "[TEMPLATE]"
    );


    setText(
        "dashboard-theme",
        restaurant.theme ||
        "[THEME]"
    );

}


// =========================================================
// ACTIVITY
// =========================================================

function renderRecentActivity(
    activities
) {

    const container =
        document.getElementById(
            "dashboard-activity"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(
            activities
        ) ||
        !activities.length
    ) {

        container.innerHTML = `

            <div
                class="
                    admin-activity-empty
                "
            >

                <span>
                    ◷
                </span>

                <p>
                    [NO ACTIVITY MESSAGE]
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        activities
            .slice(0, 5)
            .map(
                activity =>
                    renderActivity(
                        activity
                    )
            )
            .join("");

}


function renderActivity(
    activity
) {

    return `

        <div
            class="
                admin-activity-item
            "
        >

            <div
                class="
                    admin-activity-item__icon
                "
            >
                ${escapeHTML(
                    activity.icon ||
                    "•"
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

                <span>
                    ${escapeHTML(
                        activity.description ||
                        "[ACTIVITY DESCRIPTION]"
                    )}
                </span>

            </div>


            <time>
                ${escapeHTML(
                    activity.time ||
                    "[TIME]"
                )}
            </time>

        </div>

    `;

}


// =========================================================
// SIDEBAR
// =========================================================

function initializeSidebar() {

    const sidebar =
        document.getElementById(
            "admin-sidebar"
        );


    const overlay =
        document.getElementById(
            "admin-sidebar-overlay"
        );


    const openButton =
        document.getElementById(
            "admin-menu-button"
        );


    const closeButton =
        document.getElementById(
            "admin-sidebar-close"
        );


    if (
        !sidebar ||
        !overlay ||
        !openButton
    ) {
        return;
    }


    openButton.addEventListener(
        "click",
        () => {

            sidebar.classList.add(
                "is-open"
            );

            overlay.hidden =
                false;

            document.body.classList.add(
                "admin-menu-open"
            );

        }
    );


    closeButton?.addEventListener(
        "click",
        closeSidebar
    );


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    document
        .querySelectorAll(
            ".admin-nav__item"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeSidebar
                );

            }
        );


    function closeSidebar() {

        sidebar.classList.remove(
            "is-open"
        );

        overlay.hidden =
            true;

        document.body.classList.remove(
            "admin-menu-open"
        );

    }

}


// =========================================================
// BACK BUTTON
// =========================================================

function initializeBackButton() {

    const button =
        document.getElementById(
            "admin-back-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
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
// PROFILE
// =========================================================

function initializeProfileButton() {

    const button =
        document.getElementById(
            "admin-profile-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                "/pages/restaurant-admin/account.html";

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

function initializeLogout() {

    const button =
        document.getElementById(
            "admin-logout"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            button.disabled =
                true;


            try {

                const module =
                    await import(
                        "../firebase/auth.js"
                    );


                if (
                    typeof module.logoutAdmin ===
                    "function"
                ) {

                    await module.logoutAdmin();

                }


                window.location.href =
                    "/pages/restaurant-admin/login.html";

            }

            catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );


                button.disabled =
                    false;


                showToast(
                    "[LOGOUT ERROR MESSAGE]",
                    "error"
                );

            }

        }
    );

}


// =========================================================
// PUBLISH
// =========================================================

function initializePublish() {

    const button =
        document.getElementById(
            "dashboard-publish-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            button.disabled =
                true;


            const originalText =
                button.textContent;


            button.textContent =
                "[PUBLISHING TEXT]";


            try {

                const module =
                    await import(
                        "../firebase/database.js"
                    );


                if (
                    typeof module.publishRestaurantWebsite ===
                    "function"
                ) {

                    await module.publishRestaurantWebsite();

                }


                showToast(
                    "[PUBLISH SUCCESS MESSAGE]",
                    "success"
                );

            }

            catch (error) {

                console.error(
                    "Publish failed:",
                    error
                );


                showToast(
                    "[PUBLISH ERROR MESSAGE]",
                    "error"
                );

            }

            finally {

                button.disabled =
                    false;

                button.textContent =
                    originalText;

            }

        }
    );

}


// =========================================================
// STATUS HELPERS
// =========================================================

function getStatusLabel(
    status
) {

    const labels = {

        active:
            "[ACTIVE STATUS LABEL]",

        published:
            "[PUBLISHED STATUS LABEL]",

        draft:
            "[DRAFT STATUS LABEL]",

        pending:
            "[PENDING STATUS LABEL]",

        inactive:
            "[INACTIVE STATUS LABEL]",

        suspended:
            "[SUSPENDED STATUS LABEL]"

    };


    return (
        labels[status] ||
        "[UNKNOWN STATUS LABEL]"
    );

}


function getStatusDescription(
    status
) {

    const descriptions = {

        active:
            "[ACTIVE WEBSITE DESCRIPTION]",

        published:
            "[PUBLISHED WEBSITE DESCRIPTION]",

        draft:
            "[DRAFT WEBSITE DESCRIPTION]",

        pending:
            "[PENDING WEBSITE DESCRIPTION]",

        inactive:
            "[INACTIVE WEBSITE DESCRIPTION]",

        suspended:
            "[SUSPENDED WEBSITE DESCRIPTION]"

    };


    return (
        descriptions[status] ||
        "[DEFAULT WEBSITE STATUS DESCRIPTION]"
    );

}


// =========================================================
// UI HELPERS
// =========================================================

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
            value;

    }

}


function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "admin-dashboard-toast"
        );


    if (!toast) {
        return;
    }


    toast.hidden =
        false;


    toast.textContent =
        message;


    toast.dataset.type =
        type;


    clearTimeout(
        window.CZDashboardToastTimer
    );


    window.CZDashboardToastTimer =
        setTimeout(
            () => {

                toast.hidden =
                    true;

            },
            3500
        );

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}
