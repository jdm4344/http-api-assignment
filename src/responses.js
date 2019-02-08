const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Basic response template
const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// Constructs a JSON response and sends
const respondJSON = (request, response, status, message) => {
  // If successful, return only message
  if (status === 200) {
    const obj = {
      message,
    };

    // console.dir(`respondJSON - obj: ${obj.message} status: ${status}`);
    return respond(request, response, status, JSON.stringify(obj), 'application/json');
  }

  // Else, faulure, return message + id
  const obj = {
    message,
    id: status,
  };

  // console.dir(`respondJSON - obj: ${obj.message} id: ${obj.id}`);
  return respond(request, response, status, JSON.stringify(obj), 'application/json');
};

// Constructs an XML response and sends
const respondXML = (request, response, status, message) => {
  // Stringify XML
  let responseXML = '<response>';

  // If successful, return only the message
  if (status === 200) {
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} </response>`;

    // console.dir(`respondXML - responseXML: ${responseXML} status: ${status}`);
    return respond(request, response, status, responseXML, 'text/xml');
  }

  // Else, failure, return message + id
  responseXML = `${responseXML} <message>${message}</message>`;
  responseXML = `${responseXML} <id>${status}</id>`;
  responseXML = `${responseXML} </response>`;

  // console.dir(`respondXML - responseXML: ${responseXML} id: ${status}`);
  return respond(request, response, status, responseXML, 'text/xml');
};

// Determines type and format of a response based on request
const parseResponse = (request, response, acceptedTypes, path, valid = true, loggedIn = true) => {
  // console.dir(`parseResponse(acceptedTypes = ${acceptedTypes})`);
  // console.log(`parseResponse(path = ${path})`);

  // Check if XML is requested
  if (acceptedTypes[0] === 'text/xml') {
    switch (path) {
      case '/success':
        return respondXML(request, response, 200, 'This is a successful response.');
      case '/badRequest':
        if (valid) { return respondXML(request, response, 200, 'This request has the required parameters.'); }
        return respondXML(request, response, 400, 'Missing valid query parameter set to true.');
      case '/unauthorized':
        if (loggedIn) { return respondXML(request, response, 200, 'You have successfully viewed the content.'); }
        return respondXML(request, response, 401, 'Missing loggedIn query parameter set to yes.');
      case '/forbidden':
        return respondXML(request, response, 403, 'You do not have access to this content.');
      case '/internal':
        return respondXML(request, response, 500, 'Internal Server Error. Something went wrong.');
      case '/notImplemented':
        return respondXML(request, response, 501,
          'A get request has not been implemented yet. Check again later for updated content.');
      default:
        return respondXML(request, response, 404, 'The page you are looking for was not found.');
    }
  }

  // Else, respond with JSON
  switch (path) {
    case '/success':
      return respondJSON(request, response, 200, 'This is a successful response.');
    case '/badRequest':
      if (valid) { return respondJSON(request, response, 200, 'This request has the required parameters.'); }
      return respondJSON(request, response, 400, 'Missing valid query parameter set to true.');
    case '/unauthorized':
      if (loggedIn) { return respondJSON(request, response, 200, 'You have successfully viewed the content.'); }
      return respondJSON(request, response, 401, 'Missing loggedIn query parameter set to yes.');
    case '/forbidden':
      return respondJSON(request, response, 403, 'You do not have access to this content.');
    case '/internal':
      return respondJSON(request, response, 500, 'Internal Server Error. Something went wrong.');
    case '/notImplemented':
      return respondJSON(request, response, 501,
        'A get request has not been implemented yet. Check again later for updated content.');
    default:
      return respondJSON(request, response, 404, 'The page you are looking for was not found.');
  }
};

// Checks for request for /badRequest or /unauthorized and parses query parameters
const checkValid = (request, response, pathName, acceptedTypes, bodyParams) => {
  if (pathName === '/badRequest') {
    if (!bodyParams.valid || !bodyParams.valid === 'true') {
      parseResponse(request, response, acceptedTypes, pathName, false);
    } else {
      parseResponse(request, response, acceptedTypes, pathName, true);
    }
  } else if (pathName === '/unauthorized') {
    if (!bodyParams.loggedIn || !bodyParams.loggedIn === 'yes') {
      parseResponse(
        request,
        response,
        acceptedTypes,
        pathName,
        false,
        false,
      );
    } else {
      parseResponse(request, response, acceptedTypes, pathName, false, true);
    }
  } else {
    parseResponse(request, response, acceptedTypes, pathName);
  }
};

// Returns index to the client
const notFound = (request, response) => {
  respond(request, response, 404, index, 'text/html');
};

// Returns css to the client
const getCss = (request, response) => {
  respond(request, response, 200, css, 'text/css');
};

module.exports = {
  notFound,
  getCss,
  checkValid,
};
