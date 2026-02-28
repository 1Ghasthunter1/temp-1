import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://agnpnlvvbmyxezhzdctn.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function addNewUser(
  email: string,
  password: string,
  displayName: string
) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  if (error) {
    console.error("Failed to create user:", error.message);
    process.exit(1);
  }

  console.log("User created successfully:");
  console.log("  ID:", data.user.id);
  console.log("  Email:", data.user.email);
  console.log("  Display Name:", displayName);
}

const [email, displayName, password] = process.argv.slice(2);

if (!email || !displayName || !password) {
  console.error(
    "Usage: pnpm tsx add_new_user.ts <email> <display_name> <password>"
  );
  process.exit(1);
}

addNewUser(email, password, displayName);
