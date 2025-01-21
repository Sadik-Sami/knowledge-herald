import { useState } from 'react';
import useAxiosPublic from './use-AxiosPublic';

const useImageUpload = () => {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(null);
	const axiosPublic = useAxiosPublic();
	console.log(import.meta.env.VITE_IMGBB_API_KEY);
	const uploadImage = async (file) => {
		setUploading(true);
		setError(null);
		console.log('inside image upload');
		try {
			const formData = new FormData();
			formData.append('image', file);
			console.log('image object', formData);
			const response = await axiosPublic.post(
				`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
				formData
			);
			console.log(response);
			return response.data.data.url;
		} catch (err) {
			setError('Failed to upload image');
			throw new Error('Failed to upload image');
		} finally {
			setUploading(false);
		}
	};
	return { uploadImage, uploading, error };
};

export default useImageUpload;
