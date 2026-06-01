/**
 * seed-demo.js
 * Seeds demo accounts into the database for testing/demo purposes.
 *
 * Accounts created:
 *   Admin    → admin@dataexchange.gov.et    / Admin@1234
 *   Consumer → consumer@dataexchange.gov.et / Consumer@1234
 *   Provider → provider@dataexchange.gov.et / Provider@1234
 *
 * Usage:
 *   cd Backend
 *   node seed-demo.js
 */

require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DB_HOST || process.env.HOST || "localhost",
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD || process.env.PASSWORD,
  database: process.env.DB_NAME || process.env.DATABASE,
});

const DEMO_ACCOUNTS = [
  {
    email: "admin@dataexchange.gov.et",
    password: "Admin@1234",
    role: "admin",
    institution: null,
  },
  {
    email: "consumer@dataexchange.gov.et",
    password: "Consumer@1234",
    role: "consumer",
    institution: {
      name: "Demo Consumer Institution",
      type: "consumer",
      contact_person: "Demo Consumer",
      phone: "+251911000001",
      address: "Addis Ababa, Ethiopia",
      username: "demo_consumer",
      services: JSON.stringify(["Data Request", "Analytics"]),
      status: "Active",
    },
  },
  {
    email: "provider@dataexchange.gov.et",
    password: "Provider@1234",
    role: "provider",
    institution: {
      name: "Demo Provider Institution",
      type: "provider",
      contact_person: "Demo Provider",
      phone: "+251911000002",
      address: "Addis Ababa, Ethiopia",
      username: "demo_provider",
      services: JSON.stringify(["Data Supply", "Verification"]),
      status: "Active",
    },
  },
];

async function seed() {
  console.log("🌱 Starting demo seed...\n");

  for (const account of DEMO_ACCOUNTS) {
    const hash = bcrypt.hashSync(account.password, 8);

    // Check if user already exists
    const [existing] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [account.email]);

    if (existing.length > 0) {
      console.log(`⚠️  Skipping ${account.email} — already exists`);
      continue;
    }

    let institution_id = null;

    // Create institution if needed (consumer / provider)
    if (account.institution) {
      const inst = account.institution;

      // Check if institution already exists
      const [existingInst] = await db
        .promise()
        .query("SELECT id FROM institutions WHERE name = ?", [inst.name]);

      if (existingInst.length > 0) {
        institution_id = existingInst[0].id;
        console.log(`ℹ️  Institution "${inst.name}" already exists — reusing id ${institution_id}`);
      } else {
        const [instResult] = await db.promise().query(
          `INSERT INTO institutions
             (name, type, contact_person, phone, address, username, services, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            inst.name,
            inst.type,
            inst.contact_person,
            inst.phone,
            inst.address,
            inst.username,
            inst.services,
            inst.status,
          ]
        );
        institution_id = instResult.insertId;
        console.log(`🏛️  Created institution "${inst.name}" (id: ${institution_id})`);
      }
    }

    // Insert user
    await db.promise().query(
      `INSERT INTO users (email, password_hash, role, institution_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [account.email, hash, account.role, institution_id]
    );

    console.log(`✅  Created ${account.role}: ${account.email} / ${account.password}`);
  }

  console.log("\n🎉 Demo seed complete!\n");
  console.log("┌─────────────────────────────────────────────────────────────┐");
  console.log("│  DEMO ACCOUNTS                                              │");
  console.log("├──────────┬──────────────────────────────────┬───────────────┤");
  console.log("│  Role    │  Email                           │  Password     │");
  console.log("├──────────┼──────────────────────────────────┼───────────────┤");
  console.log("│  Admin   │  admin@dataexchange.gov.et       │  Admin@1234   │");
  console.log("│  Consumer│  consumer@dataexchange.gov.et    │  Consumer@1234│");
  console.log("│  Provider│  provider@dataexchange.gov.et    │  Provider@1234│");
  console.log("└──────────┴──────────────────────────────────┴───────────────┘");

  db.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  db.end();
  process.exit(1);
});
