import { useEffect, useState } from "react";

const useWebSocket = () => {
    const [queueStatus, setQueueStatus] = useState<boolean | null>(null);
    const [ticketStatus, setTicketStatus] = useState<string | null>(null);

    useEffect(() => {
        let socket: WebSocket;
        let reconnectTimeout: NodeJS.Timeout;

        const connectWebSocket = () => {
            socket = new WebSocket("ws://localhost:8080/ws/status");

            socket.onopen = () => {
                console.log("✅ WebSocket Connected");
            };

            socket.onmessage = (event) => {
                console.log("📩 WebSocket Message Received:", event.data);
                if (event.data.startsWith("queueStatus:")) {
                    setQueueStatus(event.data.split(":")[1] === "true");
                } else if (event.data.startsWith("ticketUpdate:")) {
                    setTicketStatus(event.data.split(":")[1]);
                }
            };

            socket.onerror = (error) => {
                console.error("❌ WebSocket Error:", error);
            };

            socket.onclose = () => {
                console.warn("⚠️ WebSocket Disconnected, reconnecting in 3s...");
                reconnectTimeout = setTimeout(connectWebSocket, 3000);
            };
        };

        connectWebSocket();

        return () => {
            socket.close();
            clearTimeout(reconnectTimeout);
        };
    }, []);

    // ✅ Function to manually update queue status
    const updateQueueStatus = (newStatus: boolean) => {
        setQueueStatus(newStatus);
    };

    return { queueStatus, ticketStatus, updateQueueStatus }; // ✅ Return updateQueueStatus
};

export default useWebSocket;
