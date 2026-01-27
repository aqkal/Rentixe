'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const phone = formData.get("phone") as string;
    const accountType = formData.get("account_type") as string; // 'user' | 'owner' | 'agent'

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: `${firstName} ${lastName}`,
                phone: phone,
                role: accountType, // Store intended role in metadata
            }
        }
    });

    if (error) {
        return { error: error.message };
    }

    // If session is null, it means email confirmation is required (OTP or Link)
    if (!data.session) {
        return { success: true, email };
    }

    // Session exists (Email confirmation disabled) - create profile
    if (data.user) {
        await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: `${firstName} ${lastName}`,
            phone: phone,
            role: 'user' // Keep DB role as 'user' for now, use metadata for app logic if needed
        }, { onConflict: 'id' });
    }

    // Redirect
    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function verifyOtp(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const token = formData.get("code") as string;
    const type = 'signup';

    // Verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
    });

    if (error) {
        return { error: error.message };
    }

    // Create profile for the verified user
    if (data.user) {
        const fullName = data.user.user_metadata?.full_name || '';
        const phone = data.user.user_metadata?.phone || '';

        await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            phone: phone,
            role: 'user'
        }, { onConflict: 'id' });
    }

    // Success
    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
