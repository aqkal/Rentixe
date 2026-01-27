import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
export async function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!serviceRoleKey) {
        console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to ANON_KEY. Some admin features (like fetching owner details) may not work due to RLS.");
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey || anonKey,
        {
            cookies: {
                getAll() { return [] },
                setAll() { }
            }
        }
    );
}
