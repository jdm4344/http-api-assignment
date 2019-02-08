const http = require('http');
const url = require('url');
const query = require('querystring');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/success': responseHandler.parseResponse,
  '/badRequest': responseHandler.parseResponse,
  '/unauthorized': responseHandler.parseResponse,
  '/forbidden': responseHandler.parseResponse,
  '/internal': responseHandler.parseResponse,
  '/notImplemented': responseHandler.parseResponse,
  '/notFound': responseHandler.parseResponse,
  '/style.css': responseHandler.getCss,
  notFound: responseHandler.notFound,
};

const handlePost = (request, response, parsedUrl, acceptedTypes) => {
  if (parsedUrl.pathname === '/badRequest') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString); // convert string to JSON object
      console.dir(bodyParams);

      responseHandler.parseResponse(request, response, acceptedTypes, parsedUrl.pathname, true);
    });
  } else if (parsedUrl.pathname === '/unauthorized') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString); // convert string to JSON object
      console.dir(bodyParams);

      responseHandler.parseResponse(
        request,
        response,
        acceptedTypes,
        parsedUrl.pathname,
        false,
        true,
      );
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  // console.dir("onRequest: " + parsedUrl.pathname);
  const acceptedTypes = request.headers.accept.split(','); // header is a string divided by commas

  // if (request.method === 'POST') {
  //   handlePost(request, response, parsedUrl, acceptedTypes);
  // } else
  if (urlStruct[parsedUrl.pathname]) { // Check if request is for XML, if not, send JSON
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, parsedUrl.pathname);
    //responseHandler.parseResponse(request, response, acceptedTypes, parsedUrl.pathname);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, parsedUrl.pathname);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
