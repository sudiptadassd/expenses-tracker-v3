import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/context/ExpenseContext";
import BottomNav from "@/components/BottomNav";
import ThemeWrapper from "@/components/ThemeWrapper";
import { FeedbackProvider } from "@/context/FeedbackContext";
import SWRegister from "@/components/SWRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Morack - Multi-Capital Expense Tracker",
    description: "Advanced notebook-style expense management",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Morack",
    },
};

export const viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SWRegister />
                <ExpenseProvider>
                    <ThemeWrapper>
                        <FeedbackProvider>
                            <div className="max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl bg-[var(--surface)] border-x border-[var(--border)] transition-colors duration-300">
                                <main className="flex-1 overflow-x-hidden p-4">
                                    {children}
                                </main>
                                <BottomNav />
                            </div>
                        </FeedbackProvider>
                    </ThemeWrapper>
                </ExpenseProvider>
            </body>
        </html>
    );
}
