'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientID = "617178650210-6qri3p95ros5u1qdvh6f851r7h49ppbh.apps.googleusercontent.com";

export default function GoogleSignInWrapper( {children}: {children: React.ReactNode} ) {
  return (
    <GoogleOAuthProvider clientId={clientID}>
        {children}
    </GoogleOAuthProvider>
  )
}