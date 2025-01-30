// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { ThemeProvider, createTheme } from '@mui/material/styles'
// import './index.css'
// import App from './App.jsx'
// import { CssBaseline } from '@mui/material'
// import React from 'react'
// import Notification from './notification/Notification.jsx'
// import useAuthStore from './utils/useAuthStore.js'


// createRoot(document.getElementById('root')).render(
// 	<StrictMode>
// 		<CssBaseline />
// 		<App />
// 		<Notification />
// 	</StrictMode>
// )


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import React from "react";
import Notification from "./notification/Notification.jsx";
import useAuthStore from "./utils/useAuthStore.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "977070351773-06bn9pmaa4apuqjdhnijiek93kqj41jq.apps.googleusercontent.com"; // ✅ Fixed Client ID (Removed "http://")

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> {/* ✅ Wrap entire app */}
            <CssBaseline />
            <App />
            <Notification />
        </GoogleOAuthProvider>
    </StrictMode>
);




