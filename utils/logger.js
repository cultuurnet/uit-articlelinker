const uuidv1 = require('uuid/v1');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const logger = app => {

  // generate unique id to link request with response
  app.use(requestId = (req, res, next) => {
    req.id = uuidv1();
    next();
  });

  // save the logs to the log directory
  const rootdir = path.dirname(require.main.filename); // get the root directory
  const logFileDir = path.join(rootdir, 'log'); // save logs in log folder in root directory

  // create a file stream 
  const accessLogStream = fs.createWriteStream(path.join(logFileDir, 'access.log'), {flags: 'a'});

  morgan.token('id',  req => req.id);
  morgan.token('param-url',  (req, res) => req.body.url);
  morgan.token('param-cdbid',  (req, res) => req.body.cdbid);
  morgan.token('response-message',  (req, res) => res.message);

  // log incoming request
  app.use(morgan('request :id [:date] :param-url :param-cdbid :remote-addr ":method :url HTTP/:http-version" ":referrer" ":user-agent"', {
    immediate: true,
    stream: accessLogStream
  }));

  // log response
  app.use(morgan('response :id [:date] :response-message :remote-addr :status :res[content-length]', {
    immediate: false,
    stream: accessLogStream
  }));



};

module.exports = logger;