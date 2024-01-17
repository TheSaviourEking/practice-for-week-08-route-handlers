const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

      // define route handlers here
      // GET /
      if (req.method === 'GET' && req.url === '/') {
	  res.statusCode = 200;
	  res.setHeader('content-Type', 'text/plain');
	  return res.end('Dog Club');
      }

      // GET /dogs
      if (req.method === 'GET' && req.url === '/dogs') {
	  res.statusCode = 200;
	  res.setHeader('content-Type', 'text/plain');
	  return res.end('Dog Index');
      }

      // /dogs/:dogid
      if (req.method === 'GET' && req.url.startsWith('/dogs')){
	  const reqArr = req.url.split('/');
	  if (reqArr.length === '/shapes/:shapeName'.split('/').length) {
	  res.statusCode = 200;
	      res.setHeader('content-Type', 'text/plain');
	      if (!Number(reqArr.slice(-1))) {
		  // dog create form
		  // GET /dogs/new
		  return res.end('Dog create form page');
	      }
	      return res.end('dog details for ' + reqArr.slice(-1));
	  }
      }

      // POST /dogs
      if (req.method === 'POST' && req.url === '/dogs') {
	  res.statusCode = 302;
	  res.setHeader('Location', `/dogs/${getNewDogId()}`);
	  return res.end();
      }

      // POST /dogs/:dogId
      if (req.method === 'POST' && req.url.startsWith('/dogs')) {
	  const reqArr = req.url.split('/');
	  if (reqArr.length === '/dogs/:dogId'.split('/').length) {
	      res.statusCode = 302;
	      res.setHeader('Location', `/dogs/${reqArr.slice(-1)}`);
	      return res.end();
	  }
      }

      // GET /dogs/:dogId/edit
      if (req.method === 'GET' && req.url.startsWith('/dogs')) {
	  const reqArr = req.url.split('/');
	  if (reqArr.slice(-1) == 'edit'){
	      res.statusCode = 200;
	      res.setHeader('content-Type', 'text/plain');
	      return res.end('dog edit form page for ' + reqArr[2]);
	  }
      }
     
    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
