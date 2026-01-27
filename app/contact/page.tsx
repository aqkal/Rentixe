import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
            {/* Header */}
            <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-900/20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">Have questions about buying, selling, or renting? We're here to help.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 -mt-8 relative z-20">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    {/* Contact Info Sidebar */}
                    <div className="bg-indigo-600 text-white p-10 md:w-2/5 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <p className="text-indigo-100 mb-8">Fill up the form and our team will get back to you within 24 hours.</p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-indigo-200" />
                                    <div>
                                        <h3 className="font-semibold">Our Office</h3>
                                        <p className="text-indigo-100 mt-1 text-sm">123 Business Bay, Tower A<br />Dubai, UAE</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-indigo-200" />
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <p className="text-indigo-100 mt-1 text-sm">+971 4 123 4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-indigo-200" />
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-indigo-100 mt-1 text-sm">support@rentixe.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            {/* Socials placeholder */}
                            <div className="w-8 h-8 rounded-full bg-indigo-500/50 hover:bg-indigo-500 transition-colors cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-indigo-500/50 hover:bg-indigo-500 transition-colors cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-indigo-500/50 hover:bg-indigo-500 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-10 md:w-3/5 bg-white">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">First Name</label>
                                    <Input placeholder="John" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                                    <Input placeholder="Doe" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <Input type="email" placeholder="john@example.com" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Message</label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-colors focus:bg-white"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-lg font-medium shadow-lg shadow-indigo-200">
                                Send Message <Send className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
