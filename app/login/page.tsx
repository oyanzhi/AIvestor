import { Suspense } from "react"
import LoginPage from "./LoginPage"

export default function LoginPageWithSuspense() {
    return (
        <Suspense fallback={<div className="text-white text-center pt-10">Loading...</div>}>
            <LoginPage />
        </Suspense>
    )
}