export function initializeNavigation() {
    document.addEventListener(
        "click",
        event => {
            const link =
                event.target.closest(
                    "[data-scroll-link]"
                );

            if (!link) return;

            const targetId =
                link.getAttribute(
                    "data-scroll-link"
                );

            const target =
                document.getElementById(
                    targetId
                );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
}

export function initializeActiveNavigation() {
    const links =
        document.querySelectorAll(
            ".site-nav__link"
        );

    const currentPath =
        window.location.pathname;

    links.forEach(link => {
        const href =
            link.getAttribute("href");

        if (!href) return;

        const linkPath =
            new URL(
                href,
                window.location.origin
            ).pathname;

        if (
            linkPath === currentPath
        ) {
            link.classList.add(
                "is-active"
            );
        }
    });
}

export function navigateTo(url) {
    if (!url) return;

    window.location.href = url;
}
