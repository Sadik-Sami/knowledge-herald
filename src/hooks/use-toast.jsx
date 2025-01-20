import { useState, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { createContext } from 'react';

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = 'success') => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	}, []);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
				<AnimatePresence>
					{toasts.map((toast) => (
						<motion.div
							key={toast.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, x: 100 }}
							className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium shadow-lg ${
								toast.type === 'success'
									? 'bg-green-500 text-white'
									: toast.type === 'error'
									? 'bg-red-500 text-white'
									: 'bg-yellow-500 text-white'
							}`}>
							{toast.type === 'success' && <CheckCircle className='h-5 w-5' />}
							{toast.type === 'error' && <XCircle className='h-5 w-5' />}
							{toast.type === 'warning' && <AlertCircle className='h-5 w-5' />}
							<p>{toast.message}</p>
							<button onClick={() => removeToast(toast.id)} className='ml-auto text-white/80 hover:text-white'>
								<X className='h-4 w-4' />
							</button>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
};

const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};

export { ToastProvider, useToast };
