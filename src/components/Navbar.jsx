import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/use-AuthContext';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user, signOut } = useAuth();
	const location = useLocation();

	const navItems = [
		{ title: 'Home', href: '/' },
		{ title: 'Add Articles', href: '/add-article', protected: true },
		{ title: 'All Articles', href: '/articles' },
		{ title: 'Subscription', href: '/subscription', protected: true },
		{ title: 'My Articles', href: '/my-articles', protected: true },
		{ title: 'Premium Articles', href: '/premium', protected: true, requiresSub: false }, // requires sub to true when sub is available
		{ title: 'Dashboard', href: '/dashboard', protected: true, adminOnly: false }, //change adminOnly to true when admin checking is immplemented
	];

	const filteredItems = navItems.filter((item) => {
		if (item.adminOnly && !user?.isAdmin) return false;
		if (item.requiresSub && !user?.hasSubscription) return false;
		if (item.protected && !user) return false;
		return true;
	});

	return (
		<header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-14 items-center px-4 md:px-6'>
				<div className='flex w-full items-center justify-between md:justify-start md:gap-6'>
					<Link to='/' className='flex items-center gap-2'>
						<span className='text-xl font-bold'>TechNews</span>
					</Link>

					<Button variant='ghost' size='icon' className='md:hidden' onClick={() => setIsOpen(true)}>
						<Menu className='h-5 w-5' />
						<span className='sr-only'>Toggle menu</span>
					</Button>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
						<div className='flex items-center space-x-1'>
							{filteredItems.map((item) => {
								const isActive = location.pathname === item.href;
								return (
									<NavLink
										key={item.href}
										to={item.href}
										className={cn(
											'relative px-3 py-2 text-sm transition-colors hover:text-foreground',
											isActive ? 'text-foreground' : 'text-muted-foreground'
										)}>
										{item.title}
										{isActive && (
											<motion.div
												className='absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary'
												layoutId='navbar-indicator'
											/>
										)}
									</NavLink>
								);
							})}
						</div>

						<div className='flex items-center gap-2'>
							<ThemeToggle />
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' size='icon' className='relative h-8 w-8'>
											{user.photoURL ? (
												<img
													src={user.photoURL || '/placeholder.svg'}
													alt={user.displayName}
													className='h-8 w-8 rounded-full object-cover'
												/>
											) : (
												<User className='h-5 w-5' />
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end' className='w-56'>
										<div className='flex items-center justify-start gap-2 p-2'>
											<div className='flex flex-col space-y-1 leading-none'>
												{user.displayName && <p className='font-medium'>{user.displayName}</p>}
												<p className='text-sm text-muted-foreground'>{user.email}</p>
											</div>
										</div>
										<DropdownMenuItem asChild>
											<Link to='/profile'>Profile</Link>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className='flex items-center gap-2'>
									<Button variant='ghost' asChild>
										<Link to='/login'>Login</Link>
									</Button>
									<Button asChild>
										<Link to='/register'>Register</Link>
									</Button>
								</div>
							)}
						</div>
					</nav>
				</div>
			</div>

			{/* Mobile Navigation */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 bg-background'>
						<div className='flex h-14 items-center justify-between px-4 border-b'>
							<Link to='/' className='flex items-center gap-2' onClick={() => setIsOpen(false)}>
								<span className='text-xl font-bold'>TechNews</span>
							</Link>
							<Button variant='ghost' size='icon' onClick={() => setIsOpen(false)}>
								<X className='h-5 w-5' />
								<span className='sr-only'>Close menu</span>
							</Button>
						</div>
						<nav className='p-4'>
							<div className='grid gap-2 bg-background/95 backdrop-blur-3xl: rounded-md'>
								{filteredItems.map((item) => {
									const isActive = location.pathname === item.href;
									return (
										<NavLink
											key={item.href}
											to={item.href}
											onClick={() => setIsOpen(false)}
											className={cn(
												'flex items-center rounded-md px-4 py-3 text-sm transition-colors',
												isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
											)}>
											{item.title}
										</NavLink>
									);
								})}
								{!user && (
									<div className='mt-4 grid gap-2'>
										<Button variant='outline' asChild className='w-full'>
											<Link to='/login' onClick={() => setIsOpen(false)}>
												Login
											</Link>
										</Button>
										<Button asChild className='w-full'>
											<Link to='/register' onClick={() => setIsOpen(false)}>
												Register
											</Link>
										</Button>
									</div>
								)}
							</div>
							<div className='mt-6 flex items-center justify-between'>
								<ThemeToggle className={'bg-secondary'} />
								{user && (
									<Button variant='outline' onClick={signOut}>
										Log out
									</Button>
								)}
							</div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Navbar;
