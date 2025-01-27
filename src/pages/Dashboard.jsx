// import NavBar from '../components/NavBar'
// import useAuthStore from '../utils/useAuthStore'
// import ManagerDashboard from './manager/ManagerDashboard'
// import UserDashboard from './user/UserDashboard'
// import SearchParking from './user/SearchParking'

// const Dashboard = () => {
// 	const { role } = useAuthStore()
// 	// const role = 'user'

// 	return (
// 		<>
// 			{role === 'manager' ? (
// 				<div>
// 					<NavBar />
// 					<ManagerDashboard />
// 				</div>
// 			) : (
// 				<SearchParking />
// 			)}
// 		</>
// 	)
// }

// export default Dashboard



import NavBar from '../components/NavBar'
import useAuthStore from '../utils/useAuthStore'
import ManagerDashboard from './manager/ManagerDashboard'
import SearchParking from './user/SearchParking'
import AdminDashboard from './AdminDashboard' // Import the AdminDashboard component

const Dashboard = () => {
	const { role } = useAuthStore() // Get the role from the auth store

	return (
		<>
				
			 {/* Common NavBar for all roles */}
			{role === 'admin' ? (
				<>
				<NavBar />
				<AdminDashboard /> 
				</>// Show AdminDashboard for admin role
			) : role === 'manager' ? (
				<>
				<NavBar />
				<ManagerDashboard />
				</> // Show ManagerDashboard for manager role
			) : (
				<SearchParking /> // Show SearchParking for user or other roles
			)}
		</>
	)
}

export default Dashboard

