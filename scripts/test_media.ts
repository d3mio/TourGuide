import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : "";
const supabaseKey = keyMatch ? keyMatch[1].trim() : "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from("media").select("*");
  console.log("Error:", error);
  console.log("Data length:", data?.length);
  if (data?.length > 0) {
    console.log("First item:", data[0]);
  }
}

test();
