import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Header />
            <main className="py-2">
                {children}
            </main>
            <Footer />
        </div>
    </div>
  );
}
