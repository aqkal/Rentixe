'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, LogOut, User, Search, PlusCircle, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SiteHeaderProps {
    user: any;
    profile?: any;
}

export default function SiteHeader({ user, profile }: SiteHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === '/';
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    };

    // Dynamic Styles
    const navClass = cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isHome && !scrolled ? "bg-transparent border-b border-white/10" : "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
    );

    const textClass = cn(
        "transition-colors",
        isHome && !scrolled ? "text-white hover:text-white/80" : "text-slate-600 hover:text-indigo-600"
    );

    const logoClass = cn(
        "font-bold text-xl flex items-center gap-2 transition-colors",
        isHome && !scrolled ? "text-white" : "text-indigo-600"
    );

    return (
        <>
            <nav className={navClass}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className={logoClass}>
                        <Home className="w-5 h-5" />
                        <span>Rentixe</span>
                    </Link>

                    {/* Center Actions - Desktop */}
                    <div className="hidden md:flex items-center justify-center gap-4 flex-1">
                        <Link href="/dashboard/create">
                            <Button
                                size="sm"
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-6 h-9 font-semibold shadow-md transition-all press-effect",
                                    isHome && !scrolled
                                        ? "bg-white text-indigo-900 border border-white/50 hover:bg-indigo-50"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                )}
                            >
                                <PlusCircle className="w-4 h-4" /> List Property
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button
                                size="sm"
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-6 h-9 font-semibold shadow-md transition-all press-effect",
                                    isHome && !scrolled
                                        ? "bg-white/20 text-white border border-white/30 backdrop-blur-md hover:bg-white/30"
                                        : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <Search className="w-4 h-4" /> Buy Property
                            </Button>
                        </Link>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-6 text-sm font-medium">
                            <Link href="/about" className={cn(textClass, "hover:opacity-80 transition-opacity")}>
                                About
                            </Link>
                            <Link href="/contact" className={cn(textClass, "hover:opacity-80 transition-opacity")}>
                                Contact
                            </Link>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-2">
                                {profile?.role === 'admin' && (
                                    <Link href="/dashboard/admin">
                                        <Button variant="ghost" size="sm" className="gap-2 font-bold text-amber-500 hover:text-amber-600">
                                            Admin
                                        </Button>
                                    </Link>
                                )}

                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className={cn(textClass, "gap-2")}>
                                        <User className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleSignOut} className={cn(textClass)}>
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button
                                    size="sm"
                                    className={cn(
                                        "font-medium press-effect",
                                        isHome && !scrolled ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : "bg-slate-900 text-white hover:bg-slate-800"
                                    )}
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={cn("md:hidden p-2 rounded-lg transition-colors", textClass)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
                    mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Slide Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <span className="font-bold text-lg text-slate-900">Menu</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <Link href="/search" className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                            <Search className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">Find Property</span>
                        </Link>
                        <Link href="/dashboard/create" className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                            <PlusCircle className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">List Property</span>
                        </Link>

                        <div className="border-t border-slate-100 my-4" />

                        <Link href="/about" className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                            <span className="font-medium">About</span>
                        </Link>
                        <Link href="/contact" className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                            <span className="font-medium">Contact</span>
                        </Link>

                        {user && (
                            <>
                                <div className="border-t border-slate-100 my-4" />
                                <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                                    <User className="w-5 h-5 text-slate-400" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                {profile?.role === 'admin' && (
                                    <Link href="/dashboard/admin" className="flex items-center gap-3 p-3 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors">
                                        <span className="font-medium">Admin Panel</span>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100">
                        {user ? (
                            <Button onClick={handleSignOut} variant="outline" className="w-full gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Button>
                        ) : (
                            <Link href="/login" className="block">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Login or Sign up
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
