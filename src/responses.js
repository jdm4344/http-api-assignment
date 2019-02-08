const fs = require('fs');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// Constructs a JSON response and sends
const respondJSON = (request, response, status, message) => {
  
  // If successful, return only message
  if(status == 200) {
    const obj = {
      message: message
    };

    return respond(request, response, status, JSON.stringify(obj), "application/json");
  }

  // Else, faulure, return message + id
  const obj = {
    message: message,
    id: status
  };

  return respond(request, response, status, JSON.stringify(obj), "application/json");
};

// Constructs an XML response and sends
const respondXML = (request, response, status, message) => {
  // Stringify XML  
  let responseXML = "<response>";
  
  // If successful, return only the message
  if(status === 200){
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, status, responseXML, "text/xml");
  }

  // Else, failure, return message + id
  responseXML = `${responseXML} <message>${message}</message>`;
  responseXML = `${responseXML} <id>${status}</id>`;
  responseXML = `${responseXML} </response>`;

  return respond(request, response, status, responseXML, "text/xml");
};

// Determines type and format of a response based on request
const parseResponse = (request, response, acceptedTypes, path, valid=false, loggedIn=false) => {
  console.dir("parseResponse(acceptedTypes = " + acceptedTypes + ")");
  console.log("parseResponse(path = " + path + ")");

  // Check if XML is requested
  if(acceptedTypes[0] == "text/xml"){
    switch (path) {
      case "/success":
        return respondXML(request, respond, 200, "Success");
      case "/badrequest":
        if(valid) { return respondXML(request, respond, 200, "Bad Request"); }
        else { return respondXML(request, respond, 400, "Bad Request"); }
      case "/unauthorized":
        if(loggedIn) { return respondXML(request, respond, 200, "Unauthorized"); }
        else { return respondXML(request, respond, 401, "Unauthorized"); }
      case "/forbidden":
        return respondXML(request, respond, 403, "Forbidden");
      case "/internal":
        return respondXML(request, respond, 500, "Internal Server Error");
      case "/notImplemented":
        return respondXML(request, respond, 501, "Not Implemented");
      default:
        return respondXML(request, respond, 404, "Not Found");
    }
  }

  // Else, respond with JSON
  switch (path) {
    case "/success":
      return respondJSON(request, response, 200, "Success");
    case "/badrequest":
      if(valid) { return respondJSON(request, respond, 200, "Bad Request"); }
      else { return respondJSON(request, respond, 400, "Bad Request"); }
    case "/unauthorized":
      if(loggedIn) { return respondJSON(request, respond, 200, "Unauthorized"); }
      else { return respondJSON(request, respond, 401, "Unauthorized"); }
    case "/forbidden":
      return respondJSON(request, respond, 403, "Forbidden");
    case "/internal":
      return respondJSON(request, respond, 500, "Internal Server Error");    
    case "/notImplemented":
      return respondJSON(request, respond, 501, "Not Implemented");      
    default:
      return respondJSON(request, respond, 404, "Not Found");
  }
};

// Returns index to the client
const notFound = (request, response) => {
  respond(request, response, 200, index, 'text/html');
};

// Returns css to the client
const getCss = (request, response) => {
  respond(request, response, 200, css, 'text/css');
};

module.exports = {
  notFound,
  getCss,
  parseResponse,
};
