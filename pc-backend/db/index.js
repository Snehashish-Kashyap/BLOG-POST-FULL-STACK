import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

// ✅ Pool for blog database
export const poolBlog = new Pool({
  user: "snehashishkashyap",
  host: "localhost",
  database: "pc_blog",
  password: "",
  port: 5432,
});

// ✅ Pool for user authentication (same DB for simplicity)
export const poolAuth = new Pool({
  user: "snehashishkashyap",
  host: "localhost",
  database: "pc_blog",
  password: "",
  port: 5432,
});

// ✅ Test connections
(async () => {
  try {
    const res1 = await poolBlog.query("SELECT NOW()");
    console.log("✅ Connected to pc_blog at:", res1.rows[0].now);

    const res2 = await poolAuth.query("SELECT NOW()");
    console.log("✅ Connected to user_auth (same DB) at:", res2.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();
