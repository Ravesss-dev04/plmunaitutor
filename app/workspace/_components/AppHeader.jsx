import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useRef, useState } from 'react'
import { IoNotifications } from 'react-icons/io5'
import { BookOpen, FileText, ClipboardList, X, Mail } from 'lucide-react'

function AppHeader () {
    const { user } = useUser();
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if(notifRef.current && !notifRef.current.contains(event.target)){
                setShowNotif(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside )
        }
    }, [])

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            // Refresh notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.id])

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`/api/student-notifications?student_id=${user?.id}`);
            if (response.ok) {
                const data = await response.json();
                const unread = data.filter(n => !n.is_read);
                setNotifications(data.slice(0, 10)); // Show latest 10
                setUnreadCount(unread.length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch('/api/student-notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notificationId: notificationId,
                    studentId: user?.id
                })
            });

            if (response.ok) {
                setNotifications(prev => 
                    prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_lesson':
                return <BookOpen size={16} className="text-blue-400" />;
            case 'new_quiz':
                return <FileText size={16} className="text-yellow-400" />;
            case 'new_assignment':
                return <ClipboardList size={16} className="text-purple-400" />;
            default:
                return <IoNotifications size={16} className="text-gray-400" />;
        }
    }

    const getTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInMinutes = Math.floor((now - created) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }

    const createMailtoLink = (notification) => {
        const teacherEmail = notification.teacher_email || '';
        const studentEmail = user?.primaryEmailAddress?.emailAddress || '';
        const subject = encodeURIComponent(
            `Re: ${notification.message} - ${notification.course_title || 'Course'}`
        );
        const body = encodeURIComponent(
            `Hello ${notification.teacher_name || 'Teacher'},\n\n` +
            `Regarding: ${notification.message}\n` +
            `Course: ${notification.course_title || 'Course'}\n\n` +
            `[Your message here]`
        );
        
        // mailto link that opens student's email client
        return `mailto:${teacherEmail}?subject=${subject}&body=${body}`;
    }

    return (
        <div className='p-4 flex justify-between items-center shadow-sm'>
            <SidebarTrigger className='text-green-400'/> 
            <span className='md:hidden visible text-white text-1xl'>
                <span className='text-green-500'>PLMun</span> 
                <span className='text-gray-300'> AI - Tutor</span>
            </span>
            <div className='relative flex items-center gap-3 ml-auto' ref={notifRef}>
                <div className='relative' onClick={() => setShowNotif(!showNotif)}>
                    <IoNotifications className='text-white hover:text-green-500 md:w-5 cursor-pointer transition-colors' />
                    {unreadCount > 0 && (
                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
                
                {/* Notification Dropdown */}
                {showNotif && (
                    <div className='absolute right-0 top-12 w-80 md:w-96 text-white bg-[#161B22] rounded-xl shadow-lg z-50 border border-gray-700 max-h-96 overflow-y-auto'>
                        <div className='p-4 border-b border-gray-700 flex justify-between items-center'>
                            <p className='font-semibold text-sm text-green-400'>🔔 Notifications</p>
                            <button 
                                onClick={() => setShowNotif(false)}
                                className='text-gray-400 hover:text-white'
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className='p-2'>
                            {notifications.length === 0 ? (
                                <div className='text-center py-8 text-gray-400 text-sm'>
                                    <IoNotifications size={32} className='mx-auto mb-2 opacity-50' />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <ul className='space-y-2'>
                                    {notifications.map((notification) => (
                                        <li 
                                            key={notification.id}
                                            className={`bg-[#0d1117] p-3 rounded-lg hover:bg-[#1E242B] transition ${
                                                !notification.is_read ? 'border-l-2 border-green-500' : ''
                                            }`}
                                        >
                                            <div className='flex items-start gap-2'>
                                                <div className='mt-0.5'>
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className='flex-1 min-w-0' onClick={() => markAsRead(notification.id)}>
                                                    <p className='text-sm text-white cursor-pointer'>
                                                        <span className='font-semibold text-green-400'>
                                                            {notification.teacher_name || 'Teacher'}
                                                        </span>{' '}
                                                        {notification.message}
                                                    </p>
                                                    <p className='text-xs text-gray-500 mt-1'>
                                                        {getTimeAgo(notification.created_at)}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-2 shrink-0'>
                                                    {!notification.is_read && (
                                                        <div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                                                    )}
                                                    {notification.teacher_email && (
                                                        <a
                                                            href={createMailtoLink(notification)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className='p-1.5 rounded hover:bg-[#1E242B] transition-colors'
                                                            title='Open email client to contact teacher'
                                                        >
                                                            <Mail size={16} className='text-blue-400 hover:text-blue-300' />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
                <UserButton  />
            </div>
        </div>
    )   
}

export default AppHeader