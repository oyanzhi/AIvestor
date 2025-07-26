"use client";

import { useState, useEffect } from 'react';

type User = {
    id: number,
    username: string,
    email: string,
    [key: string]: any;
}

type Notification = {
    id: number,
    user: User,
    subject: string,
    body_text: string,
    sent_at: string,
    email_type: string,
    [key: string]: any;
}

export default function NotificationList({ token }: { token: string | null }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!token) {
            alert("You're not loggined in. Feature Only Available on Login.");
            return;
        }

        const fetchNotifications = async () => {
            try {
                const response = await fetch("https://aivestor-wnxv.onrender.com/notifications/getnotifications/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    alert("Fetching Notifications Failed")
                }

                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                alert("Error has occured.");
                setNotifications([]);
            }
        }

        fetchNotifications();
    }, [token])

    return (
        <div className="w-full min-h-screen mt-16">
            <div className="overflow-x-auto w-full">
                <table className="table-auto w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-gray-400 text-left">
                            <th className="px-4 py-2 border-b">Subject</th>
                            <th className="px-4 py-2 border-b">Type</th>
                            <th className="px-4 py-2 border-b">Sent At</th>
                            <th className="px-4 py-2 border-b">To (Email)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-white px-4 py-6 text-center">
                                    No notifications available.
                                </td>
                            </tr>
                        ) : (
                            notifications.map((noti) => (
                                <tr key={noti.id} className="text-white border-t border-gray-600">
                                    <td className="px-4 py-2">{noti.subject}</td>
                                    <td className="px-4 py-2">{noti.email_type}</td>
                                    <td className="px-4 py-2">{new Date(noti.sent_at).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
