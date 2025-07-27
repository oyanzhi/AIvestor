"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainNavBar from "../../../components/sidebar/mainnavbar";
import Footer from "../../../components/sidebar/footer";
import LoadingIndicator from "../../../components/loadingIndicator";

export default function NewPostPage() {
    const router = useRouter();
    const [authCheck, setAuthCheck] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        } else {
            setAuthCheck(true);
        }
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Not authenticated.");
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert("Title and content cannot be empty.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("https://aivestor-wnxv.onrender.com/forum/posts/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create post.");
            }

            setTimeout(() => {
                router.push("/forum");
            }, 1500);

        } catch (err) {
            alert(err instanceof Error ? err.message : "Unknown error");
            setLoading(false);
        }
    }

    if (!authCheck) return null;

    return (
        <div className="flex flex-col min-h-screen bg-deepblue text-white">
            <MainNavBar />

            <main className="flex-grow pt-24 px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-center">Create New Post</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 font-semibold">Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-buttonblue"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Content</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-buttonblue"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded-xl font-semibold transition ${loading
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-buttonblue hover:bg-buttonhoverblue"
                                    }`}
                            >
                                {loading ? <LoadingIndicator text="Posting..." /> : "Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
