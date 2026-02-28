import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://agnpnlvvbmyxezhzdctn.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const scholars = [
  { name: "Emily", email: "emily@rodiddy.com", password: "sunny2024em" },
  { name: "Gimran", email: "gimran@rodiddy.com", password: "cloud9gim" },
  { name: "Jonathan", email: "jonathan@rodiddy.com", password: "breeze42jon" },
  { name: "Mason", email: "mason@rodiddy.com", password: "river7mason" },
  { name: "Tina", email: "tina@rodiddy.com", password: "spark3tina" },
  { name: "Connor", email: "connor@rodiddy.com", password: "maple8conn" },
  { name: "Vincent", email: "vincent@rodiddy.com", password: "tiger5vinc" },
  { name: "Ameya", email: "ameya@rodiddy.com", password: "storm6amey" },
  { name: "Elaine", email: "elaine@rodiddy.com", password: "coral9elai" },
  { name: "Jude", email: "jude@rodiddy.com", password: "blaze4jude" },
  { name: "Anika", email: "anika@rodiddy.com", password: "frost7anik" },
  { name: "Cooper", email: "cooper@rodiddy.com", password: "ridge3coop" },
  { name: "Claire", email: "claire@rodiddy.com", password: "dawn8clair" },
  { name: "Hunter", email: "hunter@rodiddy.com", password: "flint5hunt" },
  { name: "Jason", email: "jason@rodiddy.com", password: "grove2jase" },
  { name: "Nikita", email: "nikita@rodiddy.com", password: "pixel6niki" },
  { name: "Kevin", email: "kevin@rodiddy.com", password: "crest9kev" },
  { name: "Teo", email: "teo@rodiddy.com", password: "orbit4teo" },
  { name: "Ali", email: "ali@rodiddy.com", password: "dusk7ali22" },
  { name: "Rohan", email: "rohan@rodiddy.com", password: "swift1roha" },
];

async function createAllUsers() {
  for (const s of scholars) {
    const displayName = s.name.toLowerCase();
    const { data, error } = await supabase.auth.admin.createUser({
      email: s.email,
      password: s.password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

    if (error) {
      console.error(`FAILED ${s.email}: ${error.message}`);
    } else {
      console.log(`OK ${s.email} (${displayName})`);
    }
  }
}

createAllUsers();
