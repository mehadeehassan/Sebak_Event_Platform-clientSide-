/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarPlus, Handshake, LayoutList, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/upcoming-events", label: "Upcoming Events" },
];


const memberLinks = [
  { href: "/create-event", label: "Create Event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: LayoutList },
  { href: "/joined-events", label: "Joined Events", icon: Handshake },
];

function NavLink({ href, label, onClick, className }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:transition-colors",
        className
      )}
    >
      {label}
    </Link>
  );
}

/* Login button (guests) or profile picture dropdown (members). */
function AccountArea() {
  const { user, isLoggedIn, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="hidden items-center md:flex">
        <Skeleton className="size-9 rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="hidden md:block">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="group relative flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar src={user?.image || user?.photoURL} name={user?.name} className="ring-border size-9 ring-2" />
          {/* The display name shows up while hovering the profile picture. */}
          <span className="pointer-events-none absolute top-full right-0 z-50 mt-2 rounded-md border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
            {user?.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2.5 py-2">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        {memberLinks.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem asChild key={href}>
            <Link href={href}>
              <Icon />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
          onSelect={() => logout()}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);


  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 border-b backdrop-blur">
      <nav className="container-wide flex h-16 items-center justify-between gap-2">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          {!loading &&
            isLoggedIn &&
            memberLinks.map(({ href, label }) => <NavLink key={href} href={href} label={label} />)}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <AccountArea />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="border-b md:hidden">
          <div className="container-wide flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-3">
            {publicLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            {!loading &&
              isLoggedIn &&
              memberLinks.map(({ href, label }) => <NavLink key={href} href={href} label={label} />)}

            <div className="mt-2 border-t pt-3">
              {loading ? (
                <Skeleton className="h-10 w-32" />
              ) : isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-1 pb-3">
                    <Avatar src={user?.image || user?.photoURL} name={user?.name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user?.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => logout()}>
                    <LogOut />
                    Log out
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
