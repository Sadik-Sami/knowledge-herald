import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Loader2 } from 'lucide-react';
import useImageUpload from '@/hooks/use-image-upload';
import { useToast } from '@/hooks/use-toast';
import useAxiosSecure from '@/hooks/use-AxiosSecure';

const AddPublisher = () => {
	const [preview, setPreview] = useState(null);
	const logoRef = useRef(null); // Ref for file input
	const { uploadImage, uploading } = useImageUpload();
	const { addToast } = useToast();
	const axiosSecure = useAxiosSecure();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	const handleImageChange = () => {
		const file = logoRef.current.files[0];
		if (file) {
			if (file.size > 2000000) {
				addToast('Image size should be less than 2MB', 'error');
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (data) => {
		try {
			const file = logoRef.current.files[0];
			let logoUrl = null;

			if (file) {
				logoUrl = await uploadImage(file);
			}

			const response = await axiosSecure.post('/publishers', {
				name: data.name,
				logo: logoUrl,
			});

			if (response.data.success) {
				addToast('Publisher added successfully', 'success');
				reset();
				setPreview(null);
				if (logoRef.current) logoRef.current.value = ''; // Reset file input
			}
		} catch (error) {
			addToast(error.response?.data?.message || 'Failed to add publisher', 'error');
		}
	};

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Add Publisher</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='space-y-2'>
							<label
								htmlFor='logo'
								className='block aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer'>
								{preview ? (
									<img src={preview || '/placeholder.svg'} alt='Preview' className='w-full h-full object-contain' />
								) : (
									<div className='h-full flex flex-col items-center justify-center gap-2 text-muted-foreground'>
										<ImagePlus className='h-8 w-8' />
										<span>Click to upload logo</span>
									</div>
								)}
								<input
									type='file'
									id='logo'
									accept='image/*'
									className='hidden'
									ref={logoRef} // Using the ref for the file input
									onChange={handleImageChange} // Handle image preview
								/>
							</label>
							{errors.logo && <p className='text-sm text-destructive'>{errors.logo.message}</p>}
						</div>

						<div className='space-y-2'>
							<Input placeholder='Publisher Name' {...register('name', { required: 'Publisher name is required' })} />
							{errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
						</div>

						<Button type='submit' className='w-full' disabled={isSubmitting || uploading}>
							{isSubmitting || uploading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Adding Publisher...
								</>
							) : (
								'Add Publisher'
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default AddPublisher;
