export const metadata = {
  title: "Notes & Bookmarks Manager",
  description: "Personal notes and bookmark manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-5xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
