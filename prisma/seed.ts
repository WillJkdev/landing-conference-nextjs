import { seedAdmin } from "./seeds/seed-admin";
import { seedApiKeys } from "./seeds/seed-api-keys";

async function main() {
  await seedAdmin();
  await seedApiKeys();
}

main()
  .then(() => {
    console.log("✅ Todos los seeds ejecutados correctamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error ejecutando seeds:", err);
    process.exit(1);
  });
