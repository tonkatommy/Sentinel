import bcrypt from 'bcryptjs';
import pool from './pool.js';

console.log('🌱 Seeding database...');

// --- Users ---
const users = [
  { name: 'Tommy Goodman',   service_number: 'T12345', role: 'officer',  password: 'password123' },
  { name: 'Sarah Mitchell',  service_number: 'T22345', role: 'officer',  password: 'password123' },
  { name: 'Jake Thompson',   service_number: 'T33456', role: 'standard', password: 'password123' },
  { name: 'Amy Clarke',      service_number: 'T44567', role: 'standard', password: 'password123' },
  { name: 'Ben Harrington',  service_number: 'T55678', role: 'standard', password: 'password123' },
];

// --- Keys (A01–A20, B01–B20) ---
const keys = [];
for (const section of ['A', 'B']) {
  for (let i = 1; i <= 20; i++) {
    const num = String(i).padStart(2, '0');
    keys.push({
      key_number: `${section}${num}`,
      label: `${section} Block Key ${num}`,
      location: `${section} Block`,
    });
  }
}

try {
  // Insert users
  const userIds = [];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, service_number, role, password_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (service_number) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [u.name, u.service_number, u.role, hash]
    );
    userIds.push(rows[0].id);
    console.log(`  ✅ User: ${u.name} (${u.service_number}) [${u.role}]`);
  }

  // Insert keys
  const keyIds = [];
  for (const k of keys) {
    const { rows } = await pool.query(
      `INSERT INTO keys (key_number, label, location)
       VALUES ($1, $2, $3)
       ON CONFLICT (key_number) DO UPDATE SET label = EXCLUDED.label
       RETURNING id`,
      [k.key_number, k.label, k.location]
    );
    keyIds.push(rows[0].id);
  }
  console.log(`  ✅ ${keys.length} keys seeded (A01–A20, B01–B20)`);

  // Seed a few issued keys with audit entries
  const officerId = userIds[0]; // Tommy
  const issuedTo = [
    { keyIdx: 0,  userId: userIds[2] }, // A01 → Jake
    { keyIdx: 3,  userId: userIds[3] }, // A04 → Amy
    { keyIdx: 10, userId: userIds[4] }, // B01 → Ben
  ];

  for (const { keyIdx, userId } of issuedTo) {
    const keyId = keyIds[keyIdx];
    await pool.query('UPDATE keys SET status = $1 WHERE id = $2', ['issued', keyId]);
    await pool.query(
      `INSERT INTO audit_log (key_id, user_id, officer_id, action, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [keyId, userId, officerId, 'issue', 'Seeded']
    );
  }
  console.log(`  ✅ 3 keys marked as issued with audit entries`);

  console.log('\n✅ Seed complete.\n');
  console.log('Login credentials:');
  console.log('  Officer:  T12345 / password123  (Tommy Goodman)');
  console.log('  Officer:  T22345 / password123  (Sarah Mitchell)');
  console.log('  Standard: T33456 / password123  (Jake Thompson)');
} catch (err) {
  console.error('❌ Seed failed:', err.message);
} finally {
  await pool.end();
}
