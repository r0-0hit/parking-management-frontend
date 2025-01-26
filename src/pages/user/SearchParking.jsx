import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import axios from 'axios'
import {
	Container,
	Divider,
	Grid,
	Stack,
	Typography,
	Card,
	CardContent,
	CardActions,
	CircularProgress,
	Rating,
	Alert,
	AlertTitle,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { toast } from 'react-toastify'
import NavBar from '../../components/NavBar'
import dayjs from 'dayjs'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useAuthStore from '../../utils/useAuthStore'
import isSessionExpire from '../../utils/session'

function SearchParking() {
	const [location, setLocation] = useState('')
	const [disLocation, setDisLocation] = useState(false)
	const [transactionId, setTransactionId] = useState('')
	const [date, setDate] = useState(null)
	const [startTime, setStartTime] = useState(null)
	const [endTime, setEndTime] = useState(null)
	const [parkingSlots, setParkingSlots] = useState(null)
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [openScanner, setOpenScanner] = useState(false)
	const [bookingSlot, setBookingSlot] = useState(null)
	const [total, setTotal] = useState({
		amount: 0,
		hour: 0,
	})
	const [userLng, setUserLng] = useState(null)
	const [userLat, setUserLat] = useState(null)

	const { token, user } = useAuthStore()

	const imgStyle = {
		width: '300px',
		height: '350px',
		borderRadius: '10px',
		objectFit: 'cover',
		margin: '20px auto',
	}

	const parsedDate = dayjs(date) // Convert to a Date object
	const start = dayjs(parsedDate)
		.hour(dayjs(startTime).hour())
		.minute(dayjs(startTime).minute())
		.toDate()
	const end = dayjs(parsedDate)
		.hour(dayjs(endTime).hour())
		.minute(dayjs(endTime).minute())
		.toDate()

	const handleSearch = async () => {
		if (!location || !parsedDate || !start || !end) {
			toast.error('Please fill all fields!')
			return
		}

		if (dayjs(start).isBefore(new Date()) || dayjs(end).isBefore(dayjs(start))) {
			toast.error('Please fill all fields correctly!')
			return
		}

		setLoading(true)

		try {
			const response = await axios.get('https://parking-management-backend-epnm.onrender.com/api/available-spots', {
				headers: {
					Authorization: `Bearer ${token}`, // Add the Authorization header
				},

				params: { location, date, start, end, lat: userLat, lng: userLng },
			})

			setParkingSlots(response.data)
			setLoading(false)
		} catch (error) {
			isSessionExpire(error)
			console.error('Error fetching parking slots:', error.response.data)
			toast.error('There was an error fetching the parking slots!')
			setLoading(false)
		}
	}

	const calculateTotal = slot => {
		// Calculate the difference in milliseconds
		const durationInMilliseconds = end - start

		// Convert milliseconds to hours
		const durationInHours = durationInMilliseconds / (1000 * 60 * 60)

		// Round to 2 decimal places for display purposes
		const roundedDuration = Math.round(durationInHours * 100) / 100

		const totalAmountTemp = roundedDuration * slot.hourly_rate
		setTotal({
			hour: roundedDuration,
			amount: totalAmountTemp,
		})
	}

	const handelBooking = slot => {
		calculateTotal(slot)
		setOpen(true)
	}

	const handleScannerClose = () => {
		setOpenScanner(false)
	}

	const handelPayment = () => {
		setOpen(false)
		setOpenScanner(true)
	}

	const handelPaymentDone = async () => {
		try {
			const response = await axios.post(
				'https://parking-management-backend-epnm.onrender.com/api/user/bookings',
				{
					parking_spot_id: bookingSlot._id,
					booking_date: parsedDate,
					start_time: start,
					end_time: end,
					total_cost: total.amount,
					total_hours: total.hour,
					transactionId,
					userEmail: user.email,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the Authorization header
					},
				}
			)

			toast.success(response.data.message)
			setOpenScanner(false)
			setTransactionId('')
		} catch (error) {
			isSessionExpire(error)
			console.error(error)
			toast.error(error.response.data.message)
		} finally {
			setOpenScanner(false)
		}
	}

	const handleNearMe = () => {
		navigator.geolocation.getCurrentPosition(
			position => {
				setUserLat(position.coords.latitude)
				setUserLng(position.coords.longitude)
			},
			error => {
				console.error('Error fetching location:', error)
				toast.error('Error fetching location')
			}
		)
		setDisLocation(prev => !prev)
		!disLocation ? setLocation('Your Current Location') : setLocation('')
	}

	return (
		<>
			<NavBar />
			<Dialog
				open={openScanner}
				keepMounted
				onClose={handleScannerClose}
				aria-describedby='alert-dialog-slide-description'
				color='error'
			>
				<DialogTitle color='success'>{'PAYMENT'}</DialogTitle>
				<DialogContent>
					<Typography>
						Scan and Pay the total amount. After the payment is done past the
						transaction ID of the payment.
					</Typography>
					<Typography>
						You will be notified through email wether your booking is confirmed.
					</Typography>
					<Typography variant='h6' component={'div'} color='text.secondary' gutterBottom>
						Total Bill: ₹{total.amount}
					</Typography>
					<Box display={'flex'}>
						<img src='https://i.ibb.co/swHkJnk/scanner.jpg' style={imgStyle} />
					</Box>
					<Alert variant='outlined' severity='warning'>
						<AlertTitle>NOTE</AlertTitle>
						Please, enter the correct transaction ID and pay the correct amount. If any
						malpractice is found, you may be banned form our platform.
					</Alert>
					<TextField
						autoFocus
						label={'Transaction ID'}
						variant={'outlined'}
						color={'info'}
						margin={'normal'}
						fullWidth
						value={transactionId}
						onChange={e => setTransactionId(e.target.value)}
						required
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleScannerClose}>Cancel</Button>
					<Button onClick={handelPaymentDone}>Done</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={open}
				keepMounted
				onClose={() => setOpen(false)}
				aria-describedby='alert-dialog-slide-description'
				color='error'
			>
				<DialogTitle
					color='success'
					sx={{
						width: '350px',
					}}
				>
					{'Confirm Booking'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-slide-description'>
						<Typography
							variant='h5'
							component={'div'}
							sx={{ fontWeight: 'bold' }}
							gutterBottom
						>
							{bookingSlot?.name}
						</Typography>
						<Typography variant='body2' color='text.secondary' gutterBottom>
							Location: {bookingSlot?.location}
						</Typography>
						<Typography variant='body2' color='text.secondary' gutterBottom>
							Hourly Rate: ₹{bookingSlot?.hourly_rate}
						</Typography>
						<Typography variant='h6' component={'div'} color='text.secondary'>
							Total hours: {total.hour} hours
						</Typography>
						<Typography
							variant='h6'
							component={'div'}
							color='text.secondary'
							gutterBottom
						>
							Total Bill: ₹{total.amount}
						</Typography>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={handelPayment}>Pay Now</Button>
				</DialogActions>
			</Dialog>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Container component='main' maxWidth='sm'>
					<Box
						sx={{
							marginTop: 8,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Typography component='h1' variant='h4' gutterBottom>
							Search Parking Slots
						</Typography>

						<Box
							component='form'
							noValidate
							sx={{ mt: 1 }}
							onSubmit={e => e.preventDefault()}
						>
							<Grid container spacing={2} sx={{ marginBottom: 3 }}>
								<Grid item xs={12}>
									<Stack direction={'row'} spacing={2}>
										<TextField
											margin='normal'
											required
											fullWidth
											id='location'
											label='Location'
											name='location'
											autoComplete='location'
											autoFocus
											value={location}
											onChange={e => setLocation(e.target.value)}
											disabled={disLocation}
										/>
										<Button
											variant='outlined'
											color='primary'
											onClick={handleNearMe}
											sx={{ whiteSpace: 'nowrap' }}
										>
											Near Me
										</Button>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<DatePicker
										label='Select Date'
										value={date}
										onChange={newDate => setDate(newDate)}
										renderInput={params => (
											<TextField {...params} fullWidth margin='normal' />
										)}
									/>
								</Grid>
								<Grid item xs={6}>
									<TimePicker
										required
										label='Start Time'
										value={startTime}
										onChange={newTime => setStartTime(newTime)}
										renderInput={params => (
											<TextField {...params} fullWidth margin='normal' />
										)}
									/>
								</Grid>
								<Grid item xs={6}>
									<TimePicker
										required
										label='End Time'
										value={endTime}
										onChange={newTime => setEndTime(newTime)}
										renderInput={params => (
											<TextField {...params} fullWidth margin='normal' />
										)}
									/>
								</Grid>
							</Grid>

							<Button
								fullWidth
								variant='contained'
								sx={{ mt: 3 }}
								onClick={handleSearch}
							>
								{loading ? (
									<CircularProgress size={24} color='inherit' />
								) : (
									'Search'
								)}
							</Button>
						</Box>

						<Divider sx={{ width: '100%', mt: 4 }} />

						{parkingSlots?.length === 0 && !loading ? (
							<Typography variant='h6' color='text.secondary' sx={{ marginTop: 4 }}>
								No parking slots available for the selected criteria.
							</Typography>
						) : (
							<Grid container spacing={2} sx={{ my: 4 }}>
								{parkingSlots?.map(slot => (
									<Grid item sm={6} md={4} key={slot._id}>
										<Card sx={{ boxShadow: 3, borderRadius: 2 }}>
											<CardContent>
												<Typography
													variant='h5'
													sx={{ fontWeight: 'bold' }}
													gutterBottom
												>
													{slot.name}
												</Typography>
												<Rating
													value={slot.rating}
													precision={0.5}
													readOnly
												/>
												<Typography
													variant='body2'
													color='text.secondary'
													gutterBottom
												>
													Location: {slot.location}
												</Typography>
												<Typography
													variant='body2'
													color='text.secondary'
													gutterBottom
												>
													Hourly Rate: ₹{slot.hourly_rate}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
													gutterBottom
												>
													Ratings: {slot.num_ratings}
												</Typography>
											</CardContent>
											<CardActions>
												<Button
													fullWidth
													size='small'
													variant='contained'
													color='primary'
													onClick={() => {
														setBookingSlot(slot)
														handelBooking(slot)
													}}
												>
													Book Now
												</Button>
											</CardActions>
										</Card>
									</Grid>
								))}
							</Grid>
						)}
					</Box>
				</Container>
			</LocalizationProvider>
		</>
	)
}

export default SearchParking
