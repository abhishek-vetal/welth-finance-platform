import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One Stop Finance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <ClerkProvider>
        <body className="flex flex-col min-h-screen">
            
            <Header />

            <main className="grow">
              {children}
            </main>

            <footer>
              <div className="py-12 bg-blue-50 text-center text-gray-600">
                <p>Made with ❤️ by Abhishek</p>
              </div>
            </footer>

        </body>
      </ClerkProvider>
    </html>
  );
}