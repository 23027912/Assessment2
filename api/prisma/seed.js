// Seeds the database with demo RSS feed entries AND simulated request
// traffic (RequestLog rows), so the Assessment 3 dashboard has meaningful
// data to show — feed status mix, requests per feed, requests per client,
// unique client counts — without needing to click around manually first.
//
// Run with: npm run seed  (after prisma migrate)

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString =
  process.env.DATABASE_URL || "postgresql://rss_user:rss_password@localhost:5432/rss_db";
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
    status: "ACTIVE",
    daysAgo: 1,
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
    status: "ACTIVE",
    daysAgo: 2,
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
    status: "ACTIVE",
    daysAgo: 3,
  },
  {
    title: "Load Testing 101: Simulating Real Traffic",
    author: "R. Singh",
    content:
      "An introduction to tools like JMeter for staging traffic at increasing scale, from a handful of users to tens of thousands.",
    summary: "How to structure staged load tests for a web API.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    link: "https://example.edu/news/load-testing",
    category: "DevOps",
    status: "ACTIVE",
    daysAgo: 4,
  },
  {
    title: "Accessibility Audits with Lighthouse",
    author: "M. Chen",
    content:
      "Lighthouse scores pages on performance, accessibility, best practices and SEO — this walks through fixing common accessibility flags.",
    summary: "Using Lighthouse to catch accessibility issues early.",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
    link: "https://example.edu/news/lighthouse-a11y",
    category: "Accessibility",
    status: "ACTIVE",
    daysAgo: 5,
  },
  {
    title: "End-to-End Testing with Playwright",
    author: "J. Alvarez",
    content:
      "Playwright lets you script real browser interactions and API calls together, useful for testing both client and server use cases.",
    summary: "A practical intro to Playwright for full-stack testing.",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    link: "https://example.edu/news/playwright-e2e",
    category: "Testing",
    status: "ACTIVE",
    daysAgo: 6,
  },
  {
    title: "Deprecated: Legacy RSS Import Tool",
    author: "Automated Import",
    content:
      "This entry represents an older feed source that has stopped updating and is flagged as stale for the dashboard's status summary.",
    summary: "An intentionally stale feed for demo purposes.",
    imageUrl: null,
    link: "https://example.edu/news/legacy-import",
    category: "Archive",
    status: "STALE",
    daysAgo: 40,
  },
  {
    title: "Broken Upstream Source: Weather Widget Feed",
    author: "Automated Import",
    content:
      "This entry simulates a feed source that failed to parse correctly, giving the dashboard a real ERROR-status row to display.",
    summary: "An intentionally errored feed for demo purposes.",
    imageUrl: null,
    link: "https://example.invalid/broken-feed",
    category: "Archive",
    status: "ERROR",
    daysAgo: 12,
  },
];

const simulatedClients = [
  "client-alpha",
  "client-bravo",
  "client-charlie",
  "client-delta",
  "client-echo",
];

function daysAgoDate(days, hourOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hourOffset);
  return d;
}

async function main() {
  const createdFeeds = [];
  for (const { daysAgo, ...feed } of demoFeeds) {
    const created = await prisma.feed.create({
      data: { ...feed, publishedAt: daysAgoDate(daysAgo) },
    });
    createdFeeds.push(created);
  }
  console.log(`Seeded ${createdFeeds.length} feed entries.`);

  // Simulated request traffic: each fake client hits a random mix of
  // routes/feeds a random number of times over the last week, so
  // requests-per-feed, requests-per-client and unique-client-count all
  // have realistic-looking data on first run.
  const routes = ["/api/feeds", "/api/feeds/:id", "/api/health", "/api/count"];
  const logs = [];

  for (const clientId of simulatedClients) {
    const requestCount = 15 + Math.floor(Math.random() * 40); // 15-54 requests per client
    for (let i = 0; i < requestCount; i++) {
      const route = routes[Math.floor(Math.random() * routes.length)];
      const method = route === "/api/feeds" && Math.random() < 0.15 ? "POST" : "GET";
      const feed =
        route === "/api/feeds/:id"
          ? createdFeeds[Math.floor(Math.random() * createdFeeds.length)]
          : null;

      logs.push({
        route,
        method,
        clientId,
        feedId: feed ? feed.id : null,
        createdAt: daysAgoDate(Math.floor(Math.random() * 7), Math.floor(Math.random() * 24)),
      });
    }
  }

  await prisma.requestLog.createMany({ data: logs });
  console.log(
    `Seeded ${logs.length} simulated request log rows across ${simulatedClients.length} clients.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
