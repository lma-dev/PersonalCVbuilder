// import { prisma } from "@/lib/prisma";

async function main() {
  console.log("Seeding database...");
  // TODO: Add seed data
  console.log("Seeding complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
