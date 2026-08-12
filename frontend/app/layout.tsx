import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "WIRE // RSS Server & Client",
  description: "An RSS Server and Client frontend built with React and Next.js",
};

// Applies the saved theme before first paint so there's no light/dark flash.
// Runs before hydration; PreferencesProvider takes over once React mounts.
const NO_FLASH_THEME_SCRIPT = `
  try {
    var theme = localStorage.getItem('wire:theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <PreferencesProvider>
          <Navbar />
          <Breadcrumbs />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </PreferencesProvider>
      </body>
    </html>
  );
}
