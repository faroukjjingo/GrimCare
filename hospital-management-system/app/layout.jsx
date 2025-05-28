// app/layout.jsx
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}