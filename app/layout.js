import "./(globals)/globals.css"

export const metadata = {
  title: "AIvestor",
  icons: {
    icon: '/logo circle.png',
  },
  
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