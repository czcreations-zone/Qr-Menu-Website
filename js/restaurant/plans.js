import { initializeApp } from "../core/app.js";
import { renderBackButton } from "../core/components.js";
import PLANS from "../config/plans.js";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeApp({
            activePage: "plans"
        });

        renderBackButton(
            "plans-back",
            {
                label: "Back",
                fallback: "/index.html"
            }
        );

        renderPlans();
    }
);


function renderPlans() {

    const container =
        document.getElementById(
            "plans-grid"
        );

    if (!container) return;

    container.innerHTML =
        PLANS
            .filter(plan => plan.active)
            .map(plan => `
                <article
                    class="
                        plan-card
                        card
                        card-glass
                        ${
                            plan.highlighted
                                ? "plan-card--featured"
                                : ""
                        }
                    "
                >

                    ${
                        plan.highlighted
                            ? `
                                <span class="badge badge-primary">
                                    [ADD FEATURED LABEL]
                                </span>
                            `
                            : ""
                    }

                    <h2>
                        ${plan.name}
                    </h2>

                    <p>
                        ${plan.description}
                    </p>

                    <div class="plan-card__price">

                        <strong>
                            ${plan.price}
                        </strong>

                        <span>
                            ${plan.currency}
                            ${plan.billingText}
                        </span>

                    </div>

                    <ul class="plan-card__features">

                        ${plan.features
                            .map(feature => `
                                <li>
                                    <span>✓</span>
                                    ${feature}
                                </li>
                            `)
                            .join("")}

                    </ul>

                    <a
                        href="${
                            plan.buttonLink ||
                            "/pages/contact.html"
                        }"
                        class="btn ${
                            plan.highlighted
                                ? "btn-primary"
                                : "btn-secondary"
                        }"
                    >
                        ${plan.buttonText}
                    </a>

                </article>
            `)
            .join("");
}
