import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import axios from 'axios'
import { toast } from 'react-toastify'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { IconButton, InputAdornment } from '@mui/material'
import useAuthStore from '../utils/useAuthStore'
import NavBar from '../components/NavBar'

function SignUp() {
	const [nameError, setNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [confirmPasswordError, setConfirmPasswordError] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = async event => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		const name = data.get('name')
		const email = data.get('email')
		const password = data.get('password')
		const confirmPassword = data.get('confirmPassword')

		let valid = true

		// Name validation
		if (!name) {
			setNameError('Name is required')
			valid = false
		} else {
			setNameError('')
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailError('Invalid email address')
			valid = false
		} else {
			setEmailError('')
		}

		// Password validation
		if (password.length < 6) {
			setPasswordError('Password must be at least 6 characters long')
			valid = false
		} else {
			setPasswordError('')
		}

		// Confirm password validation
		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match')
			valid = false
		} else {
			setConfirmPasswordError('')
		}

		if (valid) {
			try {
				const response = await axios.post('http://localhost:5000/api/users/register', {
					name,
					email,
					password,
				})
				toast.success(response.data.message)
				setTimeout(() => (window.location.href = '/signin'), 5000)
			} catch (error) {
				console.error(error)
			}
		}
	}

	return (
		<>
			<NavBar />
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>

					<Typography component='h1' variant='h5'>
						Sign up
					</Typography>
					<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin='normal'
							required
							fullWidth
							id='name'
							label='Name'
							name='name'
							autoComplete='name'
							autoFocus
							error={!!nameError}
							helperText={nameError}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							error={!!emailError}
							helperText={emailError}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							id='password'
							autoComplete='current-password'
							error={!!passwordError}
							helperText={passwordError}
							type={showPassword ? 'text' : 'password'}
							slotProps={{
								input: {
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												onClick={() => setShowPassword(prev => !prev)}
											>
												{showPassword ? (
													<VisibilityIcon />
												) : (
													<VisibilityOffIcon />
												)}
											</IconButton>
										</InputAdornment>
									),
								},
							}}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='confirmPassword'
							label='Confirm Password'
							type='password'
							id='confirmPassword'
							autoComplete='new-password'
							error={!!confirmPasswordError}
							helperText={confirmPasswordError}
						/>
						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
							Sign Up
						</Button>
						<Link href='/signin' variant='body2'>
							{'Already have an account? Sign in'}
						</Link>
					</Box>
				</Box>
			</Container>
		</>
	)
}

export default SignUp
