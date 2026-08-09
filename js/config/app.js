const APP_CONFIG = {
    appName: "CZ Menu Platform",

    brandName: "CZ",
    brandFullName: "CZ Creations",

    language: "en",

    currency: {
        code: "INR",
        symbol: "₹",
        locale: "en-IN"
    },

    environment: "production",

    restaurant: {
        defaultTemplate: "template-1",
        defaultTheme: "theme-1",

        menuDefaultPage: true,

        enableSearch: true,
        enableVegFilter: true,
        enableNonVegFilter: true,
        enableAvailability: true
    },

    features: {
        restaurantApproval: true,
        multipleSuperAdmins: true,
        activityLogs: true,
        publishing: true,
        qrSystem: true
    }
};

export default APP_CONFIG;
