import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from './use-AuthContext';

const axiosSecureInstance = axios.create({
	// baseURL: 'https://herald-server.vercel.app',
	baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
	const { logOut } = useAuth();
	const navigate = useNavigate();
	axiosSecureInstance.interceptors.request.use(
		function (config) {
			const token = localStorage.getItem('access-token');
			if (token) {
				config.headers.authorization = `Bearer ${token}`;
			}
			return config;
		},
		function (error) {
			return Promise.reject(error);
		}
	);

	axiosSecureInstance.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			const status = error.response.status;
			if (status === 401 || status === 403) {
				logOut();
				navigate('/login');
			}
			return Promise.reject(error);
		}
	);
	return axiosSecureInstance;
};

export default useAxiosSecure;
