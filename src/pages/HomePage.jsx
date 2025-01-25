// import React from 'react'
// import { Box, Button, Typography, Grid, IconButton, TextField } from '@mui/material'
// import { styled } from '@mui/system'
// import FacebookIcon from '@mui/icons-material/Facebook'
// import TwitterIcon from '@mui/icons-material/Twitter'
// import InstagramIcon from '@mui/icons-material/Instagram'
// import LinkedInIcon from '@mui/icons-material/LinkedIn'

// const Container = styled(Box)(({ theme }) => ({
// 	position: 'relative',
// 	display: 'flex',
// 	flexDirection: 'column',
// 	alignItems: 'center',
// 	justifyContent: 'center',
// 	width: '80%',
// 	margin: '50px auto',
// 	padding: '50px 40px',
// 	textAlign: 'center',
// 	borderRadius: '20px',
// 	background:
// 		theme.palette.mode === 'dark'
// 			? 'linear-gradient(145deg, #212121, #2c2c2c)'
// 			: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)',
// 	boxShadow:
// 		theme.palette.mode === 'dark'
// 			? '0 10px 20px rgba(0, 0, 0, 0.6)'
// 			: '0 10px 20px rgba(0, 0, 0, 0.2)',
// 	border: '2px solid transparent',
// }))

// const Footer = styled(Box)(({ theme }) => ({
// 	backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#f0f0f0',
// 	color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
// 	padding: '40px 20px',
// 	textAlign: 'center',
// }))

// const HomePage = () => {
// 	return (
// 		<Box sx={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px' }}>
// 			{/* Main Content */}
// 			<Container>
// 				<Typography variant='h3' sx={{ fontWeight: 'bold', mb: 2, color: '#2196f3' }}>
// 					ParkNow
// 				</Typography>
// 				<Typography variant='body1' sx={{ mb: 4, color: '#bbb' }}>
// 					Book parking spaces easily, monitor availability in real time, and pay securely.
// 					Revolutionize your parking experience today!
// 				</Typography>
// 				<Button variant='contained' color='primary' sx={{ textTransform: 'none', mb: 4 }}>
// 					Get Started
// 				</Button>
// 			</Container>

// 			{/* Footer */}
// 			<Footer>
// 				<Grid container spacing={3} justifyContent='center'>
// 					{/* Contact */}
// 					<Grid item xs={12} sm={4}>
// 						<Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
// 							Contact Us
// 						</Typography>
// 						<Typography variant='body2' sx={{ mb: 1 }}>
// 							Email: support@parknow.com
// 						</Typography>
// 						<Typography variant='body2' sx={{ mb: 1 }}>
// 							Phone: +1 (123) 456-7890
// 						</Typography>
// 						<Typography variant='body2' sx={{ mb: 1 }}>
// 							Address: 123 Parking St, City, Country
// 						</Typography>
// 					</Grid>
// 				</Grid>

// 				{/* Copyright */}
// 				<Box sx={{ mt: 4 }}>
// 					<Typography variant='body2' sx={{ color: '#bbb' }}>
// 						&copy; {new Date().getFullYear()} ParkNow. All rights reserved.
// 					</Typography>
// 				</Box>
// 			</Footer>
// 		</Box>
// 	)
// }

// export default HomePage

import React, { useState } from 'react'
import { Box, Button, Typography, Grid, Tooltip, IconButton, CssBaseline } from '@mui/material'
import { styled } from '@mui/system'
import SupportIcon from '@mui/icons-material/Support'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PaymentIcon from '@mui/icons-material/Payment'
import NearMeIcon from '@mui/icons-material/NearMe'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import useAuthStore from '../utils/useAuthStore'

