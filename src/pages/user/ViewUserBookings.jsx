import React, { useEffect, useState } from 'react'
import {
	Container,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	Typography,
	Divider,
	Box,
	Rating,
	Alert,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'
import { toast } from 'react-toastify'
import NavBar from '../../components/NavBar'
import useAuthStore from '../../utils/useAuthStore'
import dayjs from 'dayjs'
import isSessionExpire from '../../utils/session'

function ViewBookings() {
	const [upcomingBookings, setUpcomingBookings] = useState([])
	const [pastBookings, setPastBookings] = useState([])
	const [open, setOpen] = useState(false)
	const [openCancel, setOpenCancel] = useState(false)
	const [rating, setRating] = useState(3)
	const [selectedCancelSpot, setSelectedCancelSpot] = useState(null)
	const [selectedSpot, setSelectedSpot] = useState(null)
	const { token } = useAuthStore()

	const fetchBookings = async () => {
		try {
			const response = await axios.get(
				'https://parking-management-backend-epnm.onrender.com/api/user/bookings/my-bookings',
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the Authorization header
					},
				}
			)

			const allBookings = response.data

			// Separate bookings into upcoming and past
			const currentDate = dayjs()

			const upcoming = allBookings.filter(booking =>
				dayjs(booking.start_time).isAfter(currentDate)
			)
			const past = allBookings.filter(booking =>
				dayjs(booking.start_time).isBefore(currentDate)
			)

			setUpcomingBookings(upcoming)
			setPastBookings(past)
		} catch (error) {
			isSessionExpire(error)
			console.error('Error fetching bookings:', error.response.data.message)
			toast.error('There was an error fetching your bookings.')
		}
	}

	const handelRating = async () => {
		try {
			const response = await axios.put(
				'https://parking-management-backend-epnm.onrender.com/api/user/bookings',
				{
					id: selectedSpot,
					rating,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			toast.success(response.data.message)
			fetchBookings()
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
			toast.error(error.response.data.message + '!!')
		} finally {
			setOpen(false)
		}
	}

	useEffect(() => {
		// const fetchBookings = async () => {
		// 	try {
		// 		const response = await axios.get(
		// 			'http://localhost:5000/api/user/bookings/my-bookings',
		// 			{
		// 				headers: {
		// 					Authorization: `Bearer ${token}`, // Add the Authorization header
		// 				},
		// 			}
		// 		)

		// 		const allBookings = response.data

		// 		// Separate bookings into upcoming and past
		// 		const currentDate = new Date()

		// 		const upcoming = allBookings.filter(booking =>
		// 			dayjs(booking.booking_date).isAfter(currentDate)
		// 		)
		// 		const past = allBookings.filter(booking =>
		// 			dayjs(booking.booking_date).isBefore(currentDate)
		// 		)

		// 		setUpcomingBookings(upcoming)
		// 		setPastBookings(past)
		// 	} catch (error) {
		// 		isSessionExpire(error)
		// 		console.error('Error fetching bookings:', error.response.data.message)
		// 		error.response.data.message != 'Invalid Token' &&
		// 			toast.error('There was an error fetching your bookings.')
		// 	}
		// }
		fetchBookings()
	}, [])

	const handelOpeanCancelDilog = booking => {
		setSelectedCancelSpot(booking)
		setOpenCancel(true)
	}

	const handelCloseCancelDilog = () => {
		setOpenCancel(false)
		setSelectedCancelSpot(null)
	}

	const handelBookingCancle = async () => {
		console.log(selectedCancelSpot)
		try {
			const response = await axios.delete(
				'https://parking-management-backend-epnm.onrender.com/api/user/bookings/delete',
				{
					data: { id: selectedCancelSpot._id },
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			toast.success(response.data.message)
			handelCloseCancelDilog()
			fetchBookings()
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
			toast.error(error.response.data.message + '!!')
		}
	}

	return (
		<>
			<NavBar />

			<Container component='main'>
				<Dialog
					open={openCancel}
					keepMounted
					onClose={handelCloseCancelDilog}
					aria-describedby='alert-dialog-slide-description'
					color='error'
				>
					<DialogTitle color='error.dark'>{'Cancel Upcoming Booking??'}</DialogTitle>
					<DialogContent>
						<DialogContentText id='alert-dialog-slide-description'>
							{'Are you sure you want to '}
							<strong>Cancle</strong>
							{'? It may take 1-2 days to refund your money.'}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						{/* <Button onClick={handelCloseCancelDilog}>Cancel</Button> */}
						<Button onClick={handelBookingCancle} color='error'>
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
				<Box sx={{ my: 8 }}>
					<Typography variant='h4' gutterBottom>
						Your Parking Bookings
					</Typography>

					{/* Upcoming Bookings */}
					<Typography variant='h5' sx={{ mb: 2 }}>
						Upcoming Bookings
					</Typography>
					<Grid container spacing={2}>
						{upcomingBookings.length > 0 ? (
							upcomingBookings.map(booking => (
								<Grid item xs={12} sm={6} md={4} key={booking._id}>
									<Card sx={{ boxShadow: 3, borderRadius: 2 }}>
										<CardContent>
											<Typography variant='h5'>
												{booking.parking_spot_id.name}
											</Typography>
											<Typography variant='h6'>
												{booking.parking_spot_id.location}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Date:{' '}
												{new Date(
													booking.booking_date
												).toLocaleDateString()}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Time:{' '}
												{new Date(booking.start_time).toLocaleTimeString()}{' '}
												- {new Date(booking.end_time).toLocaleTimeString()}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Amount: ₹ {booking.total_cost}
											</Typography>
											<Typography variant='body2' color='text.primary'>
												Status: {booking.status}
											</Typography>
										</CardContent>
										<CardActions>
											<Button
												size='small'
												color='primary'
												onClick={() => handelOpeanCancelDilog(booking)}
											>
												Cancel
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))
						) : (
							<Grid item xs={12}>
								<Typography variant='body1' color='text.secondary'>
									You have no upcoming bookings.
								</Typography>
							</Grid>
						)}
					</Grid>

					<Divider sx={{ my: 4 }} />

					{/* Past Bookings */}
					<Typography variant='h5' sx={{ mb: 2 }}>
						Past Bookings
					</Typography>
					<Grid container spacing={2}>
						{pastBookings.length > 0 ? (
							pastBookings.map(booking => (
								<Grid item xs={12} sm={6} md={4} key={booking._id}>
									<Card sx={{ boxShadow: 3, borderRadius: 2 }}>
										<CardContent>
											<Typography variant='h5'>
												{booking.parking_spot_id.name}
											</Typography>
											<Typography variant='h6'>
												{booking.parking_spot_id.location}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Date:{' '}
												{new Date(
													booking.booking_date
												).toLocaleDateString()}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Time:{' '}
												{new Date(booking.start_time).toLocaleTimeString()}{' '}
												- {new Date(booking.end_time).toLocaleTimeString()}
											</Typography>
											<Typography
												variant='body2'
												color='text.primary'
												gutterBottom
											>
												Status: {booking.status}
											</Typography>
											{booking.is_rated && (
												<Rating
													value={booking.rating}
													precision={0.5}
													readOnly
												/>
											)}
										</CardContent>
										<CardActions>
											{!booking.is_rated && (
												<Button
													variant='text'
													onClick={() => {
														setSelectedSpot(booking._id)
														setOpen(true)
													}}
												>
													Rate Now
												</Button>
											)}
											<Button size='small' color='primary' disabled>
												Completed
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))
						) : (
							<Grid item xs={12}>
								<Typography variant='body1' color='text.secondary'>
									You have no past bookings.
								</Typography>
							</Grid>
						)}
					</Grid>
				</Box>
				<Dialog open={open} keepMounted onClose={() => setOpen(false)}>
					<DialogTitle color={'success'}>{'Rating:'}</DialogTitle>
					<DialogContent>
						<DialogContentText id='alert-dialog-slide-description'>
							Thank you for giving the rating.
						</DialogContentText>
						{rating === null && (
							<Alert severity='error' variant='outlined'>
								Rating cannot be Zero.
							</Alert>
						)}
						<Rating
							name='simple-controlled'
							value={rating}
							defaultValue={3}
							onChange={(event, newRating) => {
								setRating(newRating)
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpen(false)}>Cancel</Button>
						<Button onClick={handelRating}>Rate</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</>
	)
}

export default ViewBookings
