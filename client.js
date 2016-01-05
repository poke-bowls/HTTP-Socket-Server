var net = require( 'net' );

var client = net.connect( 8080, 'localhost', function() {
    console.log( 'Connected to Server' );
    client.write( 'GET /index.html HTTP/1.1\n' );

    client.write( '\n' );

    return client.end();
  });

  client.on( 'data', function( data ) {
    console.log( 'Received: ' + data );
    client.destroy();
  });

  client.on( 'close', function() {
    console.log( 'Connection closed' );
  });