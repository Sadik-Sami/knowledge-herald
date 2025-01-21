import axios from 'axios';

const axiosPublicInstance = axios.create({
	baseURL: 'http://localhost:5000',
});
const useAxiosPublic = () => {
	return axiosPublicInstance;
};

export default useAxiosPublic;