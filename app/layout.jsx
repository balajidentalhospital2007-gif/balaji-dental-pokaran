import "./globals.css";
export const metadata = {
  title: "Balaji Dental Clinic | Pokaran",
  description: "Advanced Dental Care & Implant Centre in Pokaran by Dr. Rajendra Singh Bhati",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
