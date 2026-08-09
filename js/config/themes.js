const THEMES = {
    "theme-1": {
        id: "theme-1",
        name: "[THEME 1 NAME]",
        description: "[THEME 1 DESCRIPTION]",

        style: {
            visualDirection: "social-inspired-modern",
            density: "comfortable",
            borderRadius: "large",
            cardStyle: "floating-glass",
            sectionStyle: "layered",
            navigationStyle: "floating",
            buttonStyle: "pill",
            imageStyle: "rounded",
            shadowStyle: "soft",
            borderStyle: "subtle",
            blurLevel: "medium"
        },

        colors: {
            primary: "[ADD THEME 1 PRIMARY COLOR]",
            secondary: "[ADD THEME 1 SECONDARY COLOR]",
            accent: "[ADD THEME 1 ACCENT COLOR]",
            background: "[ADD THEME 1 BACKGROUND COLOR]",
            surface: "[ADD THEME 1 SURFACE COLOR]",
            surfaceStrong: "[ADD THEME 1 STRONG SURFACE COLOR]",
            text: "[ADD THEME 1 TEXT COLOR]",
            textMuted: "[ADD THEME 1 MUTED TEXT COLOR]",
            border: "[ADD THEME 1 BORDER COLOR]",
            overlay: "[ADD THEME 1 OVERLAY COLOR]"
        },

        gradient: {
            enabled: true,
            primary: "[ADD THEME 1 GRADIENT]",
            secondary: "[ADD THEME 1 SECONDARY GRADIENT]"
        },

        typography: {
            headingStyle: "bold-modern",
            bodyStyle: "clean-modern",
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: "normal"
        },

        effects: {
            glass: true,
            blur: true,
            floating: true,
            layeredCards: true,
            gradients: true,
            glow: true,
            hoverLift: true,
            hoverScale: true
        },

        animations: {
            hero: "floating-reveal",
            sections: "smooth-reveal",
            cards: "staggered-fade",
            buttons: "soft-scale",
            navigation: "blur-slide"
        }
    },

    "theme-2": {
        id: "theme-2",
        name: "[THEME 2 NAME]",
        description: "[THEME 2 DESCRIPTION]",

        style: {
            visualDirection: "messaging-inspired-modern",
            density: "comfortable",
            borderRadius: "extra-large",
            cardStyle: "soft-transparent",
            sectionStyle: "floating-layers",
            navigationStyle: "compact-floating",
            buttonStyle: "rounded",
            imageStyle: "rounded-large",
            shadowStyle: "diffused",
            borderStyle: "glass",
            blurLevel: "high"
        },

        colors: {
            primary: "[ADD THEME 2 PRIMARY COLOR]",
            secondary: "[ADD THEME 2 SECONDARY COLOR]",
            accent: "[ADD THEME 2 ACCENT COLOR]",
            background: "[ADD THEME 2 BACKGROUND COLOR]",
            surface: "[ADD THEME 2 SURFACE COLOR]",
            surfaceStrong: "[ADD THEME 2 STRONG SURFACE COLOR]",
            text: "[ADD THEME 2 TEXT COLOR]",
            textMuted: "[ADD THEME 2 MUTED TEXT COLOR]",
            border: "[ADD THEME 2 BORDER COLOR]",
            overlay: "[ADD THEME 2 OVERLAY COLOR]"
        },

        gradient: {
            enabled: true,
            primary: "[ADD THEME 2 GRADIENT]",
            secondary: "[ADD THEME 2 SECONDARY GRADIENT]"
        },

        typography: {
            headingStyle: "friendly-bold",
            bodyStyle: "clean-rounded",
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: "normal"
        },

        effects: {
            glass: true,
            blur: true,
            floating: true,
            layeredCards: true,
            gradients: true,
            glow: false,
            hoverLift: true,
            hoverScale: true
        },

        animations: {
            hero: "soft-slide",
            sections: "fade-up",
            cards: "floating-stagger",
            buttons: "soft-bounce",
            navigation: "smooth-slide"
        }
    },

    "theme-3": {
        id: "theme-3",
        name: "[THEME 3 NAME]",
        description: "[THEME 3 DESCRIPTION]",

        style: {
            visualDirection: "camera-inspired-visual",
            density: "spacious",
            borderRadius: "large",
            cardStyle: "transparent-layered",
            sectionStyle: "editorial-floating",
            navigationStyle: "minimal-floating",
            buttonStyle: "modern-pill",
            imageStyle: "editorial-rounded",
            shadowStyle: "deep-soft",
            borderStyle: "minimal",
            blurLevel: "medium"
        },

        colors: {
            primary: "[ADD THEME 3 PRIMARY COLOR]",
            secondary: "[ADD THEME 3 SECONDARY COLOR]",
            accent: "[ADD THEME 3 ACCENT COLOR]",
            background: "[ADD THEME 3 BACKGROUND COLOR]",
            surface: "[ADD THEME 3 SURFACE COLOR]",
            surfaceStrong: "[ADD THEME 3 STRONG SURFACE COLOR]",
            text: "[ADD THEME 3 TEXT COLOR]",
            textMuted: "[ADD THEME 3 MUTED TEXT COLOR]",
            border: "[ADD THEME 3 BORDER COLOR]",
            overlay: "[ADD THEME 3 OVERLAY COLOR]"
        },

        gradient: {
            enabled: true,
            primary: "[ADD THEME 3 GRADIENT]",
            secondary: "[ADD THEME 3 SECONDARY GRADIENT]"
        },

        typography: {
            headingStyle: "editorial-bold",
            bodyStyle: "modern-clean",
            headingWeight: 700,
            bodyWeight: 400,
            letterSpacing: "slightly-tight"
        },

        effects: {
            glass: true,
            blur: true,
            floating: true,
            layeredCards: true,
            gradients: true,
            glow: true,
            hoverLift: true,
            hoverScale: true
        },

        animations: {
            hero: "visual-reveal",
            sections: "parallax-lite",
            cards: "image-reveal",
            buttons: "smooth-scale",
            navigation: "fade-blur"
        }
    },

    defaultTheme: "theme-1"
};

export default THEMES;
