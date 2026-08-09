let activeModal = null;

export function openModal(
    modal,
    options = {}
) {
    const element =
        typeof modal === "string"
            ? document.querySelector(modal)
            : modal;

    if (!element) return;

    activeModal = element;

    element.classList.add(
        "is-open"
    );

    element.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    if (
        options.onOpen &&
        typeof options.onOpen === "function"
    ) {
        options.onOpen(element);
    }
}

export function closeModal(
    modal = activeModal
) {
    const element =
        typeof modal === "string"
            ? document.querySelector(modal)
            : modal;

    if (!element) return;

    element.classList.remove(
        "is-open"
    );

    element.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    if (activeModal === element) {
        activeModal = null;
    }
}

export function initializeModals() {
    document.addEventListener(
        "click",
        event => {
            const openButton =
                event.target.closest(
                    "[data-modal-open]"
                );

            if (openButton) {
                const target =
                    openButton.getAttribute(
                        "data-modal-open"
                    );

                openModal(target);
                return;
            }

            const closeButton =
                event.target.closest(
                    "[data-modal-close]"
                );

            if (closeButton) {
                const modal =
                    closeButton.closest(
                        ".modal"
                    );

                closeModal(modal);
                return;
            }

            if (
                event.target.classList.contains(
                    "modal"
                )
            ) {
                closeModal(
                    event.target
                );
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape" &&
                activeModal
            ) {
                closeModal();
            }
        }
    );
}
