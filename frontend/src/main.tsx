import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import {
    StyledEngineProvider,
    ThemeProvider,
    type ThemeOptions,
} from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme } from '@mui/material/styles';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles.css';
import reportWebVitals from './reportWebVitals.ts';

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {},
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#f4511e',
        },
        secondary: {
            main: '#d81b60',
        },
    },
};

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <StyledEngineProvider enableCssLayer>
                {/* <ThemeProvider theme={themeOptions}> */}
                <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
                <RouterProvider router={router} />
                {/* </ThemeProvider> */}
            </StyledEngineProvider>
        </StrictMode>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
