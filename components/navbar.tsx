import { createClient } from "@/lib/supabase/server";
import SiteHeader from "./site-header";

export default async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = data;
    }

    return <SiteHeader user={user} profile={profile} />;
}
