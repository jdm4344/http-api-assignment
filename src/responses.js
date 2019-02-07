const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const respond = (request, response, content, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html');
};

const jsonSuccess = () => {

};

const jsonFailure = () => {

};

const xmlSuccess = () => {

};

const xmlFailure = () => {

};

const getCss = (request, response) => {
  const page = fs.readFileSync(`${__dirname}/../client/style.css`);
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(page);
  response.end();
};

module.exports = {
  getIndex,
  getCss,
  jsonSuccess,
  jsonFailure,
  xmlSuccess,
  xmlFailure,
};