import { useEffect, useState } from "react";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
// ✅ Construct WebSocket URL dynamically based on API URL
const getWebSocketURL = () => {
    if (API_URL.startsWith("https")) {
        return API_URL.replace(/^https/, "wss") + "/ws/status"; // Convert HTTPS → WSS
    } else {
        return API_URL.replace(/^http/, "ws") + "/ws/status"; // Convert HTTP → WS
    }
};

const useWebSocket = () => {
    const [queueStatus, setQueueStatus] = useState<boolean | null>(null);
    const [queueUpdateCount, setQueueUpdateCount] = useState(0); // ✅ Forces re-render
    const [ticketStatus, setTicketStatus] = useState<string | null>(null);
    const [ticketUpdateCount, setTicketUpdateCount] = useState(0); // ✅ Forces re-render

    

    useEffect(() => {
        let socket: WebSocket;
        let reconnectTimeout: NodeJS.Timeout;

        const connectWebSocket = () => {
            const wsURL = getWebSocketURL(); // ✅ Get WebSocket URL dynamically
            console.log("🔗 Connecting to WebSocket:", wsURL);
            socket = new WebSocket(wsURL);

            socket.onopen = () => {
                console.log("✅ WebSocket Connected");
            };

            socket.onmessage = (event) => {
                console.log("📩 WebSocket Message Received:", event.data);
                
                if (event.data.startsWith("queueStatus:")) {
                    const newQueueStatus = event.data.split(":")[1] === "true";
                    setQueueStatus(newQueueStatus);
                    setQueueUpdateCount(prev => prev + 1); // ✅ Always increment
                } else if (event.data.startsWith("ticketUpdate:")) {
                    const newTicketStatus = event.data.split(":")[1];
                    setTicketStatus(newTicketStatus);
                    setTicketUpdateCount(prev => prev + 1); // ✅ Always increment
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

    return { queueStatus, queueUpdateCount, ticketStatus, ticketUpdateCount };
};

export default useWebSocket;
