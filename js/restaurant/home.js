
import { initializeApp } from "../core/app.js";
import WEBSITE from "../config/website.js";
import SERVICES from "../config/services.js";
import FEATURES from "../config/features.js";
import FAQ from "../config/faq.js";
import TESTIMONIALS from "../config/testimonials.js";
import ANIMATIONS from "../config/animations.js";

document.addEventListener("DOMContentLoaded", async () => {

    await initializeApp({
        activePage: "home"
    });

    loadWebsiteContent();
    renderFeatures();
    renderServices();
    renderProcess();
    renderTestimonials();
    renderFAQ();
    initializeThemeSwitcher();

    if (!ANIMATIONS.enabled) {
        document.documentElement.classList.add(
            "animations-disabled"
        );
    }
});


function loadWebsiteContent() {

    const heroTitle =
        document.getElementById("hero-title");

    const heroDescription =
        document.getElementById("hero-description");

    const heroPrimary =
        document.getElementById("hero-primary-button");

    const heroSecondary =
        document.getElementById("hero-secondary-button");

    if (heroTitle) {
        heroTitle.textContent =
            WEBSITE.hero.title;
    }

    if (heroDescription) {
        heroDescription.textContent =
            WEBSITE.hero.subtitle;
    }

    if (heroPrimary) {
        heroPrimary.textContent =
            WEBSITE.hero.primaryButton;

        heroPrimary.href =
            WEBSITE.hero.primaryLink ||
            "/pages/restaurant-login.html";
    }

    if (heroSecondary) {
        heroSecondary.textContent =
            WEBSITE.hero.secondaryButton;

        heroSecondary.href =
            WEBSITE.hero.secondaryLink ||
            "/pages/services.html";
    }


    const aboutTitle =
        document.getElementById("about-title");

    const aboutDescription =
        document.getElementById(
            "about-description"
        );

    if (aboutTitle) {
        aboutTitle.textContent =
            WEBSITE.about.title;
    }

    if (aboutDescription) {
        aboutDescription.textContent =
            WEBSITE.about.description;
    }


    const visionTitle =
        document.getElementById("vision-title");

    const visionDescription =
        document.getElementById(
            "vision-description"
        );

    if (visionTitle) {
        visionTitle.textContent =
            WEBSITE.vision.title;
    }

    if (visionDescription) {
        visionDescription.textContent =
            WEBSITE.vision.description;
    }


    const testimonialTitle =
        document.getElementById(
            "testimonial-title"
        );

    const testimonialSubtitle =
        document.getElementById(
            "testimonial-subtitle"
        );

    if (testimonialTitle) {
        testimonialTitle.textContent =
            WEBSITE.testimonials.title;
    }

    if (testimonialSubtitle) {
        testimonialSubtitle.textContent =
            WEBSITE.testimonials.subtitle;
    }


    const faqTitle =
        document.getElementById("faq-title");

    const faqSubtitle =
        document.getElementById(
            "faq-subtitle"
        );

    if (faqTitle) {
        faqTitle.textContent =
            WEBSITE.faq.title;
    }

    if (faqSubtitle) {
        faqSubtitle.textContent =
            WEBSITE.faq.subtitle;
    }


    const finalTitle =
        document.getElementById(
            "final-cta-title"
        );

    const finalDescription =
        document.getElementById(
            "final-cta-description"
        );

    const finalButton =
        document.getElementById(
            "final-cta-button"
        );

    if (finalTitle) {
        finalTitle.textContent =
            WEBSITE.finalCTA.title;
    }

    if (finalDescription) {
        finalDescription.textContent =
            WEBSITE.finalCTA.description;
    }

    if (finalButton) {
        finalButton.textContent =
            WEBSITE.finalCTA.buttonText;

        finalButton.href =
            WEBSITE.finalCTA.buttonLink ||
            "/pages/contact.html";
    }
}


function renderFeatures() {

    const container =
        document.getElementById(
            "feature-grid"
        );

    if (!container) return;

    container.innerHTML =
        FEATURES
            .map(feature => `
                <article
                    class="card card-glass feature-card"
                >

                    <div class="icon-box feature-card__icon">
                        <span aria-hidden="true">
                            ${getIcon(feature.icon)}
                        </span>
                    </div>

                    <h3>
                        ${feature.title}
                    </h3>

                    <p>
                        ${feature.description}
                    </p>

                </article>
            `)
            .join("");
}


function renderServices() {

    const container =
        document.getElementById(
            "service-preview-grid"
        );

    if (!container) return;

    container.innerHTML =
        SERVICES
            .filter(service => service.active)
            .slice(0, 6)
            .map(service => `
                <article
                    class="card card-glass service-card"
                >

                    <div class="icon-box service-card__icon">
                        <span aria-hidden="true">
                            ${getIcon(service.icon)}
                        </span>
                    </div>

                    <h3>
                        ${service.title}
                    </h3>

                    <p>
                        ${service.description}
                    </p>

                    <a
                        href="/pages/services.html"
                        class="service-card__link"
                    >
                        Learn more →
                    </a>

                </article>
            `)
            .join("");
}


