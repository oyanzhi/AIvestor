import "../styles/globals.css";

export const metadata = {
  title: "AIvestor",
  description: "AI-Powered Financial Investor",
}
 
export default function RootLayout({ 
  children 
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}