import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { StateProvider } from "@/providers/state-provider";
import { Analytics } from "@vercel/analytics/next";

import QueryProvider from "@/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-satoshi">
        <QueryProvider>
          <StateProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Analytics />
            </ThemeProvider>
          </StateProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
