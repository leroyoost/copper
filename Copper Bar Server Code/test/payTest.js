const _ = require('underscore')
const http = require('http');
const https = require ('https');
const querystring = require('querystring');

const port = 4205
const requestHandler = (request, response) => {

  request.on('data', function (data) {
    reqBody = JSON.parse(data);
  });

  request.on('end', function () {
      var path='/v1/checkouts';
      reqBody["authentication.userId"] = "8a8294175ebed21d015ec22f261b06ac",
      reqBody["authentication.password"] = "mgMGPwA3H4",
      reqBody["authentication.entityId"] = "8a8294175ebed21d015ec232e6ee06c1"
      var data = querystring.stringify( reqBody )
      console.log(reqBody)

      var options = {
        port: 443,
        host: 'test.oppwa.com',
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
        }
      };

      var postRequest = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          jsonRes = JSON.parse(chunk);
          console.log(jsonRes.id)
          response.end(jsonRes.id)
        });
      });
      postRequest.write(data);
      postRequest.end();
    });
  }
  
  const server = http.createServer(requestHandler)
  
  server.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
  
    console.log(`server is now listening on ${port}`)
  })

