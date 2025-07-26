import "./(globals)/globals.css"
import GoogleSignInWrapper from "./googlesigninwrapper"

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
        <GoogleSignInWrapper>
          <div id="root">{children}</div>
        </GoogleSignInWrapper>
      </body>
    </html>
  )
}