export function initializeBackButtons() {
    const buttons =
        document.querySelectorAll(
            "[data-back-button]"
        );

    buttons.forEach(button => {
        if (
            button.dataset.initialized ===
            "true"
        ) {
            return;
        }

        button.dataset.initialized =
            "true";

        button.addEventListener(
            "click",
            () => {
                const fallback =
                    button.dataset.backFallback ||
                    "/index.html";

                if (
                    window.history.length > 1 &&
                    document.referrer
                ) {
                    window.history.back();
                } else {
                    window.location.href =
                        fallback;
                }
            }
        );
    });
}
