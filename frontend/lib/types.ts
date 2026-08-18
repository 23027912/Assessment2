export type FeedStatus = "ACTIVE" | "ERROR" | "STALE";

export type Feed = {
  id: string;
  title: string;
  author: string;
  content: string;
  summary?: string | null;
  imageUrl?: string | null;
  link?: string | null;
  category?: string | null;
  status: FeedStatus;
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
  status?: FeedStatus;
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
    byFeed: { feedId: string; title: string; count: number }[];
    byClient: { clientId: string; count: number }[];
  };
  clients: {
    unique: number;
  };
  feeds: {
    total: number;
    byStatus: Record<FeedStatus, number>;
    byCategory: { category: string; count: number }[];
    byAuthor: { author: string; count: number }[];
    latest: { id: string; title: string; publishedAt: string } | null;
  };
};