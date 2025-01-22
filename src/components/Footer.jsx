import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
	return (
		<footer className='bg-background border-t'>
			<div className='px-4 md:px-6 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* About Section */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>TechNews Daily</h3>
						<p className='text-sm text-muted-foreground'>
							Your trusted source for the latest technology news, insights, and innovations.
						</p>
						<div className='flex space-x-4'>
							<Button variant='ghost' size='icon'>
								<Facebook className='h-5 w-5' />
							</Button>
							<Button variant='ghost' size='icon'>
								<Twitter className='h-5 w-5' />
							</Button>
							<Button variant='ghost' size='icon'>
								<Instagram className='h-5 w-5' />
							</Button>
							<Button variant='ghost' size='icon'>
								<Youtube className='h-5 w-5' />
							</Button>
						</div>
					</div>

					{/* Quick Links */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Quick Links</h3>
						<ul className='space-y-2'>
							<li>
								<a href='/about' className='text-sm text-muted-foreground hover:text-primary transition'>
									About Us
								</a>
							</li>
							<li>
								<a href='/contact' className='text-sm text-muted-foreground hover:text-primary transition'>
									Contact
								</a>
							</li>
							<li>
								<a href='/privacy' className='text-sm text-muted-foreground hover:text-primary transition'>
									Privacy Policy
								</a>
							</li>
							<li>
								<a href='/terms' className='text-sm text-muted-foreground hover:text-primary transition'>
									Terms of Service
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Contact Us</h3>
						<ul className='space-y-2'>
							<li className='flex items-center space-x-2 text-sm text-muted-foreground'>
								<Mail className='h-4 w-4' />
								<span>contact@technews.com</span>
							</li>
							<li className='flex items-center space-x-2 text-sm text-muted-foreground'>
								<Phone className='h-4 w-4' />
								<span>+1 (555) 123-4567</span>
							</li>
							<li className='flex items-center space-x-2 text-sm text-muted-foreground'>
								<MapPin className='h-4 w-4' />
								<span>123 Tech Street, NY 10001</span>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>Newsletter</h3>
						<p className='text-sm text-muted-foreground'>Subscribe to our newsletter for the latest updates.</p>
						<form className='space-y-2'>
							<Input type='email' placeholder='Enter your email' className='bg-background' />
							<Button className='w-full'>Subscribe</Button>
						</form>
					</div>
				</div>

				<div className='mt-16 pt-8 border-t text-center text-sm text-muted-foreground'>
					<p>&copy; {new Date().getFullYear()} TechNews Daily. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
