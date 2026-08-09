const TEMPLATES = {
    "template-1": {
        id: "template-1",
        name: "[TEMPLATE 1 NAME]",
        description: "[TEMPLATE 1 DESCRIPTION]",

        layout: {
            overall: "modern-card",
            header: "floating-header",
            hero: "compact-banner",
            category: "image-banner",
            menu: "card-grid",
            menuItem: "elevated-card",
            contact: "floating-cards",
            footer: "minimal"
        },

        visual: {
            spacing: "comfortable",
            cardRadius: "large",
            cardShadow: "soft",
            borders: "subtle",
            glass: true,
            blur: "medium",
            floatingSections: true
        },

        typography: {
            heading: "modern-bold",
            body: "clean",
            price: "strong"
        },

        navigation: {
            style: "floating",
            mobileStyle: "bottom-aware-sidebar",
            sticky: true
        },

        menu: {
            layout: "grid",
            showCategoryImages: true,
            imagePosition: "category-banner",
            itemImage: false,
            showDescription: true,
            showPriceVariants: true
        },

        animations: {
            page: "fade",
            category: "slide-up",
            item: "fade-up",
            hover: "lift"
        }
    },

    "template-2": {
        id: "template-2",
        name: "[TEMPLATE 2 NAME]",
        description: "[TEMPLATE 2 DESCRIPTION]",

        layout: {
            overall: "editorial-list",
            header: "minimal-header",
            hero: "wide-banner",
            category: "wide-image",
            menu: "list",
            menuItem: "horizontal-card",
            contact: "split-layout",
            footer: "editorial"
        },

        visual: {
            spacing: "spacious",
            cardRadius: "medium",
            cardShadow: "subtle",
            borders: "minimal",
            glass: false,
            blur: "low",
            floatingSections: false
        },

        typography: {
            heading: "editorial",
            body: "clean",
            price: "bold"
        },

        navigation: {
            style: "classic",
            mobileStyle: "sidebar",
            sticky: true
        },

        menu: {
            layout: "list",
            showCategoryImages: true,
            imagePosition: "category-banner",
            itemImage: false,
            showDescription: true,
            showPriceVariants: true
        },

        animations: {
            page: "fade",
            category: "reveal",
            item: "slide",
            hover: "subtle"
        }
    },

    "template-3": {
        id: "template-3",
        name: "[TEMPLATE 3 NAME]",
        description: "[TEMPLATE 3 DESCRIPTION]",

        layout: {
            overall: "glass-modern",
            header: "glass-header",
            hero: "floating-hero",
            category: "floating-banner",
            menu: "glass-grid",
            menuItem: "glass-card",
            contact: "glass-sections",
            footer: "floating"
        },

        visual: {
            spacing: "comfortable",
            cardRadius: "extra-large",
            cardShadow: "diffused",
            borders: "glass",
            glass: true,
            blur: "high",
            floatingSections: true
        },

        typography: {
            heading: "modern-bold",
            body: "rounded-clean",
            price: "bold-modern"
        },

        navigation: {
            style: "glass",
            mobileStyle: "glass-sidebar",
            sticky: true
        },

        menu: {
            layout: "glass-grid",
            showCategoryImages: true,
            imagePosition: "category-banner",
            itemImage: false,
            showDescription: true,
            showPriceVariants: true
        },

        animations: {
            page: "blur-fade",
            category: "floating-reveal",
            item: "glass-slide",
            hover: "lift-glow"
        }
    },

    "template-4": {
        id: "template-4",
        name: "[TEMPLATE 4 NAME]",
        description: "[TEMPLATE 4 DESCRIPTION]",

        layout: {
            overall: "creative-asymmetric",
            header: "compact-floating",
            hero: "asymmetric-banner",
            category: "layered-image",
            menu: "asymmetric-list",
            menuItem: "layered-card",
            contact: "creative-grid",
            footer: "compact-modern"
        },

        visual: {
            spacing: "dynamic",
            cardRadius: "large",
            cardShadow: "deep-soft",
            borders: "subtle",
            glass: true,
            blur: "medium",
            floatingSections: true
        },

        typography: {
            heading: "creative-bold",
            body: "modern-clean",
            price: "strong"
        },

        navigation: {
            style: "compact-floating",
            mobileStyle: "animated-sidebar",
            sticky: true
        },

        menu: {
            layout: "asymmetric",
            showCategoryImages: true,
            imagePosition: "category-banner",
            itemImage: false,
            showDescription: true,
            showPriceVariants: true
        },

        animations: {
            page: "layered-reveal",
            category: "asymmetric-slide",
            item: "staggered-reveal",
            hover: "lift-scale"
        }
    },

    defaultTemplate: "template-1"
};

export default TEMPLATES;
