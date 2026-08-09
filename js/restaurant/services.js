import { initializeApp } from "../core/app.js";
import { renderBackButton } from "../core/components.js";
import SERVICES from "../config/services.js";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeApp({
            activePage: "services"
        });

        renderBackButton(
            "services-back",
            {
                label: "Back",
                fallback: "/index.html"
            }
        );

        renderServices();
    }
);


function renderServices() {

    const container =
        document.getElementById(
            "services-grid"
        );

    if (!container) return;

    container.innerHTML =
        SERVICES
            .filter(service => service.active)
            .map(service => `
                <article
                    class="card card-glass service-card"
                >

                    <div class="icon-box service-card__icon">
                        ${getIcon(service.icon)}
                    </div>

                    <h3>
                        ${service.title}
                    </h3>

                    <p>
                        ${service.description}
                    </p>

                    <a
                        href="/pages/contact.html"
                        class="service-card__link"
                    >
                        [ADD SERVICE CTA TEXT] →
                    </a>

                </article>
            `)
            .join("");
}


function getIcon(icon) {

    const icons = {
        "qr-code": "▦",
        "globe": "◎",
        "image": "▧",
        "palette": "◈",
        "video": "▶"
    };

    return icons[icon] || "✦";
}
