import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, FileText, Building2, Menu, X, ChevronRight, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import useAuth from '@/hooks/use-AuthContext';

const AdminLayout = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const { user } = useAuth();
	const location = useLocation();

	const navItems = [
		{
			title: 'Dashboard',
			icon: LayoutDashboard,
			href: '/dashboard',
		},
		{
			title: 'All Users',
			icon: Users,
			href: '/dashboard/users',
		},
		{
			title: 'All Articles',
			icon: FileText,
			href: '/dashboard/articles',
		},
		{
			title: 'Add Publisher',
			icon: Building2,
			href: '/dashboard/add-publisher',
		},
	];

	return (
		<div className='min-h-screen bg-background md:flex gap-6'>
			{/* Top Navigation for Mobile */}
			<header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden'>
				<div className='container flex h-14 items-center'>
					<Button variant='ghost' size='icon' className='mr-2' onClick={() => setIsMobileOpen(true)}>
						<Menu className='h-5 w-5' />
						<span className='sr-only'>Toggle menu</span>
					</Button>
					<div className='flex-1'>
						<h1 className='text-lg font-semibold'>Dashboard</h1>
					</div>
					<ThemeToggle />
				</div>
			</header>

			{/* Sidebar */}
			<motion.aside
				initial={false}
				animate={{
					width: isCollapsed ? 80 : 280,
					transition: { duration: 0.3 },
				}}
				className={cn(
					'fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r shadow-sm',
					'md:static md:transition-all md:duration-300',
					isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				)}>
				{/* Sidebar Header */}
				<div className='flex h-14 items-center justify-between border-b px-4'>
					<Link
						to='/dashboard'
						className={cn(
							'flex items-center gap-2 font-semibold transition-all duration-300',
							isCollapsed && 'md:opacity-0 md:invisible'
						)}>
						<LayoutDashboard className='h-5 w-5' />
						<span>TechNews Admin</span>
					</Link>
					<div className='flex items-center gap-2'>
						<Button variant='ghost' size='icon' className='md:hidden' onClick={() => setIsMobileOpen(false)}>
							<X className='h-5 w-5' />
							<span className='sr-only'>Close sidebar</span>
						</Button>
						<Button variant='ghost' size='icon' className='hidden md:flex' onClick={() => setIsCollapsed(!isCollapsed)}>
							{isCollapsed ? <ChevronRight className='h-5 w-5' /> : <ChevronLeft className='h-5 w-5' />}
						</Button>
					</div>
				</div>

				{/* Navigation Links */}
				<nav className='flex-1 space-y-1 p-2'>
					{navItems.map((item) => {
						const isActive = location.pathname === item.href;
						return (
							<NavLink
								key={item.href}
								to={item.href}
								className={cn(
									'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative group',
									'hover:bg-accent hover:text-accent-foreground',
									isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
									isCollapsed && 'md:justify-center md:px-2'
								)}>
								<item.icon
									className={cn(
										'h-5 w-5 shrink-0',
										isActive ? 'text-inherit' : 'text-muted-foreground group-hover:text-inherit'
									)}
								/>
								<span
									className={cn(
										'absolute left-12 bg-popover text-popover-foreground px-2 py-1 rounded invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all',
										isCollapsed ? 'md:inline-block' : 'md:hidden'
									)}>
									{item.title}
								</span>
								<span className={cn('transition-opacity duration-300', isCollapsed && 'md:hidden md:opacity-0')}>
									{item.title}
								</span>
							</NavLink>
						);
					})}
				</nav>

				{/* Sidebar Footer */}
				<div className='border-t p-4'>
					<div
						className={cn('flex items-center gap-3 transition-all duration-300', isCollapsed && 'md:justify-center')}>
						<img
							src={user?.photoURL || '/placeholder.svg'}
							alt={user?.displayName || 'User'}
							className='h-8 w-8 rounded-full object-cover'
						/>
						<div className={cn('flex flex-col transition-all duration-300', isCollapsed && 'md:hidden md:opacity-0')}>
							<span className='text-sm font-medium'>{user?.displayName || 'Admin User'}</span>
							<span className='text-xs text-muted-foreground'>{user?.email}</span>
						</div>
						<ThemeToggle className='hidden md:flex ml-auto' />
					</div>
				</div>
			</motion.aside>

			{/* Main Content */}
			<main className={cn('min-h-screen transition-all duration-300 flex-[0.9] mx-auto')}>
				<div className='max-w-7xl mx-auto py-6 px-4'>
					<Outlet />
				</div>
			</main>
			{/* <main>
				<Outlet />
			</main> */}
			{/* Mobile Overlay */}
			<AnimatePresence>
				{isMobileOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-40 bg-black/80 md:hidden'
						onClick={() => setIsMobileOpen(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default AdminLayout;
