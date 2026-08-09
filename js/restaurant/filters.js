/*
=========================================================
CZ MENU PLATFORM
Restaurant Menu Filters
File:
js/restaurant/filters.js
=========================================================
*/

let activeFilter = "all";


export function initializeFilters() {

    const buttons =
        document.querySelectorAll(
            "[data-filter]"
        );


    if (!buttons.length) {
        return;
    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    activeFilter =
                        button.dataset.filter ||
                        "all";


                    buttons.forEach(
                        item => {

                            item.classList.toggle(
                                "is-active",
                                item === button
                            );

                        }
                    );


                    applyFilter(
                        activeFilter
                    );

                }
            );

        }
    );

}


export function applyFilter(
    filter = "all"
) {

    const items =
        document.querySelectorAll(
            "[data-menu-item]"
        );


    let visibleCount = 0;


    items.forEach(
        item => {

            const type =
                item.dataset.menuType ||
                "veg";


            const matches =
                filter === "all" ||
                type === filter;


            item.hidden =
                !matches;


            if (matches) {
                visibleCount++;
            }

        }
    );


    updateCategoryVisibility();

    updateEmptyState(
        visibleCount
    );

}


function updateCategoryVisibility() {

    document
        .querySelectorAll(
            ".restaurant-menu-category"
        )
        .forEach(
            category => {

                const visibleItems =
                    category.querySelectorAll(
                        "[data-menu-item]:not([hidden])"
                    );


                category.hidden =
                    visibleItems.length === 0;

            }
        );

}


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

}


export function getActiveFilter() {

    return activeFilter;

}
