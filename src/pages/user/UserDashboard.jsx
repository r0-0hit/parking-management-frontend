import React from 'react'
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material'

const UserDashboard = () => {
	const handleAction = action => {
		console.log(`${action} clicked`)
		// Add navigation or functionality for the action
	}
	return (
		<>
			<Box
				sx={{
					p: 4,
					// backgroundColor: '#f5f5f5',
					minHeight: '100vh',
				}}
			>
				<Typography variant='h4' gutterBottom>
					Welcome to Your Dashboard
				</Typography>
				<Typography variant='h6' gutterBottom>
					Role: User
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent>
								<Typography variant='h6'>Search Parking Spots</Typography>
								<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
									Find parking spots near your destination.
								</Typography>
								<Button
									variant='contained'
									color='primary'
									onClick={() => (window.location.href = '/searchParking')}
								>
									Search Spots
								</Button>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent>
								<Typography variant='h6'>View Bookings</Typography>
								<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
									Check your past and upcoming parking bookings.
								</Typography>
								<Button
									variant='contained'
									color='primary'
									onClick={() => (window.location.href = '/viewUserBookings')}
								>
									View Bookings
								</Button>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Card>
							<CardContent>
								<Typography variant='h6'>Payment History</Typography>
								<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
									View your past payments for bookings.
								</Typography>
								<Button
									variant='contained'
									color='primary'
									onClick={() => handleAction('Payment History')}
								>
									View History
								</Button>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</>
	)
}

export default UserDashboard
