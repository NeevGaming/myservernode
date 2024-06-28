const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

const sh = ssh.connect({host: "192.168.29.72", username: "root",
                        password :"dark2020" , port:8022});
sh.then(()=>{
    ssh.execCommand('apt install vlc', { cwd: '/data/data/com.termux/files/home' }).then((result) => {
      console.log('STDOUT: ' + result.stdout);
      console.log('STDERR: ' + result.stderr);
    });
});
