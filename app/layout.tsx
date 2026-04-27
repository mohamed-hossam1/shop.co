import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { StateProvider } from "@/providers/state-provider";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-satoshi">
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
      </body>
    </html>
  );
}
