var Client = require('ssh2').Client;
var conn = new Client();
conn.on('ready', () => {
    conn.shell( (err, stream) => {

        stream.on('data' , (data)=>{
            console.log(data.toString());
            //play with data
        });

        stream.stderr.on('data' , (data)=>{
            console.log(data);
            //play with errors
        });

        // stream.write("ls");
        stream.stdin.write("ls");
    });
}).connect({
    host: '192.168.29.72',
    port: 8022,
    username: 'root',
    password: 'dark2020' // or provide a privateKey
  });