import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import AddParkingSpot from './pages/manager/AddParkingSpot'
import ViewBookings from './pages/manager/ViewBookings'
import ViewUserBookings from './pages/user/ViewUserBookings'
import ViewEditParkingSpots from './pages/manager/ViewEditParkingSpots'
import SearchParking from './pages/user/SearchParking'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import useAuthStore from './utils/useAuthStore'
import HomePage from './pages/HomePage'

export default function App() {
	const { isDarkMode } = useAuthStore()

	const darkTheme = createTheme({
		palette: {
			mode: isDarkMode ? 'dark' : 'light',
		},
	})
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/signin' element={<SignIn />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/searchParking' element={<SearchParking />} />
					<Route path='/addParkingSpot' element={<AddParkingSpot />} />
					<Route path='/viewBookings' element={<ViewBookings />} />
					<Route path='/viewUserBookings' element={<ViewUserBookings />} />
					<Route path='/ViewEditParkingSpots' element={<ViewEditParkingSpots />} />
				</Routes>
			</Router>
		</ThemeProvider>
	)
}
