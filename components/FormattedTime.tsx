import React from 'react';

interface Props {
    datetime: string;
}

const FormattedTime: React.FC<Props> = ({ datetime }) => {
    const createdAt = new Date(datetime);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    let displayTime: string;

    if (diffMinutes < 1) {
        displayTime = "Just now";
    } else if (diffHours < 1) {
        displayTime = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        displayTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
        displayTime = createdAt.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    return (
        <span title={createdAt.toLocaleString()}>
            {displayTime}
        </span>
    );
};

export default FormattedTime;
