import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';

export function ThemeToggle({ className }) {
	const { theme, resolvedTheme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className={className}>
					<Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')} className='flex items-center gap-2'>
					<Sun className='h-4 w-4' />
					<span>Light</span>
					{theme === 'light' && <span className='ml-auto'>✓</span>}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')} className='flex items-center gap-2'>
					<Moon className='h-4 w-4' />
					<span>Dark</span>
					{theme === 'dark' && <span className='ml-auto'>✓</span>}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')} className='flex items-center gap-2'>
					<span className='h-4 w-4 flex items-center justify-center text-xs'>💻</span>
					<span>System</span>
					{theme === 'system' && <span className='ml-auto'>✓</span>}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
