const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const users = [];

const roomsOfAll =[];

const nameOfUserList = [];

const nameOfUserList1 = [];

io.on('connection', (socket) => {
    const users = [];
const roomsOfAll = [];

const userId = socket.id; 
console.log(`User connected: ${userId}`);

socket.emit('userConnected', userId);

users.push(userId);
io.emit('userList', users);

let length = users.length;
let room = Math.floor(length / 2);

if (room >= 1) {
    for (let i = 0; i < room * 2; i += 2) {
        let room1 = {
            firstUser: users[i],
            secondUser: users[i + 1]
        };
        roomsOfAll.push(room1);
    }

    io.emit("rooms", roomsOfAll);
}

console.log(roomsOfAll);
    
    //My code  (gc/private)
    socket.on("user-name",(nameOfUser)=>{
        console.log(userId,"user joined as: ",nameOfUser)
        let li = `${nameOfUser}: ${userId}`
        nameOfUserList.push(li)
        io.emit("list1",nameOfUserList)
        console.log("list of users ",nameOfUserList)
    })
    socket.on("user-name", (nameOfUser) => {
        console.log(userId, "user joined as: ", nameOfUser);
        nameOfUserList1.push(nameOfUser);
        io.emit("list", nameOfUserList1);
        // console.log("list of users ", nameOfUserList);
    });




    

    socket.on('Usermessage', (data1) => {
        console.log(`Message from ${data1.name}: ${data1.message}`);
        const data2 = {
            name1: data1.name,
            message1: data1.message,
            // timestamp: new Date(),
        };
        io.emit('message1', data2);
    });

    

    socket.on('privateMessage', ({ toUserId, message }) => {
        console.log(`Private message from ${userId} to ${toUserId}: ${message}`);
        socket.to(toUserId).emit('privateMessage', { fromUserId: userId, message });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        const index = users.indexOf(userId);
        // const index1 = nameOfUserList.indexOf(userId)
        if (index !== -1) {
            nameOfUserList.splice(index, 1);
            nameOfUserList1.splice(index, 1);
            users.splice(index, 1);
        }
        io.emit("list1",nameOfUserList)
        io.emit("list",nameOfUserList1)
        // io.emit('userList', users);
        // console.log("list of users",nameOfUserList)
    });
});

app.use(express.static(path.resolve("./public")));
server.listen(9000, () => console.log("Server started"));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
});
