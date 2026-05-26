'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AppLogo } from './app-logo';
import { AuthButton } from './auth-button';

const menuItems = [
    { href: '/', label: 'New Project' },
    { href: '/builds', label: 'My Builds' },
    { href: '/settings', label: 'Settings' },
];

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors hover:text-primary',
              pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {item.label}
          </Link>
        ))}
        <AuthButton />
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center">
        <AuthButton />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Main Menu</SheetTitle>
            <div className="flex items-center gap-2 mb-8">
                <AppLogo className="size-6 text-primary" />
                <span className="font-semibold text-lg text-primary-foreground">Site2Fire</span>
            </div>
            <nav className="grid gap-4 text-lg font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'transition-colors hover:text-primary py-2',
                     pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
