export type Feed = {
  id: string;
  title: string;
  author: string;
  content: string;
  summary?: string | null;
  imageUrl?: string | null;
  link?: string | null;
  category?: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type FeedInput = {
  title: string;
  author: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  link?: string;
  category?: string;
};

export type HealthStatus = {
  status: "ok" | "error";
  database: "connected" | "disconnected";
  latencyMs?: number;
  uptimeSeconds?: number;
  timestamp: string;
};

export type CountStats = {
  totalRequests: number;
  totalFeeds: number;
  byRoute: { route: string; count: number }[];
};
