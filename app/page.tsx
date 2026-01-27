import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import HomepageSearch from "@/components/homepage-search";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-20 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop"
            alt="Modern Luxury Home"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Perfect Sanctuary
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto font-light drop-shadow-md">
              Seamlessly rent or buy premium properties in the most vibrant neighborhoods.
            </p>
          </div>

          {/* Glassmorphism Search Bar */}
          <HomepageSearch />

          <div className="pt-8 flex justify-center gap-8 text-white/80 font-medium text-sm tracking-wide uppercase">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Verified Listings</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-400" /> Direct Contact</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> No Hidden Fees</span>
          </div>
        </div>
      </section>

      {/* Featured Areas (Bento-lite style) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Trending Areas</h2>
              <p className="text-slate-500 mt-2">Explore the most sought-after neighborhoods</p>
            </div>
            <Link href="/search" className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[500px]">
            <Link href="/search?q=Mumbai" className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="South Mumbai" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">South Mumbai</h3>
                <p className="text-white/80 ml-1">The heart of the city</p>
              </div>
            </Link>
            <Link href="/search?q=Bandra" className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
              <img src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bandra West" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Bandra West</h3>
              </div>
            </Link>
            <Link href="/search?q=Worli" className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
              <img src="https://images.unsplash.com/photo-1567157577867-05ccb782306d?q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Worli Sea Face" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Worli Sea Face</h3>
                <p className="text-white/80 text-sm">Coastal luxury</p>
              </div>
            </Link>
            <Link href="/search?q=BKC" className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="BKC" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">BKC (Bandra)</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Landlord CTA (Redesigned) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-950 -z-20" />
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
                <Building2 className="w-4 h-4" /> For Property Owners
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Monetize your property with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">zero hassle.</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Join thousands of landlords who trust Rentixe to find verified tenants.
                We handle the listings, the robust verification, and the connections.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-3xl font-bold text-white mb-2">30%</h4>
                  <p className="text-slate-400 text-sm">Faster Leases</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white mb-2">0%</h4>
                  <p className="text-slate-400 text-sm">Hidden Fees</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/dashboard/create">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-indigo-950 hover:bg-slate-100 font-bold text-lg">
                    List Your Property
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-2 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800" className="rounded-2xl w-full" alt="Dashboard Preview" />
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce duration-[3000ms]">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">New Tenant</p>
                  <p className="font-bold text-slate-900">+ ₹ 1,20,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
