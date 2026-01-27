import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Users, Trophy, Target } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
                        alt="Office"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Reimagining Real Estate for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Everyone</span>
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed mb-8">
                            Rentixe is on a mission to make finding and listing homes as seamless as ordering a cab. We combine cutting-edge technology with deep market simplicity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                            <p className="text-slate-500">To democratize property access through transparent, verified, and instant connections.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Community First</h3>
                            <p className="text-slate-500">Building vibrant neighborhoods by connecting the right people with the right homes.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quality Listings</h3>
                            <p className="text-slate-500">Every listing is verified to ensure what you see is exactly what you get.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Excellence</h3>
                            <p className="text-slate-500">Setting the gold standard for digital real estate experiences in the region.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-16">Trusted by Thousands</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 mb-2">10k+</div>
                            <div className="text-slate-400">Active Listings</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-pink-500 mb-2">50+</div>
                            <div className="text-slate-400">Cities Covered</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-500 mb-2">2M+</div>
                            <div className="text-slate-400">Monthly Visitors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-emerald-500 mb-2">4.9/5</div>
                            <div className="text-slate-400">User Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center bg-indigo-900 text-white relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[200%] bg-indigo-800/20 rotate-12 blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Ready to find your place?</h2>
                    <div className="flex justify-center gap-4">
                        <Link href="/search">
                            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold">Find Properties</Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
