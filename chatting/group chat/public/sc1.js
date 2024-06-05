var socket = io();
        let userId;


        
        let nameOfUser = prompt("Enter username: ")
        console.log(nameOfUser)
        socket.emit("user-name",nameOfUser)
        
        


        const inputField = document.getElementById('msginp');

        inputField.addEventListener('input', function() {
            const maxLength = parseInt(inputField.getAttribute('maxlength'));
            const currentLength = inputField.value.length;
            const remaining = maxLength - currentLength;

            if (remaining < 0) {
                inputField.value = inputField.value.slice(0, maxLength);
            }
        });

        // Receive and store the user's unique ID
        socket.on('userConnected', (id) => {
            userId = id;
            console.log(`Connected with ID: ${userId}`);
        });

        // Update the user list when received from the server
        // socket.on('userList', (users) => {
        //     const userListElement = document.getElementById('userList');
        //     userListElement.innerHTML = "<h3>Users Online:</h3>" + users.map(user => `<p>${user}</p>`).join('');
        // });
        socket.on('list1',(nameOfUserList)=>{
            const userListElement = document.querySelector("#userList")
            userListElement.innerHTML = "<h3>Users Online: <h4>name: userId</h4></h3>" + nameOfUserList.map(user => `<p>${user}</p>`).join('');

        })
        // socket.on('list', (nameOfUserList) => {
        //     // console.log(nameOfUserList)
        //     const userListElement = document.getElementById('userList');
        //     userListElement.innerHTML = "<h3>Users Online:</h3>" + nameOfUserList.map(user => `<p>${user}</p>`).join('');
        // });

        const send = document.querySelector("#Send");
        const msg = document.querySelector('#msginp');

        send.addEventListener('click', () => {
            const message = msg.value;
            console.log(`Sending message: ${message}`);
            socket.emit('Usermessage', message); // Send message to server
            msg.value = ""; // Clear the input field after sending
        });

        const recived = document.querySelector("#rec");

        socket.on('message', (data) => {
            const p = document.createElement('p');
            p.innerText = `User ${data.userId}: ${data.message}`;
            recived.appendChild(p);
        });

        // Handle sending private messages
        const sendPrivateBtn = document.querySelector("#Send1");
        const privateUserIdInput = document.querySelector('#privateUserId');
        const privateMsgInput = document.querySelector('#privateMsginp');
        
        let pvtmsg = document.querySelector("#rec")
        sendPrivateBtn.addEventListener('click', () => {
            const toUserId = privateUserIdInput.value;
            const message = privateMsgInput.value;
            // pvtmsg.innerHTML = `<p>Sending private message to ${toUserId}: ${message}</p>`
            const p = document.createElement('p');
            p.innerText = `Sending private message to ${toUserId}: ${message}`;
            recived.appendChild(p);
            console.log(`Sending private message to ${toUserId}: ${message}`);
            socket.emit('privateMessage', { toUserId, message });
            privateMsgInput.value = ""; // Clear the input field after sending
        });

        // Display received private messages
        socket.on('privateMessage', ({ fromUserId, message }) => {
            const p = document.createElement('p');
            p.innerText = `Private message from ${fromUserId}: ${message}`;
            recived.appendChild(p);
        });