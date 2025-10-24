'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Computer } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'About', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Writing', href: '/writing' },
  { name: 'Contact', href: '/contact' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Computer className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-accent-600" />
              <span className="font-heading text-xl font-bold">
                {siteConfig.name.split(' ')[0]}
              </span>
            </Link>
            <div className="hidden md:flex md:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary-600',
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t bg-background md:hidden">
            <div className="container py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-base font-medium transition-colors hover:text-primary-600',
                      pathname === item.href
                        ? 'text-primary-600'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary-600 to-accent-600" />
              <span className="font-heading text-lg font-semibold">
                {siteConfig.name}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href={siteConfig.links.github}
                className="text-sm text-muted-foreground hover:text-primary-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              <Link
                href={siteConfig.links.linkedin}
                className="text-sm text-muted-foreground hover:text-primary-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Link>
              <Link
                href={siteConfig.links.email}
                className="text-sm text-muted-foreground hover:text-primary-600"
              >
                Email
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
