/*
=========================================================
CZ MENU PLATFORM
Restaurant Menu Search
File:
js/restaurant/search.js
=========================================================
*/


let searchQuery = "";


// ---------------------------------------------------------
// INITIALIZE SEARCH
// ---------------------------------------------------------

export function initializeSearch(
    restaurant
) {

    const input =
        document.getElementById(
            "menu-search"
        );


    const clearButton =
        document.getElementById(
            "clear-menu-search"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            searchQuery =
                normalizeQuery(
                    input.value
                );


            applySearch(
                searchQuery
            );

        }
    );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                input.value = "";

                searchQuery = "";

                applySearch("");

                input.focus();

            }
        );

    }


    initializeSearchToggle();

}


// ---------------------------------------------------------
// SEARCH
// ---------------------------------------------------------

export function applySearch(
    query
) {

    const normalized =
        normalizeQuery(
            query
        );


    const items =
        document.querySelectorAll(
            "[data-menu-item]"
        );


    let visibleCount = 0;


    items.forEach(
        item => {

            const name =
                item.dataset.menuName ||
                "";


            const description =
                item.querySelector(
                    ".menu-item__description"
                )?.textContent ||
                "";


            const searchable =
                `${name} ${description}`
                    .toLowerCase();


            const matches =
                !normalized ||
                searchable.includes(
                    normalized
                );


            item.hidden =
                !matches;


            if (matches) {
                visibleCount++;
            }

        }
    );


    updateCategories();


    updateEmptyState(
        visibleCount
    );

}


// ---------------------------------------------------------
// CATEGORY VISIBILITY
// ---------------------------------------------------------

function updateCategories() {

    document
        .querySelectorAll(
            ".restaurant-menu-category"
        )
        .forEach(
            category => {

                const visible =
                    category.querySelectorAll(
                        "[data-menu-item]:not([hidden])"
                    );


                category.hidden =
                    visible.length === 0;

            }
        );

}


// ---------------------------------------------------------
// EMPTY STATE
// ---------------------------------------------------------

function updateEmptyState(
    count
) {

    const empty =
        document.getElementById(
            "menu-empty"
        );


    if (!empty) {
        return;
    }


    empty.hidden =
        count !== 0;


    if (count === 0) {

        const title =
            empty.querySelector(
                "h3"
            );


        const description =
            empty.querySelector(
                "p"
            );


        if (title) {

            title.textContent =
                searchQuery
                    ? "No matching items"
                    : "[NO ITEMS TITLE]";

        }


        if (description) {

            description.textContent =
                searchQuery
                    ? "Try a different search."
                    : "[NO ITEMS DESCRIPTION]";

        }

    }

}


// ---------------------------------------------------------
// SEARCH TOGGLE
// ---------------------------------------------------------

function initializeSearchToggle() {

    const button =
        document.getElementById(
            "restaurant-search-toggle"
        );


    const search =
        document.getElementById(
            "restaurant-search"
        );


    if (!button || !search) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            search.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            const input =
                document.getElementById(
                    "menu-search"
                );


            if (input) {

                setTimeout(
                    () => {

                        input.focus();

                    },
                    350
                );

            }

        }
    );

}


// ---------------------------------------------------------
// NORMALIZE
// ---------------------------------------------------------

export function normalizeQuery(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


// ---------------------------------------------------------
// GET CURRENT QUERY
// ---------------------------------------------------------

export function getSearchQuery() {

    return searchQuery;

}
