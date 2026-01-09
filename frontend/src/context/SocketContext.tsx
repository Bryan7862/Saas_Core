import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { notify } from '../lib/notify';
import { API_URL } from '../lib/api';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Connect to Backend WebSocket Gateway
        const newSocket = io(API_URL, {
            auth: { token },
            query: { token }, // Fallback
            transports: ['websocket'], // Force WebSocket
            reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
            console.log('[Socket] Connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('[Socket] Connection Error:', err.message);
        });

        // Global Event Listener for Notifications
        newSocket.on('new_notification', (data: any) => {
            // Get Current User ID from Token (simple decode)
            const token = localStorage.getItem('access_token');
            let currentUserId = null;
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    currentUserId = payload.sub;
                } catch (e) { console.error('Token Decode Error', e); }
            }

            // Suppress Toast if I triggered it (triggeredBy === currentUserId)
            const isSelfTriggered = data.triggeredBy && data.triggeredBy === currentUserId;

            if (!isSelfTriggered) {
                // Display Toast only if NOT self-triggered
                if (data.type === 'ERROR') notify.error(data.title);
                else if (data.type === 'SUCCESS') notify.success(data.title);
                else notify.info(data.title);
            }

            // ALWAYS Dispatch window event to update Bell Count
            window.dispatchEvent(new Event('refreshNotifications'));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
