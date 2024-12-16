// import { LandingTributePageDark } from "../../pages/landing/LandingTributePageDark";
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
    // dark: {
    //     name: 'Dark',  // Add a 'name' property
    //     styles: {
    //         backgroundColor: '#121212',
    //         textColor: '#ffffff',
    //         // ... other style properties
    //     },
    //     layout: LandingTributePageDark, // Use this component in place of LandingTributePage
    //     // ...other layout components (LifePageDark, EventsPageDark, etc.)
    // },
    // ... other themes
};

export const themeNames = Object.keys(themes);
