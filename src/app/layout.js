import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

export const metadata = {
  title: "ReverieOS",
  description: "The Digital Dream Operating System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
