import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import useAuthStore from '../utils/useAuthStore'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { Collapse, Stack, TextField } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { toast } from 'react-toastify'
import axios from 'axios'
import isSessionExpire from '../utils/session'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
// import Svg from '../utils/Svg'

function NavBar() {
	const [anchorElNav, setAnchorElNav] = React.useState(null)
	const [anchorElUser, setAnchorElUser] = React.useState(null)
	const [open, setOpen] = React.useState(false)
	const [openDelete, setOpenDelete] = React.useState(false)
	const { user, logout, token, role, isDarkMode, setIsDarkMode } = useAuthStore()
	const [expanded, setExpanded] = React.useState(false)
	const [deleteUserName, setDeleteUserName] = React.useState('')

	const handleExpandClick = () => {
		setExpanded(!expanded)
	}

	const handleOpenNavMenu = event => {
		setAnchorElNav(event.currentTarget)
	}
	const handleOpenUserMenu = event => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	const handelMenuLogout = () => {
		handleCloseUserMenu()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleDeleteClose = () => {
		setOpenDelete(false)
		setDeleteUserName('')
	}

	const handleDialogLogout = () => {
		logout()
		setOpen(false)
		window.location.href = '/signin'
	}

	const handelDeleteDialog = () => {
		setExpanded(false)
		handleCloseUserMenu()
		setOpenDelete(true)
	}

	const handelAccountDelete = async () => {
		if (user.name !== deleteUserName) {
			toast.error('Enter correct UserName')
			handleDeleteClose()
			return
		}

		if (role === 'manager') {
			try {
				const fetchSpots = await axios.get(
					'http://localhost:5000/api/manager/parking-spots/my-spots',
					{
						headers: {
							Authorization: `Bearer ${token}`, // Add the Authorization header
						},
					}
				)

				if (fetchSpots?.data?.length > 0) {
					handleDeleteClose()
					toast.error('You have Parking Spots!! \n Cannot Delete Account')
					return
				}
			} catch (error) {
				isSessionExpire(error)

				try {
					const response = await axios.delete(
						'http://localhost:5000/api/managers/delete',
						{
							data: {
								id: user._id,
							},
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)
					toast.success(response.data.message)
					handleDeleteClose()
					logout()
					setTimeout(() => {
						window.location.href = '/signup'
					}, 1000)
				} catch (error) {
					isSessionExpire(error)
					console.error(error)
					toast.error(error.response?.data?.message)
				}
			}
		} else {
			try {
				const fetchResponse = await axios.get(
					'http://localhost:5000/api/user/bookings/my-bookings',
					{
						headers: {
							Authorization: `Bearer ${token}`, // Add the Authorization header
						},
					}
				)
				const allBookings = fetchResponse.data

				// Separate bookings into upcoming and past
				const currentDate = new Date()

				const upcoming = allBookings.filter(
					booking => new Date(booking.booking_date) > currentDate
				)
				if (upcoming.length > 0) {
					handleDeleteClose()
					toast.error('You have upcomming bookings!! \n Cannot Delete Account')
					return
				}

				const response = await axios.delete('http://localhost:5000/api/users/delete', {
					data: {
						id: user._id,
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				toast.success(response.data.message)
				handleDeleteClose()
				setTimeout(() => {
					window.location.href = '/signup'
				}, 1000)
			} catch (error) {
				isSessionExpire(error)
				console.error(error)
				toast.error(error.response?.data?.message)
			}
		}
	}

	return (
		<AppBar position='static'>
			<Dialog
				open={open}
				keepMounted
				onClose={handleClose}
				aria-describedby='alert-dialog-slide-description'
				color='error'
			>
				<DialogTitle color='error.dark'>{'Confirm Logout'}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-slide-description'>
						Are you sure you want to log out? Any unsaved changes will be lost.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleDialogLogout} color='error'>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openDelete}
				keepMounted
				onClose={handleDeleteClose}
				aria-describedby='alert-dialog-slide-description'
				color='error'
			>
				<DialogTitle color={'error.dark'}>
					{'Do you want to Delete your Account?!'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-slide-description'>
						Once your account is deleted all your data will be lost and cannot be
						re-covered.
					</DialogContentText>
					<Stack marginTop={2} component={'form'}>
						<Typography variant='body2'>
							{'Plese enter your username to delete your account:'}
						</Typography>
						<TextField
							autoFocus
							required
							variant={'outlined'}
							id='delete-username-input'
							color={'error'}
							size={'small'}
							sx={{ marginTop: '8px' }}
							value={deleteUserName}
							onChange={e => setDeleteUserName(e.target.value)}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteClose}>Cancel</Button>
					<Button onClick={handelAccountDelete} color='error'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					{/* <Svg sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, ml: 4 }} /> */}
					{/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, ml: 4 }} /> */}
					<Typography
						variant='h6'
						noWrap
						component='a'
						//href='/dashboard'
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
							ml: 6,
						}}
					>
						PARKNOW
					</Typography>

					{!(
						window.location.pathname === '/signup' ||
						window.location.pathname === '/signin'
					) &&
						role === 'user' && (
							<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
								<IconButton
									size='large'
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleOpenNavMenu}
									color='inherit'
								>
									<MenuIcon />
								</IconButton>
								<Menu
									id='menu-appbar'
									anchorEl={anchorElNav}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
									sx={{ display: { xs: 'block', md: 'none' } }}
								>
									{/* {pages.map(page => (
								<MenuItem key={page} onClick={handleCloseNavMenu}>
									<Typography sx={{ textAlign: 'center' }}>{page}</Typography>
								</MenuItem>
							))} */}

									<MenuItem onClick={handleCloseNavMenu}>
										<Typography
											sx={{ textAlign: 'center' }}
											onClick={() =>
												(window.location.href = '/searchParking')
											}
										>
											Search Spot
										</Typography>
									</MenuItem>
									<MenuItem onClick={handleCloseNavMenu}>
										<Typography
											sx={{ textAlign: 'center' }}
											onClick={() =>
												(window.location.href = '/viewUserBookings')
											}
										>
											View Bookings
										</Typography>
									</MenuItem>
								</Menu>
							</Box>
						)}
					{/* <Svg /> */}
					{/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
					<Typography
						variant='h5'
						noWrap
						component='a'
						//href='/dashboard'
						sx={{
							mx: 4,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
							ml: 6,
						}}
					>
						PARKNOW
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{!(
							window.location.pathname === '/signup' ||
							window.location.pathname === '/signin'
						) &&
							role === 'user' && (
								<>
									<Button
										href='/searchParking'
										onClick={handleCloseNavMenu}
										sx={{ my: 2, color: 'white', display: 'block' }}
									>
										Search Spot
									</Button>
									<Button
										href='/viewUserBookings'
										onClick={handleCloseNavMenu}
										sx={{ my: 2, color: 'white', display: 'block' }}
									>
										View Bookings
									</Button>
								</>
							)}
					</Box>
					<Box sx={{ flexGrow: 0 }}>
						<IconButton
							onClick={() => setIsDarkMode(!isDarkMode)}
							title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
						>
							{isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
						</IconButton>
						{!(
							window.location.pathname === '/signup' ||
							window.location.pathname === '/signin'
						) && (
							<>
								<Tooltip title='Open settings'>
									<IconButton onClick={handleOpenUserMenu} sx={{ px: 4 }}>
										<AccountCircleOutlinedIcon fontSize='large' />
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id='menu-appbar'
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									<MenuItem
										sx={{
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Stack
											sx={{
												justifyContent: 'center',
												alignItems: 'center',
												px: '50px',
											}}
											// divider={<Divider flexItem />}
											spacing={1}
										>
											<AccountCircleOutlinedIcon
												// fontSize={'large'}
												sx={{ width: 65, height: 65 }}
											/>
											{/* <Avatar
										src={<AccountCircleOutlinedIcon />}
										sx={{ width: 65, height: 65 }}
									/> */}
											<Stack>
												<Typography
													sx={{ textAlign: 'center' }}
													variant='h6'
												>
													{user?.name || 'Username'}
												</Typography>
												<Typography
													sx={{ textAlign: 'center' }}
													variant='body1'
												>
													{user?.email || 'user@email.com'}
												</Typography>
											</Stack>
										</Stack>
									</MenuItem>
									{role !== 'user' && (
										<MenuItem
											onClick={() => (window.location.href = '/dashboard')}
										>
											<Typography sx={{ textAlign: 'center' }}>
												Dashboard
											</Typography>
										</MenuItem>
									)}
									<MenuItem onClick={handelMenuLogout}>
										<Stack direction={'row'} spacing={1}>
											<Typography sx={{ textAlign: 'center' }}>
												Logout
											</Typography>
											<LogoutOutlinedIcon fontSize='small' />
										</Stack>
									</MenuItem>
									<MenuItem
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
										onClick={handleExpandClick}
									>
										<Typography>More</Typography>
										{expanded ? <ExpandLess /> : <ExpandMore />}
									</MenuItem>
									<Collapse in={expanded} timeout='auto' unmountOnExit>
										<MenuItem onClick={handelDeleteDialog}>
											<Typography
												sx={{ pl: 4 }}
												color='error'
												variant='body2'
											>
												Delete Account
											</Typography>
										</MenuItem>
									</Collapse>
								</Menu>
							</>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default NavBar
