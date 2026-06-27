import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "AgriMind AI — Smart Crop Intelligence",
  description: "AI-powered crop analysis, soil health, market prices and weather for modern farmers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A2E1A',
              border: '1px solid rgba(61,154,64,0.3)',
              color: '#F0EBE0',
            }
          }}
        />
      </body>
    </html>
  );
}