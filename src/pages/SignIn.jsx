// import React, { useState } from 'react'
// import Avatar from '@mui/material/Avatar'
// import Button from '@mui/material/Button'
// import CssBaseline from '@mui/material/CssBaseline'
// import TextField from '@mui/material/TextField'
// import Link from '@mui/material/Link'
// import Box from '@mui/material/Box'
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// import Typography from '@mui/material/Typography'
// import Container from '@mui/material/Container'
// import axios from 'axios'
// import useAuthStore from '../utils/useAuthStore'
// import { toast } from 'react-toastify'
// import VisibilityIcon from '@mui/icons-material/Visibility'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
// import { IconButton, InputAdornment } from '@mui/material'
// import NavBar from '../components/NavBar'

// function SignIn() {
// 	const [emailError, setEmailError] = useState('')
// 	const [passwordError, setPasswordError] = useState('')
// 	const { setUser, setRole, setToken } = useAuthStore()
// 	const [showPassword, setShowPassword] = useState(false)

// 	const handleSubmit = async event => {
// 		event.preventDefault()
// 		const data = new FormData(event.currentTarget)
// 		const email = data.get('email')
// 		const password = data.get('password')

// 		let valid = true

// 		// Email validation
// 		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 		if (!emailRegex.test(email)) {
// 			setEmailError('Invalid email address')
// 			valid = false
// 		} else {
// 			setEmailError('')
// 		}

// 		// Password validation
// 		if (password.length < 6) {
// 			setPasswordError('Password must be at least 6 characters long')
// 			valid = false
// 		} else {
// 			setPasswordError('')
// 		}

// 		if (valid) {
// 			console.log({
// 				email,
// 				password,
// 			})
// 			try {
// 				const response = await axios.post('https://parking-management-backend-epnm.onrender.com/api/auth/login', {
// 					email,
// 					password,
// 				})
// 				setUser(response.data.data)
// 				setRole(response.data.role)
// 				setToken(response.data.token)

// 				response.data.token != null
// 					? (window.location.href = '/dashboard')
// 					: toast.error(response.data.message)
// 			} catch (error) {
// 				console.error(error.response.data)
// 				toast.error(error.response.data.message)
// 			}
// 		}
// 	}

// 	return (
// 		<>
// 			<NavBar />
// 			<Container component='main' maxWidth='xs'>
// 				<CssBaseline />
// 				<Box
// 					sx={{
// 						marginTop: 8,
// 						display: 'flex',
// 						flexDirection: 'column',
// 						alignItems: 'center',
// 					}}
// 				>
// 					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
// 						<LockOutlinedIcon />
// 					</Avatar>
// 					<Typography component='h1' variant='h5'>
// 						Sign in
// 					</Typography>
// 					<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
// 						<TextField
// 							variant='outlined'
// 							required
// 							fullWidth
// 							id='email'
// 							label='Email Address'
// 							name='email'
// 							autoComplete='email'
// 							autoFocus
// 							error={!!emailError}
// 							helperText={emailError}
// 						/>
// 						<TextField
// 							margin='normal'
// 							required
// 							fullWidth
// 							name='password'
// 							label='Password'
// 							id='password'
// 							autoComplete='current-password'
// 							error={!!passwordError}
// 							helperText={passwordError}
// 							type={showPassword ? 'text' : 'password'}
// 							slotProps={{
// 								input: {
// 									endAdornment: (
// 										<InputAdornment position='end'>
// 											<IconButton
// 												onClick={() => setShowPassword(prev => !prev)}
// 											>
// 												{showPassword ? (
// 													<VisibilityIcon />
// 												) : (
// 													<VisibilityOffIcon />
// 												)}
// 											</IconButton>
// 										</InputAdornment>
// 									),
// 								},
// 							}}
// 						/>
// 						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
// 							Sign In
// 						</Button>
// 						<Link href='/signup' variant='body2'>
// 							{"Don't have an account? Sign Up"}
// 						</Link>
// 					</Box>
// 				</Box>
// 			</Container>
// 		</>
// 	)
// }

// export default SignIn



// sign in with google updated

import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import useAuthStore from "../utils/useAuthStore";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import NavBar from "../components/NavBar";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'; // For React Router v6


const GOOGLE_CLIENT_ID = "977070351773-06bn9pmaa4apuqjdhnijiek93kqj41jq.apps.googleusercontent.com"; // Replace with actual Google Client ID

function SignIn() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { setUser, setRole, setToken } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    // 🔹 Handle Manual Form Submission (Email/Password)
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");

        let valid = true;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email address");
            valid = false;
        } else {
            setEmailError("");
        }

        // Password validation
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (valid) {
            try {
                const response = await axios.post(
                    "https://parking-management-backend-epnm.onrender.com/api/auth/login",
                    { email, password }
                );
                setUser(response.data.data);
                setRole(response.data.role);
                setToken(response.data.token);

                response.data.token
                    ? (window.location.href = "/dashboard")
                    : toast.error(response.data.message);
            } catch (error) {
                console.error(error.response.data);
                toast.error(error.response.data.message);
            }
        }
    };

    // 🔹 Handle Google Sign-In
    const navigate = useNavigate();  // Hook for navigation
    const handleGoogleSuccess = async (credentialResponse) => {


        try {
            const token = credentialResponse.credential;
            const decoded = jwtDecode(credentialResponse.credential); // Decode Google token
            console.log("Google User:", decoded);

            const response = await axios.post(
                "https://parking-management-backend-epnm.onrender.com/api/auth/google",
                { email: decoded.email, name: decoded.name, token }
            );

            setUser(response.data.data);
            setRole(response.data.role);
            setToken(response.data.token);

            response.data.token
                ? navigate("/dashboard")
                : toast.error(response.data.message);
        } catch (error) {
            console.error(error);
            toast.error("Google Sign-In failed");
        }
    };

    return (
        <>
            <NavBar />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            id="password"
                            autoComplete="current-password"
                            error={!!passwordError}
                            helperText={passwordError}
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>

                        {/* 🔹 Google Login Button */}
                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google Sign-In Failed")} />
                        </GoogleOAuthProvider>

                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default SignIn;



