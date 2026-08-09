const ANIMATIONS = {
    enabled: true,

    duration: {
        fast: 180,
        normal: 350,
        slow: 600
    },

    easing: {
        standard: "cubic-bezier(0.22, 1, 0.36, 1)",
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        soft: "ease-out"
    },

    effects: {
        sectionReveal: true,
        cardReveal: true,
        floatingElements: true,
        hoverLift: true,
        hoverScale: true,
        blurTransition: true,
        pageTransition: true,
        numberCounter: true,
        staggeredCards: true
    },

    staggerDelay: 70
};

export default ANIMATIONS;
