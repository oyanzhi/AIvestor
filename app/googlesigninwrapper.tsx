'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function GoogleSignInWrapper( {children}: {children: React.ReactNode} ) {
  return (
    <GoogleOAuthProvider clientId={clientID}>
        {children}
    </GoogleOAuthProvider>
  )
}