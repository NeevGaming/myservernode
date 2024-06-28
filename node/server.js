const WebSocket = require("ws");
const os = require('os');
const checkDiskSpace = require('check-disk-space').default
const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();
const wss = new WebSocket.Server({port:8000});



console.log("Listening at port 8000");

const sh = ssh.connect({host: "localhost", username: "root",
    password :"dark2020" , port:8022});


wss.on('connection' , ws=>{
    console.log("Client Connected");

    ws.on('message' , data =>{
        var str = data.toString();
        if(str.charAt(0) === 'l'){
            let i = 2;
            var username = "";
            var passwd = "";
            while(!(str.charAt(i) === '~')){
                username = username + str.charAt(i);
                i++;
            }
            i++;
            while( i < str.length){
                passwd = passwd + str.charAt(i);
                i++;
            }
            if(username === "admin" && passwd === "neevahuja"){
                ws.send("login");
            }
        } else if(str === "cpu"){
            let total = os.cpus()[0].times.user + os.cpus()[0].times.nice + os.cpus()[0].times.sys + os.cpus()[0].times.idle + os.cpus()[0].times.irq;
            let used = os.cpus()[0].times.user + os.cpus()[0].times.sys + os.cpus()[0].times.irq;

            for(let i = 1 ; i < os.cpus().length ; i++){
                total = total + os.cpus()[i].times.user + os.cpus()[i].times.nice + os.cpus()[i].times.sys + os.cpus()[i].times.idle + os.cpus()[i].times.irq ;
                used = used + os.cpus()[i].times.user + os.cpus()[i].times.sys + os.cpus()[i].times.irq;
            }
            ws.send("cpu~" + (Math.round(((used / total) * 100) * 100) / 100) +"%");
        } else if(str === "mem"){
            ws.send("mem~" + Math.round( (os.totalmem() -os.freemem()) / os.totalmem() * 10000) / 100  +"%");
        } else if(str === "strg"){
            checkDiskSpace('C:/').then((diskSpace) => {
                ws.send("strg~" +  Math.round(diskSpace.free / diskSpace.size * 10000) /100 + "%")
            });
        } else if(str.charAt(0) === "s" && str.charAt(1) === "s" && str.charAt(2) === "h"){
            let result = "";
            for(let i = 4 ; i < str.length ; i++){
                result = result + str.charAt(i);
            }
            sh.then(()=>{
                ssh.execCommand(result, { cwd: '/data/data/com.termux/files/home' }).then((result) => {
                  ws.send( "ssh~" + result.stdout + result.stderr);
                });
            });
        } else if(str.charAt(0) === "s" && str.charAt(1) === "l"){
            let i = 3;
            var username = "";
            var passwd = "";
            while(!(str.charAt(i) === '~')){
                username = username + str.charAt(i);
                i++;
            }
            i++;
            while( i < str.length){
                passwd = passwd + str.charAt(i);
                i++;
            }
            if(username === "ssh" && passwd === "neevahuja"){
                ws.send("login");
            }
        
        }
    });

    ws.on('close', ()=>{
        console.log("Client Disconnected");
    });
});
