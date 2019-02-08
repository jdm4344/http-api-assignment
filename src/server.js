const http = require('http');
const url = require('url');
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

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  // console.dir("onRequest: " + parsedUrl.pathname);
  const acceptedTypes = request.headers.accept.split(','); // header is a string divided by commas

  // Check if request is for XML, if not, send JSON
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, parsedUrl.pathname);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, parsedUrl.pathname);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
