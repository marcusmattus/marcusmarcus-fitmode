import type {Metadata} from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'ForgeFlow | AI Fitness',
  description: 'Neobrutalist AI Fitness Architecture',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-space bg-[#F0F0F0]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
