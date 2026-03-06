import type {Metadata} from 'next';
import Image from 'next/image';
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
      <body className="font-space bg-[#F0F0F0] text-black" suppressHydrationWarning>
        <header className="bg-white border-b-4 border-black shadow-brutal">
          <nav className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-black bg-[#7DF9FF] shadow-brutal flex items-center justify-center">
                <Image
                  src="/forgeflow-logo.svg"
                  alt="ForgeFlow logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase">ForgeFlow</span>
                <span className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  Command Center
                </span>
              </div>
            </div>
            <div className="bg-[#FFD700] border-4 border-black px-4 py-2 font-black uppercase shadow-brutal">
              Sgt. Major Online
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