const Container = styled(Box)(({ theme }) => ({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '80%',
	margin: '50px auto',
	padding: '50px 40px',
	textAlign: 'center',
	borderRadius: '20px',
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(145deg, #212121, #2c2c2c)'
			: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)',
	boxShadow:
		theme.palette.mode === 'dark'
			? '0 10px 20px rgba(0, 0, 0, 0.6)'
			: '0 10px 20px rgba(0, 0, 0, 0.2)',
	border: '2px solid transparent',
	animation: 'borderColorChange 6s infinite',
	'@keyframes borderColorChange': {
		'0%': { borderColor: theme.palette.primary.main },
		'25%': { borderColor: theme.palette.warning.main },
		'50%': { borderColor: theme.palette.success.main },
		'75%': { borderColor: theme.palette.error.main },
		'100%': { borderColor: theme.palette.primary.main },
	},
}))

const FeatureButton = styled(Button)(({ theme }) => ({
	width: '100%',
	color: theme.palette.primary.main,
	textTransform: 'none',
	fontWeight: 'bold',
	borderColor: theme.palette.primary.main,
}))

const Footer = styled(Box)(({ theme }) => ({
	// backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#f0f0f0',
	color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
	padding: '30px 20px',
	textAlign: 'center',
}))

const HomePage = () => {
	const { isDarkMode, setIsDarkMode } = useAuthStore()

	return (
		<Box
			sx={{
				backgroundColor: isDarkMode ? '#121212' : '#f0f0f0',
				color: isDarkMode ? '#fff' : '#000',
				minHeight: '100vh',
				padding: '20px',
			}}
		>
			<IconButton
				onClick={() => setIsDarkMode(!isDarkMode)}
				title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
				sx={{ position: 'absolute', top: '20px', right: '20px' }}
			>
				{isDarkMode ? (
					<DarkModeIcon sx={{ color: '#f5f5f5' }} />
				) : (
					<LightModeIcon sx={{ color: '#121212' }} />
				)}
			</IconButton>
			<Container>
				<Typography
					variant='h3'
					noWrap
					component='a'
					sx={{
						mx: 4,
						flexGrow: 1,
						fontFamily: 'monospace',
						fontWeight: 700,
						letterSpacing: '.8rem',
						color: '#2196f3',
						mb: 2,
					}}
				>
					PARKNOW
				</Typography>
				<Typography variant='body1' sx={{ mb: 4, fontSize: '1.2rem' }}>
					Revolutionize your parking experience with ParkNow! Book parking spaces
					effortlessly, monitor in real-time, and enjoy secure payments. Hassle-free
					parking solutions for everyone.
				</Typography>
				<Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
					<Tooltip title='Login to explore more' arrow>
						<Button
							variant='contained'
							color='primary'
							href='/signin'
							sx={{ textTransform: 'none', padding: '10px 20px', fontSize: '1rem' }}
						>
							Sign In
						</Button>
					</Tooltip>
					<Tooltip title="Don't have an account?" arrow>
						<Button
							href='/signup'
							variant='outlined'
							color='primary'
							sx={{ textTransform: 'none', padding: '10px 20px', fontSize: '1rem' }}
						>
							Sign Up
						</Button>
					</Tooltip>
				</Box>
				<Grid container spacing={3} justifyContent='center'>
					<Grid item xs={12} sm={6} md={3}>
						<FeatureButton
							variant='outlined'
							startIcon={<SupportIcon />}
							sx={{
								borderRadius: '20px',
								borderWidth: '2px',
								transition: 'all 0.3s',
								'&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
							}}
						>
							24/7 Support
						</FeatureButton>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FeatureButton
							variant='outlined'
							startIcon={<VisibilityIcon />}
							sx={{
								borderRadius: '20px',
								borderWidth: '2px',
								transition: 'all 0.3s',
								'&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
							}}
						>
							Real-time Updates
						</FeatureButton>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FeatureButton
							variant='outlined'
							startIcon={<PaymentIcon />}
							sx={{
								borderRadius: '20px',
								borderWidth: '2px',
								transition: 'all 0.3s',
								'&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
							}}
						>
							Secure Payments
						</FeatureButton>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FeatureButton
							variant='outlined'
							startIcon={<NearMeIcon />}
							sx={{
								borderRadius: '20px',
								borderWidth: '2px',
								transition: 'all 0.3s',
								'&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
							}}
						>
							Find Spots Near You
						</FeatureButton>
					</Grid>
				</Grid>
			</Container>
			<Footer>
				<Grid container spacing={3} justifyContent='center'>
					{/* Contact */}
					<Grid item xs={12} sm={4}>
						<Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
							Contact Us
						</Typography>
						<Typography variant='body2' sx={{ mb: 1 }}>
							Email: support@parknow.com
						</Typography>
						<Typography variant='body2' sx={{ mb: 1 }}>
							Phone: +91 9876543210
						</Typography>
						<Typography variant='overline' sx={{ mb: 1 }}>
							Contact Us to Become A Manager
						</Typography>
					</Grid>
				</Grid>

				{/* Copyright */}
				<Box sx={{ mt: 4 }}>
					<Typography variant='body2' color='text.secondary'>
						&copy; {new Date().getFullYear()} ParkNow. All rights reserved.
					</Typography>
				</Box>
			</Footer>
		</Box>
	)
}

