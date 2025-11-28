import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

export const metadata = {
  title: "ReverieOS",
  description: "The Digital Dream Operating System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
