
import "./css/euclid-circular-a-font.css";
import "./css/style.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "HAM - Premium Ladies Bags",
    description: "Shop premium quality ladies bags, handbags, clutches, and more at HAM. Affordable prices in PKR with fast delivery across Pakistan.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <Providers>
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
