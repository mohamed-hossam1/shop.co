"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type UserData = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export async function SignUpSupabase({
  name,
  email,
  password,
  phone,
}: UserData ) {
  const supabase = await createClient();

  const { data: authUser, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { signUpError, addUserError: null };
  }

  const userId = authUser?.user?.id || "";

  const { error: addUserError } = await supabase
    .from("users")
    .insert({ id: userId, name, phone, email, role: "user" });

  if (addUserError) {
    DeleteUser(userId);
    return { signUpError: null, addUserError };
  }

  return { signUpError: null, addUserError: null };
}

export async function SignInSupabase({ email, password }: any) {
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { signInError };
}

export async function SignOutSupabase() {
  const supabase = await createClient();
  const { error: signOutError } = await supabase.auth.signOut();

  return { signOutError };
}

export async function DeleteUser(id: string) {
  const admin = createAdminClient();
  console.log(await admin.auth.admin.deleteUser(id));
}

export async function GetUser() {
  const subabase = await createClient();
  const response = await subabase.auth.getUser();
  if (response.data.user?.id) {
    const { data: userProfile, error } = await subabase
      .from("users")
      .select("*")
      .eq("id", response.data.user?.id)
      .single();
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return userProfile;
  }
  return null;
}

export async function UpdateUserProfile({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const supabase = await createClient();
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser.user) {
    return { error: authError || { message: "User not authenticated" } };
  }

  const userId = authUser.user.id;
  let updateErrors: any[] = [];

  const { error: userTableError } = await supabase
    .from("users")
    .update({ name, phone })
    .eq("id", userId);

  if (userTableError) {
    updateErrors.push({ source: "users_table", error: userTableError });
  }

  if (email !== authUser.user.email) {
    const { error: authUpdateError } = await supabase.auth.updateUser({
      email: email,
    });

    if (authUpdateError) {
      updateErrors.push({ source: "auth_email", error: authUpdateError });
    }
  }

  if (updateErrors.length > 0) {
    return { error: updateErrors };
  }

  return { error: null };
}

export async function UpdateUserPassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser.user) {
    return { error: authError || { message: "User not authenticated" } };
  }

  const email = authUser.user.email;

  if (!email) {
    return { error: { message: "User email not found in session." } };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email,
    password: oldPassword,
  });

  if (signInError) {
    return { error: { message: "Incorrect old password." } };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError };
  }

  await supabase.auth.signOut();

  return { error: null };
}
