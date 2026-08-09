import { initializeApp } from "../core/app.js";
import { renderBackButton } from "../core/components.js";
import CONTACT from "../config/contact.js";
import {
    validateForm,
    validateEmail,
    validateRequired,
    displayFormErrors
} from "../core/validation.js";
import {
    showSuccess,
    showError
} from "../core/toast.js";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initializeApp({
            activePage: "contact"
        });

        renderBackButton(
            "contact-back",
            {
                label: "Back",
                fallback: "/index.html"
            }
        );

        renderContactInformation();
        initializeContactForm();
    }
);


function renderContactInformation() {

    const container =
        document.getElementById(
            "contact-information"
        );

    if (!container) return;

    container.innerHTML = `

        <span class="section-label">
            [ADD CONTACT INFORMATION LABEL]
        </span>

        <h2>
            [ADD CONTACT INFORMATION TITLE]
        </h2>

        <p>
            [ADD CONTACT INFORMATION DESCRIPTION]
        </p>


        <div class="contact-info-list">

            <a
                href="mailto:${CONTACT.email}"
                class="contact-info-card glass"
            >
                <span class="icon-box">
                    @
                </span>

                <div>
                    <small>Email</small>
                    <strong>
                        ${CONTACT.email}
                    </strong>
                </div>
            </a>


            <a
                href="tel:${CONTACT.phone}"
                class="contact-info-card glass"
            >
                <span class="icon-box">
                    ☎
                </span>

                <div>
                    <small>Phone</small>
                    <strong>
                        ${CONTACT.phone}
                    </strong>
                </div>
            </a>


            <a
                href="https://wa.me/${CONTACT.whatsapp}"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-info-card glass"
            >
                <span class="icon-box">
                    ◇
                </span>

                <div>
                    <small>WhatsApp</small>
                    <strong>
                        ${CONTACT.whatsapp}
                    </strong>
                </div>
            </a>


            <div class="contact-info-card glass">

                <span class="icon-box">
                    ◎
                </span>

                <div>
                    <small>Address</small>

                    <strong>
                        ${CONTACT.address}
                    </strong>
                </div>

            </div>

        </div>
    `;
}


function initializeContactForm() {

    const form =
        document.getElementById(
            "contact-form"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const result =
                validateForm(
                    form,
                    {
                        name: [
                            value =>
                                validateRequired(
                                    value,
                                    "Name"
                                )
                        ],

                        email: [
                            validateEmail
                        ],

                        message: [
                            value =>
                                validateRequired(
                                    value,
                                    "Message"
                                )
                        ]
                    }
                );

            displayFormErrors(
                form,
                result.errors
            );

            if (!result.valid) {
                showError(
                    "Please check the highlighted fields."
                );

                return;
            }

            /*
             * The public contact form does not
             * send anything yet.
             *
             * Later, if you want actual form
             * submissions, we'll connect this
             * specifically to the chosen backend.
             */

            showSuccess(
                "[ADD SUCCESS MESSAGE]"
            );

            form.reset();
        }
    );
}