function renderProcess() {

    const container =
        document.getElementById(
            "process-grid"
        );

    if (!container) return;

    const steps = [
        {
            number: "01",
            title: "[ADD PROCESS STEP 1 TITLE]",
            description:
                "[ADD PROCESS STEP 1 DESCRIPTION]"
        },
        {
            number: "02",
            title: "[ADD PROCESS STEP 2 TITLE]",
            description:
                "[ADD PROCESS STEP 2 DESCRIPTION]"
        },
        {
            number: "03",
            title: "[ADD PROCESS STEP 3 TITLE]",
            description:
                "[ADD PROCESS STEP 3 DESCRIPTION]"
        },
        {
            number: "04",
            title: "[ADD PROCESS STEP 4 TITLE]",
            description:
                "[ADD PROCESS STEP 4 DESCRIPTION]"
        }
    ];

    container.innerHTML =
        steps
            .map(step => `
                <article
                    class="card process-card"
                >

                    <div class="process-card__number">
                        ${step.number}
                    </div>

                    <h3>
                        ${step.title}
                    </h3>

                    <p>
                        ${step.description}
                    </p>

                </article>
            `)
            .join("");
}


function renderTestimonials() {

    const container =
        document.getElementById(
            "testimonial-grid"
        );

    if (!container) return;

    container.innerHTML =
        TESTIMONIALS
            .map(testimonial => `
                <article
                    class="card card-glass testimonial-card"
                >

                    <div class="testimonial-card__top">

                        <img
                            src="${testimonial.image}"
                            alt="${testimonial.name}"
                            class="testimonial-card__avatar"
                            loading="lazy"
                        >

                        <div>

                            <span class="testimonial-card__name">
                                ${testimonial.name}
                            </span>

                            <span class="testimonial-card__business">
                                ${testimonial.business}
                            </span>

                        </div>

                    </div>

                    <p class="testimonial-card__quote">
                        “${testimonial.quote}”
                    </p>

                </article>
            `)
            .join("");
}


function renderFAQ() {

    const container =
        document.getElementById(
            "faq-list"
        );

    if (!container) return;

    container.innerHTML =
        FAQ
            .map(item => `
                <article
                    class="faq-item"
                >

                    <button
                        type="button"
                        class="faq-question"
                        aria-expanded="false"
                    >

                        <span>
                            ${item.question}
                        </span>

                        <span>
                            +
                        </span>

                    </button>

                    <div class="faq-answer">
                        <div>
                            <p>
                                ${item.answer}
                            </p>
                        </div>
                    </div>

                </article>
            `)
            .join("");

    container
        .querySelectorAll(
            ".faq-question"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".faq-item"
                        );

                    const currentlyOpen =
                        item.classList.contains(
                            "is-open"
                        );

                    container
                        .querySelectorAll(
                            ".faq-item"
                        )
                        .forEach(
                            otherItem => {
                                otherItem.classList.remove(
                                    "is-open"
                                );

                                const otherButton =
                                    otherItem.querySelector(
                                        ".faq-question"
                                    );

                                if (otherButton) {
                                    otherButton.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );
                                }
                            }
                        );

                    if (!currentlyOpen) {

                        item.classList.add(
                            "is-open"
                        );

                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );
                    }
                }
            );
        });
}


function initializeThemeSwitcher() {

    const switcher =
        document.createElement("div");

    switcher.className =
        "theme-switcher";

    switcher.setAttribute(
        "aria-label",
        "Website theme"
    );

    switcher.innerHTML = `
        <button
            type="button"
            data-theme="theme-1"
            aria-label="Theme 1"
        >
            1
        </button>

        <button
            type="button"
            data-theme="theme-2"
            aria-label="Theme 2"
        >
            2
        </button>

        <button
            type="button"
            data-theme="theme-3"
            aria-label="Theme 3"
        >
            3
        </button>
    `;

    document.body.appendChild(
        switcher
    );

    const savedTheme =
        localStorage.getItem(
            "cz-theme"
        ) || "theme-1";

    applyTheme(savedTheme);

    switcher
        .querySelectorAll(
            "[data-theme]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const theme =
                        button.dataset.theme;

                    applyTheme(theme);

                    localStorage.setItem(
                        "cz-theme",
                        theme
                    );
                }
            );
        });

    function applyTheme(theme) {

        document.documentElement
            .setAttribute(
                "data-theme",
                theme
            );

        switcher
            .querySelectorAll(
                "[data-theme]"
            )
            .forEach(button => {

                button.classList.toggle(
                    "is-active",
                    button.dataset.theme ===
                    theme
                );
            });
    }
}


function getIcon(icon) {

    const icons = {
        "sparkles": "✦",
        "smartphone": "⌕",
        "settings": "⚙",
        "zap": "ϟ",
        "shield": "◇",
        "layers": "▱",
        "qr-code": "▦",
        "globe": "◎",
        "image": "▧",
        "palette": "◈",
        "video": "▶"
    };

    return icons[icon] || "✦";
                      }
