import React, { useEffect, useState } from 'react'
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
	Button,
	Modal,
	TextField,
	Grid,
	Stack,
	Rating,
} from '@mui/material'
import useAuthStore from '../../utils/useAuthStore'
import axios from 'axios'
import { toast } from 'react-toastify'
import NavBar from '../../components/NavBar'
import isSessionExpire from '../../utils/session'

const ViewEditParkingSpots = () => {
	const { token } = useAuthStore()

	const fetchData = async () => {
		try {
			const response = await axios.get(
				'https://parking-management-backend-epnm.onrender.com/api/manager/parking-spots/my-spots',
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the Authorization header
					},
				}
			)
			setParkingSpots([...response.data])
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
			toast.error('You have no Parking Spots.')
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// Sample parking spot data
	const [parkingSpots, setParkingSpots] = useState([])

	const [selectedSpot, setSelectedSpot] = useState(null) // Spot to edit
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleEditClick = spot => {
		setSelectedSpot(spot)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedSpot(null)
	}

	const handleChange = e => {
		const { name, value } = e.target
		setSelectedSpot(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSave = async () => {
		// Update the parking spot in the state
		setParkingSpots(prevSpots =>
			prevSpots.map(spot => (spot._id === selectedSpot._id ? selectedSpot : spot))
		)

		try {
			const response = await axios.put(
				'https://parking-management-backend-epnm.onrender.com/api/manager/bookings',
				{
					...selectedSpot,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the Authorization header
					},
				}
			)
			toast.success(response.data.message)
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
			toast.error(error.response.data.message)
		}

		// Close the modal
		handleCloseModal()
	}

	const handleRemoveClick = async spot => {
		try {
			const allBookings = await axios.get('https://parking-management-backend-epnm.onrender.com/api/manager/bookings', {
				headers: {
					Authorization: `Bearer ${token}`, // Add the Authorization header
				},
			})

			const selectedSlotBookings = allBookings.data.filter(
				booking => booking.parking_spot_id._id === spot._id
			)

			if (selectedSlotBookings.length > 0) {
				toast.error('Cannot delete Parking Spot while it is Booked!!')
				return
			}
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
		}
		setParkingSpots(prevSpots => prevSpots.filter(prevSpot => prevSpot._id !== spot._id))
		try {
			const response = await axios.delete('https://parking-management-backend-epnm.onrender.com/api/manager/bookings', {
				data: { _id: spot._id },
				headers: {
					Authorization: `Bearer ${token}`, // Add the Authorization header
				},
			})
			toast.success(response.data.message)
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
			toast.error(error.response.data.message)
		}
	}

	return (
		<>
			<NavBar />

			<Box
				sx={{
					p: 4,
					minHeight: '90vh',
					// backgroundColor: '#f5f5f5',
				}}
			>
				<Typography variant='h4' gutterBottom>
					Manage Parking Spots
				</Typography>

				<TableContainer component={Paper} sx={{ boxShadow: 3 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<strong>Slot Name</strong>
								</TableCell>
								<TableCell>
									<strong>Location</strong>
								</TableCell>
								<TableCell>
									<strong>Hourly Rate</strong>
								</TableCell>
								<TableCell>
									<strong>Rating</strong>
								</TableCell>
								<TableCell>
									<strong>Number of Ratings</strong>
								</TableCell>
								<TableCell>{/* <strong>Actions</strong> */}</TableCell>
							</TableRow>
						</TableHead>
						{parkingSpots.length === 0 ? (
							<TableBody>
								<TableRow>
									<TableCell align='center' colSpan={6}>
										<Typography
											variant='h5'
											color='text.secondary'
											textAlign={'center'}
											my={2}
											width={'100%'}
										>
											You have no Parking Spots.
										</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						) : (
							<TableBody>
								{parkingSpots.map(spot => (
									<TableRow key={spot._id}>
										<TableCell>{spot.name}</TableCell>
										<TableCell>{spot.location}</TableCell>
										<TableCell>₹{spot.hourly_rate}</TableCell>
										<TableCell>
											<Rating
												defaultValue={spot.rating}
												precision={0.5}
												readOnly
											/>
										</TableCell>
										<TableCell>{spot.num_ratings}</TableCell>
										<TableCell>
											<Stack spacing={2} direction={'row'}>
												<Button
													variant='contained'
													color='primary'
													size='small'
													onClick={() => handleEditClick(spot)}
												>
													Edit
													{/* <EditNoteIcon /> */}
												</Button>
												<Button
													variant='contained'
													color='error'
													size='small'
													onClick={() => handleRemoveClick(spot)}
												>
													Remove
													{/* <EditNoteIcon /> */}
												</Button>
											</Stack>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						)}
					</Table>
				</TableContainer>

				{/* Edit Modal */}
				<Modal open={isModalOpen} onClose={handleCloseModal}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 400,
							p: 4,
							bgcolor: 'background.paper',
							boxShadow: 24,
							borderRadius: 2,
						}}
					>
						<Typography variant='h6' gutterBottom>
							Edit Parking Spot
						</Typography>
						{selectedSpot && (
							<form>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											label='Slot Name'
											name='name'
											value={selectedSpot.name}
											onChange={handleChange}
											fullWidth
											variant='outlined'
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label='Location'
											name='location'
											value={selectedSpot.location}
											onChange={handleChange}
											fullWidth
											variant='outlined'
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label='Hourly Rate'
											name='hourly_rate'
											type='number'
											value={selectedSpot.hourly_rate}
											onChange={handleChange}
											fullWidth
											variant='outlined'
										/>
									</Grid>
								</Grid>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'flex-end',
										mt: 3,
									}}
								>
									<Button
										variant='contained'
										color='primary'
										onClick={handleSave}
										sx={{ mr: 1 }}
									>
										Save
									</Button>
									<Button
										variant='outlined'
										color='secondary'
										onClick={handleCloseModal}
									>
										Cancel
									</Button>
								</Box>
							</form>
						)}
					</Box>
				</Modal>
			</Box>
		</>
	)
}

export default ViewEditParkingSpots
