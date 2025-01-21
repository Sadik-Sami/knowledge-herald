import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut as firebaseSignOut,
	updateProfile,
} from 'firebase/auth';
import auth from '../firebase/firebase.init';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const googleProvider = new GoogleAuthProvider();

	// ? Creating user
	const signUp = async (email, password) => {
		setLoading(true);
		try {
			const result = await createUserWithEmailAndPassword(auth, email, password);
			return result;
		} catch (error) {
			console.log('Error creating user:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// ? Update an user
	const updateUserProfile = async (name, photo) => {
		setLoading(true);
		try {
			if (!auth.currentUser) throw new Error('No user logged in');
			await updateProfile(auth.currentUser, {
				displayName: name,
				photoURL: photo,
			});
			setUser((prev) => ({
				...prev,
				displayName: name,
				photoURL: photo,
			}));
		} catch (error) {
			console.log('Error updating profile:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// ? Sign In
	const signIn = async (email, password) => {
		setLoading(true);
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			return result;
		} catch (error) {
			console.log('Error signin in:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// ? Google SignIn
	const googleLogin = async () => {
		setLoading(true);
		try {
			const result = await signInWithPopup(auth, googleProvider);
			return result;
		} catch (error) {
			console.log('Error signing in with Google:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// ?logout
	const signOut = async () => {
		setLoading(true);
		try {
			await firebaseSignOut(auth);
		} catch (error) {
			console.log('Error logging out:', error);
		} finally {
			setLoading(false);
		}
	};

	// ? Auth Watcher
	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setLoading(true);
			try {
				if (currentUser?.email) {
					const user = { email: currentUser.email };
					console.log('User ready to recieve token:', user);
					// const { data } = await axiosPublic.post('/auth/login', user);
					// if (!data.success) {
					// return console.log('Failed to get authorized');
					// }
					// localStorage.setItem('access-token', data.uToken);
					setUser(currentUser);
				} else {
					localStorage.removeItem('access-token');
					setUser(null);
				}
			} catch (error) {
				console.error('Error during auth state change:', error);
			} finally {
				setLoading(false);
			}
		});

		return () => unSubscribe();
	}, []);

	const authInfo = {
		user,
		loading,
		signUp,
		updateUserProfile,
		signIn,
		signOut,
		googleLogin,
	};
	return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
