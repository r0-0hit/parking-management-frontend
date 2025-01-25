import NavBar from '../components/NavBar'
import useAuthStore from '../utils/useAuthStore'
import ManagerDashboard from './manager/ManagerDashboard'
import UserDashboard from './user/UserDashboard'
import SearchParking from './user/SearchParking'

const Dashboard = () => {
	const { role } = useAuthStore()
	// const role = 'user'

	return (
		<>
			{role === 'manager' ? (
				<div>
					<NavBar />
					<ManagerDashboard />
				</div>
			) : (
				<SearchParking />
			)}
		</>
	)
}

export default Dashboard
