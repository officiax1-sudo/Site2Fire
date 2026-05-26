import { AppLogo } from '@/components/app-logo';
import { MainNav } from '@/components/main-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex h-16 items-center justify-between border-b border-primary bg-background/95 px-4 md:px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <AppLogo className="size-6 text-primary" />
            <span className="font-semibold text-lg text-primary-foreground">Site2Fire</span>
        </div>
        <MainNav />
      </header>
      <main>{children}</main>
    </div>
  );
}
