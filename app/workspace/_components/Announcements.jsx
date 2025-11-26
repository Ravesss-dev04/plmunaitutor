"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Bell, CheckCircle, BookOpen, FileText, MessageSquare } from 'lucide-react'

function Announcements() {
  const { user, isLoaded } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchNotifications();
    }
  }, [isLoaded, user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/student-notifications?student_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Get only unread notifications or recent ones
        const recentNotifications = data
          .filter(notification => !notification.is_read)
          .slice(0, 5) // Show only 5 most recent
          .reverse(); // Show newest first
        setNotifications(recentNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/student-notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: notificationId,
          studentId: user.id
        })
      });

      if (response.ok) {
        // Remove the notification from the list
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_lesson':
        return <BookOpen size={14} className="text-blue-500" />;
      case 'quiz':
        return <FileText size={14} className="text-yellow-500" />;
      case 'announcement':
        return <MessageSquare size={14} className="text-green-500" />;
      default:
        return <Bell size={14} className="text-gray-500" />;
    }
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#13181F] p-6 rounded-xl shadow-sm md:w-full md:ml-0 w-82 -ml-6">
        <h3 className="text-lg font-semibold mb-4 text-center text-white">Announcements</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-start space-x-3 animate-pulse">
              <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#13181F] p-6 rounded-xl shadow-sm md:w-full md:ml-0 w-82 -ml-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Announcements</h3>
        {notifications.length > 0 && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {notifications.length} new
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-4">
            <Bell size={32} className="mx-auto text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm">No new announcements</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className="flex items-start space-x-3 p-3 bg-[#1a202c] rounded-lg hover:bg-[#2d3748] transition-colors group"
            >
              <div className="shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white opacity-90 truncate">
                      <span className="font-semibold text-green-400">
                        {notification.teacher_name}
                      </span>{' '}
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(notification.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Mark as read"
                  >
                    <CheckCircle size={16} className="text-green-500 hover:text-green-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Link */}
      {notifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="text-green-500 hover:text-green-400 text-sm font-medium w-full text-center">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  )
}

export default Announcements