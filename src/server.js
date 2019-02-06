const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/badrequest': responseHandler.getIndex,
  '/unauthorized': responseHandler.getIndex,
  '/forbidden': responseHandler.getIndex,
  '/internal': responseHandler.getIndex,
  '/notImplemented': responseHandler.getIndex,
  index: responseHandler.getIndex,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(','); // header is a string divided by commas

  // Check if request is for XML, if not, send JSON
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes);
  } else {
    urlStruct.index(request, response, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
