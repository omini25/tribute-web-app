import {LandingTributePage} from "../pages/landing/LandingTributePage.jsx";

export const themes = {
    light: {
        name: 'Light',
        styles: { // Keep existing styles
            backgroundColor: '#ffffff',
            textColor: '#000000',
            // ... other style properties
        },
        layout:  LandingTributePage, // Default Landing Page
        // ...other layout components for other routes (LifePageLight, EventsPageLight etc.)
    },
    dark: {
        name: 'Dark',
        styles: {
            backgroundColor: '#121212',
            textColor: '#ffffff',
            // ... other style properties
        },
        layout: LandingTributePage, // For now, we can reuse the light layout
    },
};

export const themeNames = Object.keys(themes);
