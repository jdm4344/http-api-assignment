const http = require('http');
const url = require('url');
const query = require('querystring');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/success': responseHandler.checkValid,
  '/badRequest': responseHandler.checkValid,
  '/unauthorized': responseHandler.checkValid,
  '/forbidden': responseHandler.checkValid,
  '/internal': responseHandler.checkValid,
  '/notImplemented': responseHandler.checkValid,
  '/notFound': responseHandler.checkValid,
  '/style.css': responseHandler.getCss,
  notFound: responseHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  // console.dir("onRequest: " + parsedUrl.pathname);
  const acceptedTypes = request.headers.accept.split(','); // header is a string divided by commas
  const parameters = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) { // Check if request is for XML, if not, send JSON
    urlStruct[parsedUrl.pathname](request, response, parsedUrl.pathname, acceptedTypes, parameters);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, parsedUrl.pathname);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
