import type { Metadata } from 'next';
import './globals.css';
import { Share_Tech_Mono, VT323 } from 'next/font/google';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mohamed Amir Elsamahy — AI Specialist & Founder',
  description: 'AI Specialist, Data Scientist, and Founder of MZ for Tech Solutions. Executive Director at EMAM Organization. Building intelligent solutions at the intersection of AI, data, and impact.',
  keywords: ['AI', 'Data Science', 'Machine Learning', 'Climate Tech', 'Egypt', 'MZ Tech Solutions'],
  authors: [{ name: 'Mohamed Amir Elsamahy' }],
  openGraph: {
    title: 'Mohamed Amir Elsamahy — AI Specialist',
    description: 'AI Specialist & Founder of MZ for Tech Solutions',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${shareTechMono.variable} ${vt323.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
