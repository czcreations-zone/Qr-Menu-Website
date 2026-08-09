/*
CZ MENU PLATFORM
Restaurant Menu
File:
js/restaurant/menu.js

Features:
- Category rendering
- Menu item rendering
- Veg / Non-Veg
- Availability
- Multiple prices
- Optional description
- Search
=========================================================
*/

import {
    initializeRestaurant,
    renderRestaurantHeader,
    renderRestaurantFooter
} from "./restaurant.js";


import {
    initializeFilters
} from "./filters.js";


import {
    initializeSearch
} from "./search.js";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const restaurant =
            await initializeRestaurant();


        if (!restaurant) {
            return;
        }


        renderRestaurantHeader(
            restaurant
        );


        renderRestaurantFooter(
            restaurant
        );


        renderMenu(
            restaurant
        );


        initializeFilters();


        initializeSearch(
            restaurant
        );

    }
);


// ---------------------------------------------------------
// RENDER COMPLETE MENU
// ---------------------------------------------------------

export function renderMenu(
    restaurant
) {

    const container =
        document.getElementById(
            "restaurant-menu"
        );


    const empty =
        document.getElementById(
            "menu-empty"
        );


    if (!container) {
        return;
    }


    const categories =
        restaurant.categories || [];


    const items =
        restaurant.menuItems || [];


    if (!items.length) {

        container.innerHTML = "";

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    container.innerHTML =
        categories
            .map(
                category =>
                    renderCategory(
                        category,
                        items
                    )
            )
            .filter(Boolean)
            .join("");


    initializeImageFallbacks();

}


// ---------------------------------------------------------
// CATEGORY
// ---------------------------------------------------------

function renderCategory(
    category,
    allItems
) {

    const items =
        allItems.filter(
            item =>
                item.categoryId ===
                category.id
        );


    if (!items.length) {
        return "";
    }


    return `

        <section
            class="
                restaurant-menu-category
                reveal
            "
            data-category-id="${
                escapeHTML(
                    category.id
                )
            }"
        >

            <div
                class="
                    restaurant-menu-category__heading
                "
            >

                <h3>
                    ${
                        escapeHTML(
                            category.name
                        )
                    }
                </h3>

                <span>
                    ${
                        items.length
                    }
                    items
                </span>

            </div>


            <div
                class="
                    restaurant-menu-items
                "
            >

                ${
                    items
                        .map(
                            renderMenuItem
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


// ---------------------------------------------------------
// MENU ITEM
// ---------------------------------------------------------

export function renderMenuItem(
    item
) {

    const prices =
        Array.isArray(
            item.prices
        )
            ? item.prices
            : [];


    const primaryPrice =
        prices[0];


    const primaryPriceHTML =
        primaryPrice
            ? `

                <span
                    class="
                        menu-item__price
                    "
                >
                    ₹${Number(
                        primaryPrice.value
                    ).toLocaleString(
                        "en-IN"
                    )}
                </span>

            `
            : "";


    const descriptionHTML =
        item.description
            ? `

                <p
                    class="
                        menu-item__description
                    "
                >
                    ${
                        escapeHTML(
                            item.description
                        )
                    }
                </p>

            `
            : "";


    const variantHTML =
        prices.length > 1
            ? `

                <div
                    class="
                        menu-item__variants
                    "
                >

                    ${
                        prices
                            .map(
                                price =>
                                    `

                                        <span
                                            class="
                                                menu-item__variant
                                            "
                                        >

                                            ${
                                                escapeHTML(
                                                    price.label
                                                )
                                            }

                                            :

                                            ₹${
                                                Number(
                                                    price.value
                                                ).toLocaleString(
                                                    "en-IN"
                                                )
                                            }

                                        </span>

                                    `
                            )
                            .join("")
                    }

                </div>

            `
            : "";


    const unavailableHTML =
        item.available === false
            ? `

                <span
                    class="
                        menu-item__unavailable
                    "
                >
                    Unavailable
                </span>

            `
            : "";


    const image =
        item.image ||
        "/assets/images/placeholders/menu-item.svg";


    const type =
        item.type ===
        "non-veg"
            ? "non-veg"
            : "veg";


    return `

        <article
            class="
                menu-item
                ${
                    item.available === false
                        ? "is-unavailable"
                        : ""
                }
            "
            data-menu-item
            data-item-id="${
                escapeHTML(
                    item.id
                )
            }"
            data-menu-name="${
                escapeHTML(
                    item.name
                )
            }"
            data-menu-type="${
                type
            }"
        >

            <span
                class="
                    menu-item__type
                    menu-item__type--${type}
                "
                aria-label="${
                    type === "veg"
                        ? "Vegetarian"
                        : "Non-Vegetarian"
                }"
            ></span>


            <div
                class="
                    menu-item__image
                "
            >

                <img
                    src="${
                        escapeHTML(
                            image
                        )
                    }"
                    alt="${
                        escapeHTML(
                            item.name
                        )
                    }"
                    loading="lazy"
                >

            </div>


            <div
                class="
                    menu-item__content
                "
            >

                <div
                    class="
                        menu-item__title-row
                    "
                >

                    <h4
                        class="
                            menu-item__name
                        "
                    >
                        ${
                            escapeHTML(
                                item.name
                            )
                        }
                    </h4>

                    ${
                        primaryPriceHTML
                    }

                </div>


                ${
                    descriptionHTML
                }


                ${
                    variantHTML
                }

            </div>


            ${
                unavailableHTML
            }

        </article>

    `;

}


// ---------------------------------------------------------
// IMAGE FALLBACK
// ---------------------------------------------------------

function initializeImageFallbacks() {

    document
        .querySelectorAll(
            ".menu-item__image img"
        )
        .forEach(
            image => {

                image.addEventListener(
                    "error",
                    () => {

                        image.src =
                            "/assets/images/placeholders/menu-item.svg";

                    },
                    {
                        once: true
                    }
                );

            }
        );

}


// ---------------------------------------------------------
// HTML ESCAPE
// ---------------------------------------------------------

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