export default HomePage

// // import React from 'react'
// // import { Box, Button, Typography } from '@mui/material'
// // import { styled } from '@mui/system'
// // import SupportIcon from '@mui/icons-material/Support'
// // import VisibilityIcon from '@mui/icons-material/Visibility'
// // import PaymentIcon from '@mui/icons-material/Payment'
// // import AnalyticsIcon from '@mui/icons-material/Analytics'

// // const Container = styled(Box)(({ theme }) => ({
// // 	position: 'relative',
// // 	display: 'flex',
// // 	flexDirection: 'column',
// // 	alignItems: 'center',
// // 	justifyContent: 'center',
// // 	width: '80%',
// // 	margin: '50px auto',
// // 	padding: '40px',
// // 	textAlign: 'center',
// // 	borderRadius: '20px',
// // 	background: 'linear-gradient(145deg, #1e1e1e, #292929)',
// // 	boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
// // 	overflow: 'hidden',
// // 	border: '2px solid transparent',
// // 	animation: 'borderColorChange 6s infinite',
// // 	'@keyframes borderColorChange': {
// // 		'0%': { borderColor: '#2196f3' },
// // 		'25%': { borderColor: '#ff9800' },
// // 		'50%': { borderColor: '#4caf50' },
// // 		'75%': { borderColor: '#f44336' },
// // 		'100%': { borderColor: '#2196f3' },
// // 	},
// // }))

// // const HomePage = () => {
// // 	return (
// // 		<Box sx={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px' }}>
// // 			<Container>
// // 				<Typography variant='h3' sx={{ color: '#2196f3', fontWeight: 'bold' }}>
// // 					Smart Parking Management
// // 				</Typography>
// // 				<Typography variant='body1' sx={{ color: '#bbb', mt: 2 }}>
// // 					Streamline your parking operations with our intelligent management system.
// // 					Experience hassle-free parking solutions for modern businesses.
// // 				</Typography>
// // 				<Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
// // 					<Button variant='contained' color='primary' sx={{ textTransform: 'none' }}>
// // 						Login
// // 					</Button>
// // 					<Button variant='outlined' color='primary' sx={{ textTransform: 'none' }}>
// // 						Sign Up
// // 					</Button>
// // 				</Box>
// // 				<Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
// // 					<Button startIcon={<SupportIcon />} variant='outlined' color='info'>
// // 						24/7 Support
// // 					</Button>
// // 					<Button startIcon={<VisibilityIcon />} variant='outlined' color='info'>
// // 						Real-time Monitoring
// // 					</Button>
// // 					<Button startIcon={<PaymentIcon />} variant='outlined' color='info'>
// // 						Secure Payments
// // 					</Button>
// // 					<Button startIcon={<AnalyticsIcon />} variant='outlined' color='info'>
// // 						Smart Analytics
// // 					</Button>
// // 				</Box>
// // 			</Container>
// // 		</Box>
// // 	)
// // }

// // export default HomePage
