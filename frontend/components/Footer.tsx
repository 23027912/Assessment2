// TODO: replace the placeholders below with your real name and student number
// before submission — the rubric requires both in the footer.
const STUDENT_NAME = "Sunita Yadav";
const STUDENT_NUMBER = "23027912";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted text-center sm:text-left">
          {STUDENT_NAME} · Student No. {STUDENT_NUMBER}
        </p>
        <p className="font-mono text-[11px] text-muted text-center sm:text-right">
          RSS Server &amp; Client — Frontend Design and Usability (React)
        </p>
      </div>
    </footer>
  );
}
