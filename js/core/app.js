import {
    renderHeader,
    renderFooter
} from "./components.js";

import {
    initializeNavigation,
    initializeActiveNavigation
} from "./navigation.js";

import {
    initializeBackButtons
} from "./back-button.js";

import {
    initializeModals
} from "./modal.js";

export async function initializeApp(
    options = {}
) {
    const {
        header = true,
        footer = true,
        activePage = "",
        showRestaurantLogin = true
    } = options;

    if (header) {
        renderHeader({
            activePage,
            showRestaurantLogin
        });
    }

    if (footer) {
        renderFooter();
    }

    initializeNavigation();

    initializeActiveNavigation();

    initializeBackButtons();

    initializeModals();

    initializeScrollReveal();

    initializeStickyHeader();

    document.body.classList.add(
        "app-ready"
    );
}

function initializeScrollReveal() {
    const elements =
        document.querySelectorAll(
            ".reveal"
        );

    if (!elements.length) {
        return;
    }

    if (
        !("IntersectionObserver" in window)
    ) {
        elements.forEach(element => {
            element.classList.add(
                "is-visible"
            );
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(element => {
        observer.observe(element);
    });
}

function initializeStickyHeader() {
    const header =
        document.querySelector(
            ".site-header"
        );

    if (!header) return;

    const updateHeader =
        () => {
            if (
                window.scrollY > 20
            ) {
                header.classList.add(
                    "is-scrolled"
                );
            } else {
                header.classList.remove(
                    "is-scrolled"
                );
            }
        };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );
}
