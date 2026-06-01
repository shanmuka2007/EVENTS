import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Shanmuka Events',
  description: 'Premium Cosmic-Royal Indian wedding registry and high-frequency space-time ceremony planner.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased bg-[#020205] text-gray-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
