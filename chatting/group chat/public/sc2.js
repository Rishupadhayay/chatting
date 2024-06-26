var socket = io();
        let userId;
        const inputField = document.getElementById('msginp');



        //my
        let nameOfUser = prompt("Enter username: ")
        console.log(nameOfUser)
        socket.emit("user-name",nameOfUser)


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
        socket.on('list',(nameOfUserList1)=>{
            const userListElement = document.querySelector("#userList")
            userListElement.innerHTML = "<h3>Users Online:</h3>" + nameOfUserList1.map(user => `<p>${user}</p>`).join('');

        })

        const send = document.querySelector("#Send");
        const msg = document.querySelector('#msginp');

        send.addEventListener('click', (e) => {
            const message = msg.value;
            console.log(`Sending message: ${message}`);
            
            const data1 = {
                name: nameOfUser,
                message: message,
            };
            
            socket.emit('Usermessage', data1); // Send object to server
            msg.value = ""; // Clear the input field after sending
        });


        const recived = document.querySelector("#rec");

        socket.on('message1', data2 => {
            const p = document.createElement('p');
            p.innerText = `User ${data2.name1}: ${data2.message1}`;
            recived.appendChild(p);
        });

        // Display received private messages
        socket.on('privateMessage', ({ fromUserId, message }) => {
            const p = document.createElement('p');
            p.innerText = `Private message from ${fromUserId}: ${message}`;
            recived.appendChild(p);
        });