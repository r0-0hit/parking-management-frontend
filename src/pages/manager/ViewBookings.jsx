import { useEffect, useState } from 'react'
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Button,
	Grid,
} from '@mui/material'
import axios from 'axios'
import useAuthStore from '../../utils/useAuthStore'
import NavBar from '../../components/NavBar'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { toast } from 'react-toastify'
import isSessionExpire from '../../utils/session'

const ViewBookings = () => {
	const { token } = useAuthStore()

	const [open, setOpen] = useState(false)

	const fetchData = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/manager/bookings', {
				headers: {
					Authorization: `Bearer ${token}`, // Add the Authorization header
				},
			})
			setBookings([...response.data])
			setFilteredBookings([...response.data])
		} catch (error) {
			isSessionExpire(error)
			console.error(error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// Sample data to populate the table
	const [bookings, setBookings] = useState([])
	const [selectedBooking, setSelectedBooking] = useState(null)

	const [searchTerm, setSearchTerm] = useState('')
	const [filteredBookings, setFilteredBookings] = useState(bookings)

	const handleSearch = () => {
		const filtered = bookings.filter(
			booking =>
				booking.user_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				booking.parking_spot_id.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
				booking.parking_spot_id.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
		setFilteredBookings(filtered)
	}

	const handleReset = () => {
		setSearchTerm('')
		setFilteredBookings(bookings)
	}

	const handleClose = () => setOpen(false)

	const confirmBooking = async bookingStatus => {
		try {
			const response = await axios.put(
				'http://localhost:5000/api/user/bookings/updateStatus',
				{
					id: selectedBooking._id,
					status: bookingStatus,
					email: selectedBooking.user_id.email,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the Authorization header
					},
				}
			)
			toast.success(response.data.message)
			fetchData()
		} catch (error) {
			isSessionExpire(error)
			console.error(error)
			toast.error(error.response.data.message)
		} finally {
			setSelectedBooking(null)
			handleClose()
		}
	}

	return (
		<>
			<NavBar />

			<Dialog open={open} keepMounted onClose={handleClose}>
				<DialogTitle color='warning.light'>{'Confirm Booking'}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Check the Transaction ID and Amount before confirming the Booking.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => confirmBooking('rejected')} color='error'>
						Reject The Booking
					</Button>
					<Button onClick={() => confirmBooking('confirmed')} color='success'>
						Confirm The Booking
					</Button>
				</DialogActions>
			</Dialog>

			<Box
				sx={{
					p: 4,
					minHeight: '90vh',
					// backgroundColor: '#f5f5f5',
				}}
			>
				{' '}
				<Typography variant='h4' gutterBottom>
					View Bookings
				</Typography>
				{/* Search and Filter Section */}
				<Grid container spacing={2} sx={{ mb: 3 }}>
					<Grid item xs={12} sm={8}>
						<TextField
							label='Search by User or Location'
							variant='outlined'
							fullWidth
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 2 }}>
						<Button
							variant='contained'
							color='primary'
							fullWidth
							onClick={handleSearch}
						>
							Search
						</Button>
						<Button
							variant='outlined'
							color='secondary'
							fullWidth
							onClick={handleReset}
						>
							Reset
						</Button>
					</Grid>
				</Grid>
				{/* Bookings Table */}
				<TableContainer component={Paper} sx={{ boxShadow: 3 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<strong>Slot Name</strong>
								</TableCell>
								<TableCell>
									<strong>User</strong>
								</TableCell>
								<TableCell>
									<strong>Location</strong>
								</TableCell>
								<TableCell>
									<strong>Date</strong>
								</TableCell>
								<TableCell>
									<strong>From</strong>
								</TableCell>
								<TableCell>
									<strong>To</strong>
								</TableCell>
								<TableCell>
									<strong>Amount</strong>
								</TableCell>
								<TableCell>
									<strong>Status</strong>
								</TableCell>
								<TableCell>
									<strong>Transaction ID</strong>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredBookings.length > 0 ? (
								filteredBookings.map(booking => (
									<TableRow key={booking._id}>
										<TableCell>{booking.parking_spot_id.name}</TableCell>
										<TableCell>
											{booking.user_id?.name || 'User Deleted'}
										</TableCell>
										<TableCell>{booking.parking_spot_id.location}</TableCell>
										<TableCell>
											{new Date(booking.booking_date).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{new Date(booking.start_time).toLocaleTimeString()}
										</TableCell>
										<TableCell>
											{new Date(booking.end_time).toLocaleTimeString()}
										</TableCell>
										<TableCell>₹{booking.total_cost}</TableCell>
										<TableCell>
											<Button
												variant={'contained'}
												disabled={
													booking.status === 'confirmed' ||
													booking.status === 'rejected'
														? true
														: false
												}
												onClick={() => {
													setSelectedBooking(booking)
													setOpen(true)
												}}
											>
												{booking.status}
											</Button>
										</TableCell>
										<TableCell>{booking.transactionId}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={9} align='center'>
										No bookings found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</>
	)
}

export default ViewBookings
