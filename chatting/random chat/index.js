const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);
// const port = 8080 || process.env.PORT;
app.use(express.static(path.resolve("./public")));
let userList1 =  [];
let userList2 = [];
let pairMap = new Map();

let flag = true;


io.on("connection", (socket)=>{
    console.log("user connected", socket.id);
    socket.on("join-room", ()=>{
        if(flag){
            userList1.push(socket.id);
            flag = !flag;
        }else{
            userList2.push(socket.id);
            flag = !flag;
        }
    });


    socket.on("find-match", () => {
        if (userList1.includes(socket.id)) {
            if (userList2.length > 0) {
                const randomIndex = Math.floor(Math.random() * userList2.length);
                const matchedUser = userList2[randomIndex];

                pairMap.set(socket.id,matchedUser)
                pairMap.set(matchedUser, socket.id);
                
                pairMap.set(socket.id, matchedUser);

                io.to(socket.id).emit("match-found", {id: matchedUser, "createReq":true});
                io.to(matchedUser).emit("match-found", {id : socket.id, "createReq":false});

                userList2 = userList2.filter((id) => id !== matchedUser);
                userList1 = userList1.filter((id) => id !== socket.id);


            } else {
                socket.emit("wait");
            }
        } else {    
            socket.emit("wait");
        }
    });

    socket.on("message", (data)=>{
        const otherSocketId = pairMap.get(socket.id);
        io.to(otherSocketId).emit("private-message", data);
    });

    socket.on("offer", ({offer})=>{
        const otherSocketId = pairMap.get(socket.id);
        io.to(otherSocketId).emit("offer", offer);
    });

    socket.on("answer", (data)=>{
        const otherSocketId = pairMap.get(socket.id);
        io.to(otherSocketId).emit("answer", data);
    });




    socket.on("peer:nego:needed", ({ offer }) => {
        const otherSocketId = pairMap.get(socket.id);
        io.to(otherSocketId).emit("peer:nego:needed", { offer });
      });
    
      socket.on("peer:nego:done", ({ ans }) => {
        const otherSocketId = pairMap.get(socket.id);
        io.to(otherSocketId).emit("peer:nego:final", { ans });
      });

      socket.on("stream", ()=>{
        const otherSocketId = pairMap.get(socket.id);
        io.to(socket.id).emit("stream");
        io.to(otherSocketId).emit("stream");
      })



    socket.on("disconnect", ()=>{
        userList1 = userList1.filter((el)=>el!=socket.id);
        userList2 = userList2.filter((el)=>el!=socket.id);

        const matchedUser = pairMap.get(socket.id);
        if (matchedUser) {
            io.to(matchedUser).emit("match-lost");
            pairMap.delete(matchedUser);
            pairMap.delete(socket.id);
        }

    });
});


// server.listen(port, ()=>{
//     console.log("server running on port ", port);
// });
server.listen(9000, () => console.log("Server started"));
app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
});

