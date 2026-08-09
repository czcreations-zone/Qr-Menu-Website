/*
=========================================================
CZ MENU PLATFORM
Restaurant Website Core
File:
js/restaurant/restaurant.js

Purpose:
- Load restaurant information
- Resolve restaurant ID / website ID
- Apply restaurant design
- Render common header/footer
- Initialize restaurant website
=========================================================
*/

import {
    getRestaurantId,
    getWebsiteId
} from "../core/utils.js";

import {
    applyRestaurantTheme
} from "./theme.js";

import {
    applyRestaurantTemplate
} from "./templates.js";

import {
    buildRestaurantUrl,
    initializeRestaurantNavigation
} from "../core/navigation.js";


// ---------------------------------------------------------
// DEVELOPMENT FALLBACK
// Firebase will provide real restaurant data later.
// Do not use this object for actual restaurant information.
// ---------------------------------------------------------

const FALLBACK_RESTAURANT = {

    id: "[RESTAURANT_ID]",

    websiteId: "[WEBSITE_ID]",

    name: "[RESTAURANT NAME]",

    slug: "[RESTAURANT SLUG]",

    status: "active",

    category: "[RESTAURANT CATEGORY]",

    tagline: "[RESTAURANT TAGLINE]",

    description: "[RESTAURANT DESCRIPTION]",

    logo:
        "/assets/images/placeholders/restaurant-logo.svg",

    coverImage:
        "/assets/images/placeholders/restaurant-cover.svg",

    homeImage:
        "/assets/images/placeholders/restaurant-home.svg",

    address: "[RESTAURANT ADDRESS]",

    phone: "[RESTAURANT PHONE]",

    whatsapp: "[RESTAURANT WHATSAPP]",

    email: "[RESTAURANT EMAIL]",

    openingHours: "[RESTAURANT OPENING HOURS]",

    template: "template-1",

    theme: "theme-1",

    settings: {

        showHome: true,

        showContact: true,

        showSearch: true,

        showVegFilter: true,

        showNonVegFilter: true,

        showPoweredByCZ: true

    },

    home: {

        title: "[RESTAURANT HOME TITLE]",

        description:
            "[RESTAURANT HOME DESCRIPTION]",

        aboutTitle:
            "[ABOUT RESTAURANT TITLE]",

        aboutDescription:
            "[ABOUT RESTAURANT DESCRIPTION]"

    },

    highlights: [

        {
            title: "[HIGHLIGHT 1 TITLE]",
            description:
                "[HIGHLIGHT 1 DESCRIPTION]",
            icon: "✦"
        },

        {
            title: "[HIGHLIGHT 2 TITLE]",
            description:
                "[HIGHLIGHT 2 DESCRIPTION]",
            icon: "◇"
        },

        {
            title: "[HIGHLIGHT 3 TITLE]",
            description:
                "[HIGHLIGHT 3 DESCRIPTION]",
            icon: "◎"
        }

    ],

    categories: [

        {
            id: "category-1",
            name: "[CATEGORY NAME]"
        }

    ],

    menuItems: [

        {
            id: "item-1",

            categoryId: "category-1",

            name: "[MENU ITEM NAME]",

            description:
                "[OPTIONAL ITEM DESCRIPTION]",

            type: "veg",

            available: true,

            image:
                "/assets/images/placeholders/menu-item.svg",

            prices: [

                {
                    label: "Plain",
                    value: 120
                }

            ]

        }

    ]

};


// ---------------------------------------------------------
// GET RESTAURANT
// ---------------------------------------------------------

export async function loadRestaurant() {

    const restaurantId =
        getRestaurantId();

    const websiteId =
        getWebsiteId();


    /*
    ---------------------------------------------------------
    Firebase connection will be added later.

    The public restaurant website will NOT need a separate
    HTML file for every restaurant.

    Firebase will eventually return:

    restaurantId
    websiteId
    restaurant information
    categories
    menu items
    template
    theme
    settings
    ---------------------------------------------------------
    */


    return {

        ...FALLBACK_RESTAURANT,

        id:
            restaurantId ||
            FALLBACK_RESTAURANT.id,

        websiteId:
            websiteId ||
            FALLBACK_RESTAURANT.websiteId

    };

}


// ---------------------------------------------------------
// INITIALIZE RESTAURANT WEBSITE
// ---------------------------------------------------------

export async function initializeRestaurant() {

    try {

        const restaurant =
            await loadRestaurant();


        window.CZRestaurant =
            restaurant;


        applyRestaurantTheme(
            restaurant.theme
        );


        applyRestaurantTemplate(
            restaurant.template
        );


        renderRestaurantHeader(
            restaurant
        );


        renderRestaurantFooter(
            restaurant
        );


        initializeRestaurantNavigation();


        return restaurant;

    }

    catch (error) {

        console.error(
            "CZ Restaurant initialization failed:",
            error
        );

        showRestaurantError();

        return null;

    }

}


// ---------------------------------------------------------
// COMMON HEADER
// ---------------------------------------------------------

