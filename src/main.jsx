import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import './index.css'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import React from 'react'
import Notification from './notification/Notification.jsx'
import useAuthStore from './utils/useAuthStore.js'


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<CssBaseline />
		<App />
		<Notification />
	</StrictMode>

	// Bhagwat
)



