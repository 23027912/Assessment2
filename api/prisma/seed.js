// Seeds the database with a handful of demo RSS feed entries.
// Run with: npm run seed  (after prisma migrate)

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require('@prisma/client');

// Set up the exact adapter required by Prisma 7
const connectionString = process.env.DATABASE_URL || "postgresql://rss_user:rss_password@localhost:5432/rss_db";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const demoFeeds = [
  {
    title: "La Trobe Launches New Cloud Computing Lab",
    author: "J. Alvarez",
    content:
      "The university has opened a new lab dedicated to teaching students how to deploy full-stack applications using Docker and Kubernetes.",
    summary: "New cloud lab focuses on container deployment skills.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    link: "https://example.edu/news/cloud-lab",
    category: "Technology",
  },
  {
    title: "Understanding ORMs: Prisma vs Sequelize",
    author: "M. Chen",
    content:
      "A breakdown of the two most popular Node.js ORMs, covering schema definition, migrations, and query ergonomics.",
    summary: "Comparing Prisma and Sequelize for backend data modelling.",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    link: "https://example.edu/news/orm-comparison",
    category: "Development",
  },
  {
    title: "Why Health Checks Matter in Production",
    author: "R. Singh",
    content:
      "Health check and monitoring endpoints let orchestration tools like Docker and Kubernetes know when a service is ready and alive.",
    summary: "A short guide to /health endpoints and why they matter.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    link: "https://example.edu/news/health-checks",
    category: "DevOps",
  },
];

async function main() {
  for (const feed of demoFeeds) {
    await prisma.feed.create({ data: feed });
  }
  console.log(`Seeded ${demoFeeds.length} feed entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Clean up the connection pool safely
  });