export function renderRestaurantHeader(
    restaurant
) {

    const container =
        document.getElementById(
            "restaurant-header"
        );


    if (!container) {
        return;
    }


    const showHome =
        restaurant.settings?.showHome !==
        false;


    const showContact =
        restaurant.settings?.showContact !==
        false;


    container.innerHTML = `

        <header
            class="restaurant-header"
        >

            <div
                class="
                    container
                    restaurant-header__inner
                "
            >

                <a
                    href="${buildRestaurantUrl(
                        "menu"
                    )}"
                    class="
                        restaurant-header__brand
                    "
                    aria-label="Open menu"
                >

                    <img
                        src="${
                            restaurant.logo ||
                            "/assets/logo/cz-logo-mark.svg"
                        }"
                        alt="${escapeText(
                            restaurant.name
                        )}"
                    >

                    <span>
                        ${escapeText(
                            restaurant.name
                        )}
                    </span>

                </a>


                <nav
                    class="
                        restaurant-header__nav
                    "
                    aria-label="
                        Restaurant navigation
                    "
                >

                    <a
                        href="${buildRestaurantUrl(
                            "menu"
                        )}"
                        data-restaurant-page="menu"
                        class="is-active"
                    >
                        Menu
                    </a>


                    ${
                        showHome
                            ? `

                                <a
                                    href="${buildRestaurantUrl(
                                        "home"
                                    )}"
                                    data-restaurant-page="home"
                                >
                                    Home
                                </a>

                            `
                            : ""
                    }


                    ${
                        showContact
                            ? `

                                <a
                                    href="${buildRestaurantUrl(
                                        "contact"
                                    )}"
                                    data-restaurant-page="contact"
                                >
                                    Contact
                                </a>

                            `
                            : ""
                    }

                </nav>

            </div>

        </header>

    `;

}


// ---------------------------------------------------------
// COMMON FOOTER
// ---------------------------------------------------------

export function renderRestaurantFooter(
    restaurant
) {

    const container =
        document.getElementById(
            "restaurant-footer"
        );


    if (!container) {
        return;
    }


    if (
        restaurant.settings?.showPoweredByCZ ===
        false
    ) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML = `

        <footer
            class="restaurant-footer"
        >

            <div
                class="container"
            >

                <div
                    class="
                        restaurant-powered__inner
                    "
                >

                    <span>
                        Powered by
                    </span>

                    <img
                        src="/assets/logo/cz-logo-mark.svg"
                        alt="CZ"
                    >

                    <strong>
                        CZ
                    </strong>

                </div>

            </div>

        </footer>

    `;

}


// ---------------------------------------------------------
// RESTAURANT INFORMATION
// ---------------------------------------------------------

export function renderRestaurantInformation(
    restaurant
) {

    const name =
        document.getElementById(
            "restaurant-name"
        );


    const tagline =
        document.getElementById(
            "restaurant-tagline"
        );


    const category =
        document.getElementById(
            "restaurant-category"
        );


    const logo =
        document.getElementById(
            "restaurant-logo"
        );


    const cover =
        document.getElementById(
            "restaurant-cover-image"
        );


    const status =
        document.getElementById(
            "restaurant-status"
        );


    const meta =
        document.getElementById(
            "restaurant-meta"
        );


    if (name) {

        name.textContent =
            restaurant.name;

    }


    if (tagline) {

        tagline.textContent =
            restaurant.tagline;

    }


    if (category) {

        category.textContent =
            restaurant.category;

    }


    if (logo) {

        logo.src =
            restaurant.logo;

        logo.alt =
            restaurant.name;

    }


    if (cover) {

        cover.src =
            restaurant.coverImage;

        cover.alt =
            restaurant.name;

    }


    if (status) {

        const isActive =
            restaurant.status ===
            "active";


        status.classList.toggle(
            "is-closed",
            !isActive
        );


        status.innerHTML = `

            <span></span>

            ${
                isActive
                    ? "Open"
                    : "Closed"
            }

        `;

    }


    if (meta) {

        const values = [

            restaurant.address,

            restaurant.openingHours

        ];


        meta.innerHTML =
            values
                .filter(Boolean)
                .map(
                    value => `

                        <span
                            class="
                                restaurant-meta__item
                            "
                        >
                            ${escapeText(
                                value
                            )}
                        </span>

                    `
                )
                .join("");

    }

}


// ---------------------------------------------------------
// ERROR STATE
// ---------------------------------------------------------

function showRestaurantError() {

    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `

        <section
            class="
                section
                restaurant-error
            "
        >

            <div
                class="
                    container
                    text-center
                "
            >

                <span
                    class="section-label"
                >
                    MENU
                </span>

                <h1>
                    Unable to load menu
                </h1>

                <p>
                    [RESTAURANT ERROR MESSAGE]
                </p>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="window.location.reload()"
                >
                    Try Again
                </button>

            </div>

        </section>

    `;

}


// ---------------------------------------------------------
// BASIC HTML ESCAPING
// ---------------------------------------------------------

function escapeText(
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
