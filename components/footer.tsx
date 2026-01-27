import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Home } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white mb-4">
                            <span>Rentixe</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            The smartest way to find your next home. Thousands of listings, verified agents, and seamless connections.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Marketplace</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/search?purpose=rent" className="hover:text-indigo-400">Rent a Home</Link></li>
                            <li><Link href="/search?purpose=sale" className="hover:text-indigo-400">Buy a Home</Link></li>
                            <li><Link href="/dashboard/create" className="hover:text-indigo-400">List Your Property</Link></li>
                            <li><Link href="/search?type=commercial" className="hover:text-indigo-400">Commercial Spaces</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-indigo-400">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-400">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-indigo-400">Careers</Link></li>
                            <li><Link href="/privacy" className="hover:text-indigo-400">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} Rentixe. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
