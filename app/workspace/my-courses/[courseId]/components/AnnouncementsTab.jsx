"use client";

export default function AnnouncementTab({announcements}) {
    return(
        <div className="space-y-4">
            {announcements.map((announcement, index) => (
                <div key={index} className="p-5 bg-gray-800 rounded-lg flex justify-between items-center">
                    {announcement.message}
                </div>
            ))}
        </div>
    )
}