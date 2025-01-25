import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material'

const ManagerDashboard = () => {
	return (
		<Box
			sx={{
				p: 4,
				minHeight: '100vh',
			}}
		>
			<Typography variant='h4' gutterBottom>
				Welcome to Your Dashboard
			</Typography>
			<Typography variant='h6' gutterBottom>
				Role:Manager
			</Typography>

			<Grid container spacing={3}>
				{/* Manager Dashboard Cards */}
				<Grid item xs={12} sm={6} md={4}>
					<Card>
						<CardContent>
							<Typography variant='h6'>Add Parking Spot</Typography>
							<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
								Add new parking locations with rates and availability.
							</Typography>
							<Button
								variant='contained'
								color='primary'
								onClick={() => (window.location.href = '/addParkingSpot')}
							>
								Add Spot
							</Button>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<Card>
						<CardContent>
							<Typography variant='h6'>View Bookings</Typography>
							<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
								Check and manage user bookings for your parking spots.
							</Typography>
							<Button
								variant='contained'
								color='primary'
								onClick={() => (window.location.href = '/viewBookings')}
							>
								View Bookings
							</Button>
						</CardContent>
					</Card>
				</Grid>
				{/* <Grid item xs={12} sm={6} md={4}>
					<Card>
						<CardContent>
							<Typography variant='h6'>Earnings Report</Typography>
							<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
								View your earnings from the parking spots you manage.
							</Typography>
							<Button
								variant='contained'
								color='primary'
								onClick={() => handleAction('Earnings Report')}
							>
								View Report
							</Button>
						</CardContent>
					</Card>
				</Grid> */}
				<Grid item xs={12} sm={6} md={4}>
					<Card>
						<CardContent>
							<Typography variant='h6'>View Parking Spots</Typography>
							<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
								View/Edit all your parking spots that you manage.
							</Typography>
							<Button
								variant='contained'
								color='primary'
								onClick={() => (window.location.href = '/ViewEditParkingSpots')}
							>
								View Spots
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default ManagerDashboard
