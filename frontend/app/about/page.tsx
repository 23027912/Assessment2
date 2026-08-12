const STUDENT_NAME = "Sunita Yadav";
const STUDENT_NUMBER = "23027912";

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div>
          <p className="font-mono text-xs text-signal tracking-[0.3em]">ABOUT</p>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
            What this project is
          </h1>
        </div>

        <section className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
          <p>
            This is an RSS Server and Client built for the LMS integration project. It gives
            students and staff a single place to publish and browse feed-style content —
            announcements, blog-style posts, and updates — with the aim of eventually piping
            that content into a Learning Management System.
          </p>
          <p>
            The <strong className="text-ink">frontend</strong> (this interface) covers navigation,
            theming, responsive layout and usability: a home page, this about page, the feeds
            view, and a settings panel, all built with reusable React components.
          </p>
          <p>
            The <strong className="text-ink">backend</strong> layer adds a database schema for
            feed entries (Prisma + PostgreSQL), a CRUD API, health and request-count monitoring
            endpoints, and a Docker setup so the whole application runs reproducibly in a
            container. Together they form the RSS Server that the RSS Client on the Feeds page
            talks to.
          </p>
          <p>
            Later stages of the project will extend this into dashboard views, simulated input
            records, rule-based interpretation, alerts and reporting, and eventually a full
            analytical operational prototype connected to the LMS.
          </p>
        </section>

        <section className="border border-border bg-surface rounded-sm p-5">
          <p className="font-mono text-[11px] text-signal tracking-widest mb-3">
            SUBMITTED BY
          </p>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted">Name</dt>
            <dd>{STUDENT_NAME}</dd>
            <dt className="text-muted">Student number</dt>
            <dd>{STUDENT_NUMBER}</dd>
          </dl>
        </section>

        <section>
          <p className="font-mono text-[11px] text-signal tracking-widest mb-3">
            WALKTHROUGH VIDEO
          </p>
          {/*
            Served from public/Sunita_Yadav_23027912.mp4 — Next.js serves
            everything in /public from the site root, so that file becomes
            the URL /Sunita_Yadav_23027912.mp4 automatically. The browser
            renders its native video player inside the iframe.

            NOTE: assumed .mp4 below. If your file has a different extension
            (.mov, .webm, etc.), update the src to match.
          */}
          <div className="aspect-video w-full rounded-sm border border-border overflow-hidden bg-surface">
            <iframe
              className="w-full h-full"
              src="/Sunita_Yadav_23027912.mp4"
              title="Project walkthrough video"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </main>
  );
}
