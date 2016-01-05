var net = require( 'net' );
var moment = require( 'moment-timezone' );
var fs = require( 'fs' );

// ask NET module for new Server also setting what happens when client connects
var server = net.createServer( connectionInitiated );

// server's connect event

function connectionInitiated( socketReq ) {
  var today = new Date();
  var UTCstring = moment(today.toUTCString()).tz( 'Pacific/Honolulu' ).format('MM/DD/YYYY hh:mm:ss a');

  console.log( 'New Client Connected to Server' );

  socketReq.on('data', function( buffer ){
    // change the buffer into a string
    var info = buffer.toString().split(' ' );
    var status = 'HTTP/1.1 200 OK\n';

    // send stuff back to the user
    //header response status line
    socketReq.write( status );
    socketReq.write( 'Date : ' + UTCstring + '\n' );
    socketReq.write( 'Server : Narnia\n' );
    socketReq.write( 'Status : ' + status );

    socketReq.write('\n'); //body and headers need a space between

    //body content is returned based on the request sent to server
    var content = [ '/', '/index.html', '/hydrogen.html', '/helium.html', '/styles.css' ];

    if( info[1] === '/index.html' || info[1] === '/' ){
      fs.readFile( './server-content/index.html' , function( err, data ) {
        if(err) console.log(err);
        socketReq.write( data.toString() );
        return socketReq.end();
      });
    } else if( info[1] ==='/hydrogen.html' ) {
      fs.readFile( './server-content/hydrogen.html' , function( err, data ) {
        if(err) console.log(err);
        socketReq.write( data.toString() );
        return socketReq.end();
      });
    } else if( info[1] ==='/helium.html' ) {
      fs.readFile( './server-content/helium.html' , function( err, data ) {
        if(err) console.log(err);
        socketReq.write( data.toString() );
        return socketReq.end();
      });
    } else if( info[1] ==='/styles.css' ) {
      fs.readFile( './server-content/styles.css' , function( err, data ) {
        if(err) console.log(err);
        socketReq.write( data.toString() );
        return socketReq.end();
      });
    } else if( content.indexOf( info[1] ) === -1 ) {
      fs.readFile( './server-content/404.html' , function( err, data ) {
        if(err) {
          notFound();
        }
      });
    }
  });

  var notFound = function ( socketReq ) {
    var status = 'HTTP/1.0 404 Not Found\n';
    socketReq.write( status );
    socketReq.write( 'Date : ' + UTCstring + '\n' );
    socketReq.write( 'Server : Narnia\n' );
    socketReq.write( 'Status : ' + status );
    socketReq.write( '\n' );
    fs.readFile( './server-content/404.html' , function( err, data ) {
      if(err) console.log(err);
      socketReq.write( data.toString() );
      return socketReq.end();
    });
  };
}

server.listen({ port: 8080 }, function() {
  address = server.address();
  console.log("opened server on %j", address);
});