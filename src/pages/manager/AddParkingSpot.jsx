import React, { useState } from 'react'
import { Box, TextField, Button, Typography, MenuItem, Alert } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import useAuthStore from '../../utils/useAuthStore'
import NavBar from '../../components/NavBar'
import isSessionExpire from '../../utils/session'

const AddParkingSpot = () => {
	const [formData, setFormData] = useState({
		location: '',
		hourlyRate: '',
		slotName: '',
	})
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)
	const { token } = useAuthStore()

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const { location, hourlyRate, slotName } = formData

		if (!location || !hourlyRate || !slotName) {
			setError('All fields are required')
			setSuccess(false)
			toast.error('All fields are required')
			return
		}

		try {
			const response = await axios.post(
				'http://localhost:5000/api/manager/parking-spots',
				{
					name: slotName,
					location,
					hourly_rate: hourlyRate,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the Authorization header
					},
				}
			)
			setError('')
			setSuccess(true)
			console.log(response.data)
			toast.success(response.data.message)
		} catch (error) {
			isSessionExpire(error)
			console.error(error.response.data.message)
			toast.error(error.response.data.message)
		}

		// Clear form after submission
		setFormData({
			location: '',
			hourlyRate: '',
			slotName: '',
		})
	}

	return (
		<>
			<NavBar />

			<Box
				sx={{
					maxWidth: 500,
					mx: 'auto',
					mt: 8,
					p: 4,
					borderRadius: 2,
					boxShadow: 3,
				}}
			>
				<Typography variant='h5' component='h1' gutterBottom>
					Add Parking Spot
				</Typography>

				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				{success && (
					<Alert severity='success' sx={{ mb: 2 }}>
						Parking spot added successfully!
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<TextField
						label='Slot Name'
						name='slotName'
						value={formData.slotName}
						onChange={handleChange}
						fullWidth
						variant='outlined'
						autoComplete='slotName'
						sx={{ mb: 3 }}
					/>
					<TextField
						label='Location'
						name='location'
						value={formData.location}
						onChange={handleChange}
						fullWidth
						variant='outlined'
						sx={{ mb: 3 }}
					/>
					<TextField
						label='Hourly Rate'
						name='hourlyRate'
						type='number'
						value={formData.hourlyRate}
						onChange={handleChange}
						fullWidth
						variant='outlined'
						sx={{ mb: 3 }}
					/>
					{/* <TextField
					select
					label='Availability'
					name='availability'
					value={formData.availability}
					onChange={handleChange}
					fullWidth
					variant='outlined'
					sx={{ mb: 3 }}
				>
					<MenuItem value='24/7'>24/7</MenuItem>
					<MenuItem value='Daytime'>Daytime</MenuItem>
					<MenuItem value='Nighttime'>Nighttime</MenuItem>
				</TextField> */}
					<Button type='submit' variant='contained' color='primary' fullWidth>
						Add Parking Spot
					</Button>
				</form>
			</Box>
		</>
	)
}

export default AddParkingSpot
