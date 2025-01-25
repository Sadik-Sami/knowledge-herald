import axios from 'axios';

const axiosPublicInstance = axios.create({
	baseURL: 'https://herald-server.vercel.app',
});
const useAxiosPublic = () => {
	return axiosPublicInstance;
};

export default useAxiosPublic;
