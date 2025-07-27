"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainNavBar from "../../../components/sidebar/mainnavbar";
import Footer from "../../../components/sidebar/footer";
import FormattedTime from "../../../components/FormattedTime";

type Comment = {
    id: number;
    author_username: string;
    content: string;
    created_at: string;
    votes: number;
    user_vote: 1 | -1 | 0;
};

type ForumPost = {
    id: number;
    author_username: string;
    title: string;
    content: string;
    created_at: string;
    votes: number;
    user_vote: 1 | -1 | 0;
    comments: Comment[];
};

function timeSince(dateString: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
}

const FORUM_POST_CONTENT_TYPE_ID = 11;
const FORUM_COMMENT_CONTENT_TYPE_ID = 12;

export default function PostPage() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<ForumPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [commentSort, setCommentSort] = useState<"latest" | "rating">("latest");
    const [voteLoading, setVoteLoading] = useState<{ type: "post" | "comment"; id: number | null }>({
        type: "post",
        id: null,
    });

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        } else {
            fetchPost(token);
        }
    }, [id]);

    async function fetchPost(token: string) {
        setLoading(true);
        try {
            const res = await fetch(`https://aivestor-wnxv.onrender.com/forum/posts/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch post");
            const data = await res.json();
            setPost(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            alert("Failed to fetch post.");
        } finally {
            setLoading(false);
        }
    }

    async function submitComment() {
        const token = sessionStorage.getItem("token");
        if (!token || !newComment.trim()) return;

        try {
            const res = await fetch(`https://aivestor-wnxv.onrender.com/forum/posts/${id}/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });
            if (!res.ok) throw new Error("Failed to post comment");
            setNewComment("");
            fetchPost(token);
        } catch {
            alert("Error posting comment.");
        }
    }

    async function vote(
        value: 1 | -1,
        contentTypeId: number,
        objectId: number,
        voteType: "post" | "comment"
    ) {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        setVoteLoading({ type: voteType, id: objectId });
        try {
            const res = await fetch("https://aivestor-wnxv.onrender.com/forum/vote/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    value,
                    content_type: contentTypeId,
                    object_id: objectId,
                }),
            });

            if (!res.ok) throw new Error("Voting failed");
            fetchPost(token);
        } catch (err) {
            console.error("Vote error:", err);
            alert("Error voting.");
        } finally {
            setVoteLoading({ type: voteType, id: null });
        }
    }

    if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
    if (error || !post) return <div className="text-center mt-10 text-red-400">{error || "Post not found"}</div>;

    const sortedComments = [...post.comments].sort((a, b) => {
        if (commentSort === "latest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
            return (b.votes ?? 0) - (a.votes ?? 0);
        }
    });

    return (
        <div className="flex flex-col min-h-screen bg-deepblue text-white">
            <MainNavBar />

            <main className="flex-grow px-6 pt-24 pb-12 mx-auto sm:w-3/4 md:w-2/3">
                <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

                {/* Voting and Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={voteLoading.type === "post" && voteLoading.id === post.id}
                            className={`transition ${post.user_vote === 1 ? "text-green-400" : "hover:text-green-400"} ${voteLoading.type === "post" && voteLoading.id === post.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => vote(1, FORUM_POST_CONTENT_TYPE_ID, post.id, "post")}
                        >
                            ▲
                        </button>
                        <span>{post.votes ?? 0}</span>
                        <button
                            disabled={voteLoading.type === "post" && voteLoading.id === post.id}
                            className={`transition ${post.user_vote === -1 ? "text-red-400" : "hover:text-red-400"} ${voteLoading.type === "post" && voteLoading.id === post.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => vote(-1, FORUM_POST_CONTENT_TYPE_ID, post.id, "post")}
                        >
                            ▼
                        </button>
                    </div>
                    <span>
                        Posted by {post.author_username} • <FormattedTime datetime={post.created_at} />
                    </span>
                </div>

                <p className="whitespace-pre-wrap text-lg mb-8">{post.content}</p>

                <hr className="border-gray-600 mb-6" />

                <h2 className="text-xl font-semibold mb-3">Comments</h2>

                {/* Comment Input */}
                <div className="mb-6">
                    <textarea
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                    />
                    <button
                        onClick={submitComment}
                        className="mt-2 bg-buttonblue hover:bg-buttonhoverblue px-4 py-2 rounded-lg font-semibold"
                    >
                        Submit
                    </button>
                </div>

                {/* Sorting Dropdown */}
                <div className="flex justify-end mb-4">
                    <label htmlFor="comment-sort" className="mr-3 self-center text-sm text-gray-400">
                        Sort comments by:
                    </label>
                    <select
                        id="comment-sort"
                        value={commentSort}
                        onChange={(e) => setCommentSort(e.target.value as "latest" | "rating")}
                        className="bg-gray-700 text-white rounded px-3 py-1 text-sm"
                    >
                        <option value="latest">Latest</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>

                {/* Comment List */}
                <div className="space-y-4">
                    {sortedComments.length > 0 ? (
                        sortedComments.map((comment) => (
                            <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                                    <div>
                                        {comment.author_username} • <FormattedTime datetime={comment.created_at} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={voteLoading.type === "comment" && voteLoading.id === comment.id}
                                            className={`transition ${comment.user_vote === 1 ? "text-green-400" : "hover:text-green-400"} ${voteLoading.type === "comment" && voteLoading.id === comment.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={() => vote(1, FORUM_COMMENT_CONTENT_TYPE_ID, comment.id, "comment")}
                                        >
                                            ▲
                                        </button>
                                        <span>{comment.votes ?? 0}</span>
                                        <button
                                            disabled={voteLoading.type === "comment" && voteLoading.id === comment.id}
                                            className={`transition ${comment.user_vote === -1 ? "text-red-400" : "hover:text-red-400"} ${voteLoading.type === "comment" && voteLoading.id === comment.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={() => vote(-1, FORUM_COMMENT_CONTENT_TYPE_ID, comment.id, "comment")}
                                        >
                                            ▼
                                        </button>
                                    </div>
                                </div>
                                <p className="text-white whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-400">No comments yet.</div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
