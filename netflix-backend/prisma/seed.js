const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "testuser@example.com",
      password: "hashedpassword", // Use bcrypt in production
      role: "user",
      videos: {
        create: [
          { title: "Test Video", description: "Sample video", url: "https://your.supabase.link/video.mp4" }
        ]
      }
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
