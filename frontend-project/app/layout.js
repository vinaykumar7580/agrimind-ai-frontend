import "./globals.css";
import { Sidebar } from "../components/dashboard/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-full">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}