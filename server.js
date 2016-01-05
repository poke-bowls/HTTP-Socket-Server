var net = require( 'net' );
var moment = require( 'moment-timezone' );
var fs = require( 'fs' );

// ask NET module for new Server also setting what happens when client connects
var server = net.createServer( connectionInitiated );

function connectionInitiated( socketReq ) {
  var today = new Date();
  var UTCstring = moment(today.toUTCString()).tz( 'Pacific/Honolulu' ).format('MM/DD/YYYY hh:mm:ss a');

  console.log( 'New Client Connected to Server!' );

  socketReq.on('data', function( buffer ){
    // change the buffer into a string
    var info = buffer.toString().split(' ' );
    var path = info[1].split( '.' );
    var type = path[path.length - 1];

    if( info[1] === '/' ) {
      info[1] = '/index.html';
      type = 'html';
    }

    fs.readFile( './server-content' + info[1], function( err, data ) {
      if( err ) {
        type = 'html';
        return notFound();
      }
        var status = 'HTTP/1.1 200 OK\n';
        socketReq.write( status );
        socketReq.write( 'Date : ' + UTCstring + '\n' );
        socketReq.write( 'Server : Narnia\n' );
        socketReq.write( 'Connection: Keep-Alive\n' );
        socketReq.write( 'Content-Length: ' + data.length + '\n' );
        socketReq.write( 'Content-Type: text/' + type + '; charset=utf-8\n' );
        socketReq.write( 'Status : ' + status );

        socketReq.write('\n\n'); //body and headers need a space between
        socketReq.write( data );
        return socketReq.end();
    });

    var notFound = function () {
      fs.readFile( './server-content/404.html' , function( err, data ) {
        if(err) console.log(err);
          var status = 'HTTP/1.0 404 Not Found\n';
          socketReq.write( 'HTTP/1.0 404 Not Found\n' );
          socketReq.write( 'Date : ' + UTCstring + '\n' );
          socketReq.write( 'Server : Narnia\n' );
          socketReq.write( 'Connection: Keep-Alive\n' );
          socketReq.write( 'Content-Length: ' + data.length + '\n' );
          socketReq.write( 'Content-Type: text/' + type + '; charset=utf-8\n' );
          socketReq.write( 'Status : ' + status );
          socketReq.write( '\n\n' );
          socketReq.write( data );
        return socketReq.end();
      });
    };
  });
}

server.listen({ port: 8080 }, function() {
  address = server.address();
  console.log("opened server on %j", address);
});