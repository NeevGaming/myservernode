var Client = require('ssh2').Client;
var readline = require('readline')

var conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  conn.shell(function(err, stream) {
    if (err) throw err;
    // create readline interface
    var rl = readline.createInterface(process.stdin, process.stdout)

    stream.on('close', function() {
      process.stdout.write('Connection closed.')
      console.log('Stream :: close');
      conn.end();
    }).on('data', function(data) {
      // pause to prevent more data from coming in
      process.stdin.pause()
      process.stdout.write(data)
      process.stdin.resume()
    }).stderr.on('data', function(data) {
      process.stderr.write(data);
    });

    rl.on('line', function (d) {
      // send data to through the client to the host
      stream.write(d.trim() + '\n')
    })

    rl.on('SIGINT', function () {
      // stop input
      process.stdin.pause()
      process.stdout.write('\nEnding session\n')
      rl.close()

      // close connection
      stream.end('exit\n')
    })

  });
}).connect({
  host: '192.168.29.72',
  port: 8022,
  username: 'root',
  password: 'dark2020' // or provide a privateKey
});