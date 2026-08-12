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
  success: boolean;
  generatedAt: string;
  requests: {
    total: number;
    byRoute: { route: string; count: number }[];
  };
  feeds: {
    total: number;
    byCategory: { category: string; count: number }[];
    byAuthor: { author: string; count: number }[];
    latest: { id: string; title: string; publishedAt: string } | null;
  };
};
