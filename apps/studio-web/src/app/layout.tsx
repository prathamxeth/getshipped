import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GetShipped — Turn Code Into 60fps Launch Videos & Posts',
  description: 'Turn code commits into demo videos, social posts, and docs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&family=Outfit:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
