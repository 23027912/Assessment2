import Link from "next/link";

// Home — landing page with a brief project intro and links to the other pages,
// per the Assessment 1 page requirements.
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="max-w-5xl mx-auto w-full px-6 pt-14 pb-10">
        <p className="font-mono text-xs text-signal tracking-[0.3em]">RSS SERVER // RSS CLIENT</p>
        <h1 className="font-sans text-4xl sm:text-6xl font-bold mt-3 tracking-tight leading-[1.05]">
          A wire feed
          <br />
          for your LMS.
        </h1>
        <p className="text-muted mt-5 max-w-xl leading-relaxed">
          This project builds an RSS Server and Client that sources, stores and displays
          feed-style content — course announcements, blog posts, updates — so it can be piped
          into a Learning Management System. This stage delivers the full frontend and the
          backend API, database and Docker layer behind it.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/feeds"
            className="font-mono text-xs tracking-widest px-5 py-3 border border-signal text-signal rounded-sm hover:bg-signal hover:text-bg transition-colors"
          >
            VIEW THE FEED →
          </Link>
          <Link
            href="/about"
            className="font-mono text-xs tracking-widest px-5 py-3 border border-border text-muted rounded-sm hover:text-ink hover:border-ink transition-colors"
          >
            ABOUT THIS PROJECT
          </Link>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto w-full px-6 py-12 grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Source",
              body: "Feed entries — title, author, dates, images and links — are created through the RSS Server's CRUD API and persisted with Prisma.",
            },
            {
              step: "02",
              title: "Display",
              body: "The RSS Client fetches live entries and renders them as scannable cards, with search, edit and delete built in.",
            },
            {
              step: "03",
              title: "Organise",
              body: "Operational endpoints (/health, /count) and Docker packaging keep the server observable and reproducible for LMS integration.",
            },
          ].map((item) => (
            <div key={item.step} className="border border-border bg-surface rounded-sm p-5">
              <p className="font-mono text-[11px] text-signal tracking-widest">{item.step}</p>
              <h3 className="font-semibold text-lg mt-2">{item.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
