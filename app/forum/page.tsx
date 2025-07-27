"use client";

import MainNavBar from "../../components/sidebar/mainnavbar";
import Footer from "../../components/sidebar/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormattedTime from "../../components/FormattedTime";

type ForumPost = {
    id: number;
    author_username: string;
    title: string;
    content: string;
    created_at: string;
    votes: number; // total votes from backend
    user_vote: 1 | -1 | 0; // user's current vote, 0 if none
};

const CONTENT_TYPE_IDS = {
    post: 11,
    comment: 12,
};

export default function ForumPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [voteLoadingId, setVoteLoadingId] = useState<number | null>(null);
    const [sortOption, setSortOption] = useState<"latest" | "rating">("latest");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }
        fetchPosts(token);
    }, [router]);

    async function fetchPosts(token: string) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://aivestor-wnxv.onrender.com/forum/posts/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            alert("Failed to fetch post.");
        } finally {
            setLoading(false);
            setVoteLoadingId(null);
        }
    }

    async function vote(postId: number, value: 1 | -1) {
        const token = sessionStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }
        setVoteLoadingId(postId);

        try {
            const res = await fetch("https://aivestor-wnxv.onrender.com/forum/vote/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    value,
                    content_type: CONTENT_TYPE_IDS.post,
                    object_id: postId,
                }),
            });
            if (!res.ok) throw new Error("Failed to vote");
            await fetchPosts(token);
        } catch (err) {
            alert(`Error voting: ${(err as Error).message}`);
            setVoteLoadingId(null);
        }
    }

    // Sort posts based on selected option
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOption === "latest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortOption === "rating") {
            return (b.votes ?? 0) - (a.votes ?? 0);
        }
        return 0;
    });

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-deepblue text-white">
                <MainNavBar />
                <main className="flex-grow w-full p-6 pt-24 pb-24 flex items-center justify-center">
                    <p className="text-white text-center">Loading posts...</p>
                </main>
                <Footer />
            </div>
        );
    }
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="flex flex-col min-h-screen bg-deepblue text-white">
            <MainNavBar />

            <main className="flex-grow w-full p-6 space-y-6 pt-24 pb-24">
                <div className="relative sm:w-3/4 md:w-2/3 mx-auto w-full mb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-center">Forum</h1>
                    <button
                        onClick={() => router.push("/forum/new")}
                        className="absolute right-0 top-9 -translate-y-1/2 bg-buttonblue hover:bg-buttonhoverblue px-5 py-2 rounded-xl font-semibold shadow-lg transition"
                    >
                        + New Post
                    </button>
                </div>

                {/* Sorting Dropdown */}
                <div className="sm:w-3/4 md:w-2/3 mx-auto flex justify-end mb-4">
                    <label htmlFor="sort" className="mr-3 self-center">
                        Sort by:
                    </label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as "latest" | "rating")}
                        className="bg-gray-700 text-white rounded px-3 py-1"
                    >
                        <option value="latest">Latest</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>

                <ul className="w-full sm:w-3/4 md:w-2/3 mx-auto space-y-4">
                    {sortedPosts.length === 0 && <p className="text-center text-gray-400">No posts found.</p>}
                    {sortedPosts.map((post) => (
                        <li
                            key={post.id}
                            className="flex bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
                            onClick={() => router.push(`/forum/${post.id}`)}
                        >
                            <div className="flex flex-col items-center justify-center bg-gray-900 px-3 rounded-l-xl select-none text-gray-400">
                                <button
                                    disabled={voteLoadingId === post.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        vote(post.id, 1);
                                    }}
                                    className={`transition text-2xl leading-none ${voteLoadingId === post.id
                                        ? "opacity-50 cursor-not-allowed"
                                        : post.user_vote === 1
                                            ? "text-green-400"
                                            : "hover:text-green-400"
                                        }`}
                                >
                                    ▲
                                </button>
                                <span className="font-semibold text-lg">{post.votes ?? 0}</span>
                                <button
                                    disabled={voteLoadingId === post.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        vote(post.id, -1);
                                    }}
                                    className={`transition text-2xl leading-none ${voteLoadingId === post.id
                                        ? "opacity-50 cursor-not-allowed"
                                        : post.user_vote === -1
                                            ? "text-red-400"
                                            : "hover:text-red-400"
                                        }`}
                                >
                                    ▼
                                </button>
                            </div>
                            <div className="flex flex-col flex-grow p-4">
                                <h2 className="text-xl font-semibold text-white truncate">{post.title}</h2>
                                <div className="flex items-center text-sm text-gray-400 space-x-3 mt-1">
                                    <span>
                                        Posted by {post.author_username} • <FormattedTime datetime={post.created_at} />
                                    </span>
                                </div>
                                <p className="mt-3 text-gray-300 line-clamp-3 whitespace-pre-line">{post.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>

            <Footer />
        </div>
    );
}
