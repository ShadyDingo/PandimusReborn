// Global chat system
export class ChatSystem {
    constructor() {
        this.messages = [];
        this.maxMessages = 100;
        this.websocket = null;
        this.connected = false;
    }

    // Connect to chat server
    connect(serverUrl, username) {
        try {
            this.websocket = new WebSocket(serverUrl);
            this.username = username;

            this.websocket.onopen = () => {
                this.connected = true;
                this.addSystemMessage('Connected to chat');
                // Send join message
                this.sendMessage('system', `${username} joined the chat`);
            };

            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            };

            this.websocket.onerror = (error) => {
                console.error('Chat WebSocket error:', error);
                this.addSystemMessage('Chat connection error');
            };

            this.websocket.onclose = () => {
                this.connected = false;
                this.addSystemMessage('Disconnected from chat');
            };
        } catch (error) {
            console.error('Failed to connect to chat:', error);
            this.addSystemMessage('Failed to connect to chat server');
        }
    }

    // Disconnect from chat
    disconnect() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.connected = false;
    }

    // Send chat message
    sendChatMessage(message) {
        if (!this.connected || !this.websocket) {
            this.addSystemMessage('Not connected to chat');
            return false;
        }

        if (!message || message.trim().length === 0) {
            return false;
        }

        const chatMessage = {
            type: 'chat',
            username: this.username,
            message: message.trim(),
            timestamp: Date.now()
        };

        this.websocket.send(JSON.stringify(chatMessage));
        return true;
    }

    // Send system message (local only)
    sendMessage(type, message) {
        if (this.websocket && this.connected) {
            this.websocket.send(JSON.stringify({
                type,
                message,
                timestamp: Date.now()
            }));
        }
    }

    // Handle incoming message
    handleMessage(data) {
        switch (data.type) {
            case 'chat':
                this.addMessage(data.username, data.message, data.timestamp);
                break;
            case 'system':
                this.addSystemMessage(data.message);
                break;
            case 'player_join':
                this.addSystemMessage(`${data.username} joined`);
                break;
            case 'player_leave':
                this.addSystemMessage(`${data.username} left`);
                break;
        }
    }

    // Add message to history
    addMessage(username, message, timestamp = Date.now()) {
        this.messages.push({
            type: 'chat',
            username,
            message,
            timestamp
        });

        // Keep only last maxMessages
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }

        // Trigger message event
        this.onMessageReceived && this.onMessageReceived({
            type: 'chat',
            username,
            message,
            timestamp
        });
    }

    // Add system message
    addSystemMessage(message) {
        this.messages.push({
            type: 'system',
            message,
            timestamp: Date.now()
        });

        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }

        this.onMessageReceived && this.onMessageReceived({
            type: 'system',
            message,
            timestamp: Date.now()
        });
    }

    // Get recent messages
    getRecentMessages(count = 20) {
        return this.messages.slice(-count);
    }

    // Get all messages
    getAllMessages() {
        return [...this.messages];
    }

    // Clear message history
    clearHistory() {
        this.messages = [];
    }
}

export default ChatSystem;

