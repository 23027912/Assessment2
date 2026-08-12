// TODO: keep these in sync with components/Footer.tsx before submission.
const STUDENT_NAME = "[Your Full Name]";
const STUDENT_NUMBER = "[Your Student Number]";

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
            TODO: replace this placeholder with your actual walkthrough video before
            submission — e.g. an <iframe> embed (YouTube/unlisted) or a <video> tag
            pointing at a file in /public. Example:

            <video controls className="w-full rounded-sm border border-border">
              <source src="/walkthrough.mp4" type="video/mp4" />
            </video>
          */}
          <div className="aspect-video w-full border border-dashed border-border rounded-sm flex items-center justify-center text-center px-6">
            <p className="font-mono text-xs text-muted">
              Embed your 3–8 minute walkthrough video here
              <br />
              (showing your student ID, face and voice, per the brief).
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
