import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider"
import { getYear } from "date-fns";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One Stop Finance",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.className}
    >
      <ClerkProvider>
        {/* Main body container */}
        <body
          className="
            flex flex-col min-h-screen
            bg-background text-foreground
            transition-colors duration-300
          "
        // bg-background → uses theme colors from globals.css
        // text-foreground → automatically switches text color
        // transition-colors → smooth theme switching
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />

            {/* Main content grows to push footer down */}
            <main className="grow">
              {children}
            </main>

            <Toaster richColors />

            {/* Professional footer with dark mode support */}
            <footer>
              <div
                className="
                  mt-16 py-10
                  border-t border-border
                  bg-muted/40
                  backdrop-blur-sm
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                {/* text-muted-foreground adapts automatically */}
                <p>
                  &copy; {getYear(new Date())} Welth. All Rights Reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}