import { createClient } from "@/lib/supabase/server";
import { User } from "@/types/User";

export async function getCurrentUserProfile(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as User;
}

export function isAdminRole(role?: string | null) {
  return role === "admin";
}

export async function requireAdmin(): Promise<User> {
  const profile = await getCurrentUserProfile();

  if (!profile || !isAdminRole(profile.role)) {
    throw new Error("Unauthorized");
  }

  return profile;
}
