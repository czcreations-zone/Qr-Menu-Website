const ROUTES = {
    home: "/index.html",

    about: "/pages/about.html",
    services: "/pages/services.html",
    plans: "/pages/plans.html",
    contact: "/pages/contact.html",

    restaurantLogin:
        "/pages/restaurant-login.html",

    restaurantAdminLogin:
        "/pages/restaurant-admin/login.html",

    superAdminLogin:
        "/pages/super-admin/login.html"
};

export function getRoute(
    name
) {
    return ROUTES[name] || null;
}

export function goToRoute(
    name
) {
    const route =
        getRoute(name);

    if (!route) {
        console.error(
            `Unknown route: ${name}`
        );

        return;
    }

    window.location.href =
        route;
}

export function getCurrentRoute() {
    const path =
        window.location.pathname;

    const route =
        Object.entries(ROUTES)
            .find(
                ([, value]) =>
                    value === path
            );

    return route
        ? route[0]
        : null;
}

export function isRoute(
    name
) {
    return (
        getCurrentRoute() === name
    );
}
