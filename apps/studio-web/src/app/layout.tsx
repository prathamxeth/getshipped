import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GetShipped Approval Studio | 60fps Remotion & Omnichannel Launch',
  description: 'Automated developer RAG agent approval dashboard and 60fps Remotion video studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-canvas text-[#F8FAFC] font-sans antialiased selection:bg-emerald-500/25 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
