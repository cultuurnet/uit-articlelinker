const uuidv1 = require('uuid/v1');
const morgan = require('morgan');
const path = require('path');
const rfs = require("rotating-file-stream");

const logger = app => {

  // generate unique id to link request with response
  app.use(requestId = (req, res, next) => {
    req.id = uuidv1();
    next();
  });

  // save the logs to the log directory
  const logFileDir = path.join(__dirname, 'log');

  // create a rotating file stream 
  const rotatingLogFile = rfs('requests.log', {
  size: "10MB", // rotates the file when size exceeds 10MB
  path: logFileDir
  });

  morgan.token('id',  req => req.id);
  morgan.token('param-url',  (req, res) => req.body.url);
  morgan.token('param-cdbid',  (req, res) => req.body.cdbid);
  morgan.token('response-message',  (req, res) => res.message);

  // log incoming request
  app.use(morgan('request :id [:date] :param-url :param-cdbid :remote-addr ":method :url HTTP/:http-version" ":referrer" ":user-agent"', {
    immediate: true,
    stream: rotatingLogFile
  }));

  // log response
  app.use(morgan('response :id [:date] :response-message :remote-addr :status :res[content-length]', {
    immediate: false,
    stream: rotatingLogFile
  }));

};

module.exports = logger;