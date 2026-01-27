'use client';

import { useState, useActionState, useEffect } from 'react';
import Link from "next/link";
import { login, signup, verifyOtp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Loader2, AlertCircle, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatus } from 'react-dom';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" disabled={pending}>
            {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {label}
        </Button>
    )
}

export default function AuthPage() {
    // Modes: 'login' | 'signup' | 'verify'
    const [mode, setMode] = useState<'login' | 'signup' | 'verify'>('login');
    const [emailToVerify, setEmailToVerify] = useState('');

    const [loginState, loginAction] = useActionState(login, null);
    const [signupState, signupAction] = useActionState(signup, null);
    const [verifyState, verifyAction] = useActionState(verifyOtp, null);

    // Watch for signup success to switch to verify mode
    useEffect(() => {
        if (signupState?.success && signupState.email) {
            setEmailToVerify(signupState.email);
            setMode('verify');
        }
    }, [signupState]);

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-30"
                        alt="Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
                        <Home className="w-6 h-6" />
                        <span>Rentixe</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-4">
                        {mode === 'login' && 'Welcome back to your premium journey.'}
                        {mode === 'signup' && 'Join the future of real estate.'}
                        {mode === 'verify' && 'Verify your account.'}
                    </h2>
                    <p className="text-slate-300 text-lg">
                        {mode === 'login' && 'Access your dashboard, manage listings, and find your dream home.'}
                        {mode === 'signup' && 'Create an account to list properties, save favorites, and connect with agents.'}
                        {mode === 'verify' && 'We have sent a verification code to your email. Please enter it to continue.'}
                    </p>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Rentixe Inc.
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 transition-all duration-300">

                    {/* Tabs (Only show if not in verify mode) */}
                    {mode !== 'verify' && (
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-8">
                            <button
                                onClick={() => setMode('login')}
                                className={cn(
                                    "py-2.5 text-sm font-semibold rounded-lg transition-all",
                                    mode === 'login' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={cn(
                                    "py-2.5 text-sm font-semibold rounded-lg transition-all",
                                    mode === 'signup' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Create Account
                            </button>
                        </div>
                    )}

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-900">
                            {mode === 'login' && 'Welcome Back'}
                            {mode === 'signup' && 'Get Started'}
                            {mode === 'verify' && 'Verify Email'}
                        </h1>
                        <p className="text-slate-500 mt-2">
                            {mode === 'login' && 'Enter your credentials to continue'}
                            {mode === 'signup' && 'Create your free account now'}
                            {mode === 'verify' && `Code sent to ${emailToVerify}`}
                        </p>
                    </div>

                    {mode === 'login' && (
                        /* Login Form */
                        <form className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300" action={loginAction}>
                            {loginState?.error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {loginState.error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" required className="h-12 bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                                </div>
                                <Input id="password" name="password" type="password" required className="h-12 bg-slate-50 border-slate-200" />
                            </div>

                            <SubmitButton label="Sign In" />
                        </form>
                    )}

                    {mode === 'signup' && (
                        /* Signup Form */
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" action={signupAction}>
                            {signupState?.error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {signupState.error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input id="first_name" name="first_name" placeholder="John" required className="h-12 bg-slate-50 border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input id="last_name" name="last_name" placeholder="Doe" required className="h-12 bg-slate-50 border-slate-200" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" placeholder="+91 98765 43210" required className="h-12 bg-slate-50 border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a</Label>
                                    <select
                                        name="account_type"
                                        className="flex h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="user">Tenant / Buyer</option>
                                        <option value="owner">Landlord / Owner</option>
                                        <option value="agent">Real Estate Agent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" required className="h-12 bg-slate-50 border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required className="h-12 bg-slate-50 border-slate-200" />
                            </div>

                            <SubmitButton label="Create Account" />
                        </form>
                    )}

                    {mode === 'verify' && (
                        /* Verify Form */
                        <form className="space-y-6 animate-in zoom-in-50 duration-300" action={verifyAction}>
                            <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl flex items-start gap-3">
                                <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold">Check your email</p>
                                    <p>We've sent a 6-digit confirmation code code to <strong>{emailToVerify}</strong>.</p>
                                </div>
                            </div>

                            {verifyState?.error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {verifyState.error}
                                </div>
                            )}

                            <input type="hidden" name="email" value={emailToVerify} />

                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    type="text"
                                    placeholder="123456"
                                    required
                                    className="h-14 text-center text-2xl tracking-widest bg-slate-50 border-slate-200 font-mono"
                                    maxLength={6}
                                />
                            </div>

                            <SubmitButton label="Verify & Login" />

                            <div className="text-center">
                                <button type="button" onClick={() => setMode('signup')} className="text-sm text-slate-500 hover:text-indigo-600">
                                    Wrong email? Go back
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
