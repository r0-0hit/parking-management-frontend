import { toast } from 'react-toastify'

export default function isSessionExpire(response) {
	if (
		response.response.data.message === 'Access Denied' ||
		response.response.data.message === 'Invalid Token'
	) {
		toast.error('Your session has expired!!\nPlease login again')
	}
}
