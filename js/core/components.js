import COMPANY from "../config/company.js";
import NAVIGATION from "../config/navigation.js";

export function renderHeader(options = {}) {
    const {
        containerId = "site-header",
        activePage = "",
        showRestaurantLogin = true
    } = options;

    const container =
        document.getElementById(containerId);

    if (!container) return;

    const navigationHTML =
        NAVIGATION.main
            .map(item => `
                <a
                    href="${item.url}"
                    class="site-nav__link ${
                        activePage === item.id
                            ? "is-active"
                            : ""
                    }"
                >
                    ${item.label}
                </a>
            `)
            .join("");

    const loginHTML = showRestaurantLogin
        ? `
            <a
                href="${NAVIGATION.restaurantLogin.url}"
                class="btn btn-primary site-header__login"
            >
                ${NAVIGATION.restaurantLogin.label}
            </a>
        `
        : "";

    container.innerHTML = `
        <header class="site-header">
            <div class="container site-header__inner">

                <a
                    href="/index.html"
                    class="site-header__brand"
                    aria-label="${COMPANY.name} Home"
                >
                    <img
                        src="${COMPANY.logoMark}"
                        alt="${COMPANY.name}"
                        class="site-header__logo"
                    >

                    <span>
                        ${COMPANY.name}
                    </span>
                </a>

                <nav
                    class="site-nav"
                    aria-label="Main navigation"
                >
                    ${navigationHTML}
                </nav>

                <div class="site-header__actions">
                    ${loginHTML}

                    <button
                        type="button"
                        class="site-header__menu-button"
                        data-mobile-menu-toggle
                        aria-label="Open navigation"
                        aria-expanded="false"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

            </div>

            <div
                class="mobile-navigation"
                data-mobile-navigation
                aria-hidden="true"
            >
                <div class="mobile-navigation__inner">

                    ${navigationHTML}

                    ${loginHTML}

                </div>
            </div>
        </header>
    `;

    initializeMobileNavigation();
}

export function renderFooter(
    containerId = "site-footer"
) {
    const container =
        document.getElementById(containerId);

    if (!container) return;

    const serviceLinks =
        NAVIGATION.main
            .slice(1)
            .map(item => `
                <li>
                    <a href="${item.url}">
                        ${item.label}
                    </a>
                </li>
            `)
            .join("");

    container.innerHTML = `
        <footer class="site-footer">

            <div class="container">

                <div class="site-footer__grid">

                    <div class="site-footer__brand">

                        <a
                            href="/index.html"
                            class="site-footer__logo"
                        >
                            <img
                                src="${COMPANY.logoMark}"
                                alt="${COMPANY.name}"
                            >

                            <span>
                                ${COMPANY.name}
                            </span>
                        </a>

                        <p>
                            ${COMPANY.shortDescription}
                        </p>

                    </div>

                    <div>
                        <h3>Quick Links</h3>

                        <ul>
                            ${serviceLinks}
                        </ul>
                    </div>

                    <div>
                        <h3>Contact</h3>

                        <ul>
                            <li>
                                ${COMPANY.email}
                            </li>

                            <li>
                                ${COMPANY.phone}
                            </li>

                            <li>
                                ${COMPANY.address}
                            </li>
                        </ul>
                    </div>

                </div>

                <div class="site-footer__bottom">

                    <span>
                        © ${COMPANY.copyrightYear}
                        ${COMPANY.fullName}
                    </span>

                    <span>
                        Powered by ${COMPANY.name}
                    </span>

                </div>

            </div>

        </footer>
    `;
}

function initializeMobileNavigation() {
    const toggle =
        document.querySelector(
            "[data-mobile-menu-toggle]"
        );

    const navigation =
        document.querySelector(
            "[data-mobile-navigation]"
        );

    if (!toggle || !navigation) return;

    toggle.addEventListener(
        "click",
        () => {
            const isOpen =
                toggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            toggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            navigation.setAttribute(
                "aria-hidden",
                String(isOpen)
            );

            navigation.classList.toggle(
                "is-open",
                !isOpen
            );

            document.body.classList.toggle(
                "menu-open",
                !isOpen
            );
        }
    );

    navigation
        .querySelectorAll("a")
        .forEach(link => {
            link.addEventListener(
                "click",
                () => {
                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    navigation.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    navigation.classList.remove(
                        "is-open"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );
                }
            );
        });
}

export function renderBackButton(
    containerId,
    options = {}
) {
    const container =
        document.getElementById(containerId);

    if (!container) return;

    const {
        label = "Back",
        fallback = "/index.html"
    } = options;

    container.innerHTML = `
        <button
            type="button"
            class="back-button"
            data-back-button
        >
            <span aria-hidden="true">←</span>
            <span>${label}</span>
        </button>
    `;

    const button =
        container.querySelector(
            "[data-back-button]"
        );

    button.addEventListener(
        "click",
        () => {
            if (
                document.referrer &&
                window.history.length > 1
            ) {
                window.history.back();
            } else {
                window.location.href =
                    fallback;
            }
        }
    );
}
