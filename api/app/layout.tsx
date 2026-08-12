export const metadata = {
  title: "RSS Server API",
  description: "Backend API for the RSS Server & Client project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "monospace", background: "#0b0e0d", color: "#e8edea" }}>
        {children}
      </body>
    </html>
  );
}
