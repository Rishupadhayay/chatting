const socket = io();

    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const findMatchBtn = document.getElementById('findMatchBtn');
    const matchStatus = document.getElementById('matchStatus');
    const chatContainer = document.getElementById('chatContainer');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    joinRoomBtn.addEventListener('click', () => {
        socket.emit('join-room');
        matchStatus.textContent = 'You have joined a room. Waiting for a match...';
    });

    findMatchBtn.addEventListener('click', () => {
        socket.emit('find-match');
    });

    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value;
        socket.emit('message', message);
        messages.value += `You: ${message}\n`;
        messageInput.value = '';
    });

    socket.on('match-found', (data) => {
        matchStatus.textContent = `Match found! Connected to user: ${data.id}`;
        chatContainer.style.display = 'block';
        if (data.createReq) {
            
        }
    });

    socket.on('wait', () => {
        matchStatus.textContent = 'No match found yet. Please wait...';
    });

    socket.on('private-message', (data) => {
        messages.value += `Partner: ${data}\n`;
    });

    socket.on('offer', (offer) => {
        
    });

    socket.on('answer', (answer) => {
        
    });

    socket.on('peer:nego:needed', (data) => {
        
    });

    socket.on('peer:nego:final', (data) => {
        
    });

    socket.on('stream', () => {
        
    });

    socket.on('match-lost', () => {
        matchStatus.textContent = 'Your match has disconnected. Please find a new match.';
        chatContainer.style.display = 'none';
    });