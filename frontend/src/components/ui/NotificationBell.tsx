import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { notify } from '../../lib/notify';

interface Notification {
    id: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const NotificationBell = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const loadNotifications = async () => {
        try {
            const { data } = await api.get<Notification[]>('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error loading notifications', error);
        }
    };

    useEffect(() => {
        loadNotifications();

        // Listen for new notifications to refresh list
        if (socket) {
            socket.on('new_notification', (newNotif: Notification) => {
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            if (socket) socket.off('new_notification');
        };
    }, [socket]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            setUnreadCount(0); // Optimistic Update
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            await api.patch(`/notifications/read-all`);
            notify.success('Todas marcadas como leídas');
        } catch (error) {
            console.error('Failed to mark all as read');
            loadNotifications(); // Revert on error
        }
    }

    const getIconColor = (type: string) => {
        switch (type) {
            case 'SUCCESS': return 'text-green-500 bg-green-50';
            case 'ERROR': return 'text-red-500 bg-red-50';
            case 'WARNING': return 'text-amber-500 bg-amber-50';
            default: return 'text-blue-500 bg-blue-50';
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--muted)] relative transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--card-bg)] animate-bounce"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-soft)]">
                        <h3 className="font-bold text-[var(--text)]">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-xs text-[var(--primary)] hover:underline font-medium">
                                Marcar todo leído
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-[var(--muted)]">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No tienes notificaciones por ahora</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border)]">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 hover:bg-[var(--bg-primary)] transition-colors flex gap-3 cursor-pointer ${notif.isRead ? 'opacity-60' : 'bg-blue-50/10'}`}
                                        onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                    >
                                        <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-transparent' : getIconColor(notif.type).split(' ')[0].replace('text-', 'bg-')}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[var(--text)] mb-0.5">{notif.title}</p>
                                            <p className="text-xs text-[var(--muted)] line-clamp-2 mb-2">{notif.message}</p>
                                            <p className="text-[10px] text-[var(--muted)] font-mono">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
