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

  const jsonFormatRequest = (tokens, req, res) => {
    return JSON.stringify({
        'id': tokens['id'](req, res),
        'request-type': 'request',
        '@timestamp': tokens['date'](req, res, 'iso'),
        'param-url': tokens['param-url'](req, res),
        'param-cdbid': tokens['param-cdbid'](req, res),
        'remoteaddr': tokens['remote-addr'](req, res),
        'method': tokens['method'](req, res),
        'url': tokens['res'](req, res, 'content-length'),
        'referrer': tokens['referrer'](req, res),
        'user-agent': tokens['user-agent'](req, res),
    });
  };

  const jsonFormatResponse = (tokens, req, res) => {
    return JSON.stringify({
        'id': tokens['id'](req, res),
        'request-type': 'response',
        '@timestamp': tokens['date'](req, res, 'iso'),
        'response-message': tokens['response-message'](req, res),
        'remote-address': tokens['remote-addr'](req, res),
        'status': tokens['status'](req, res)
      });
  };

  morgan.token('id',  req => req.id);
  morgan.token('param-url',  (req, res) => req.body.url);
  morgan.token('param-cdbid',  (req, res) => req.body.cdbid);
  morgan.token('response-message',  (req, res) => res.message);

  // log incoming request
  app.use(morgan(jsonFormatRequest, {
    immediate: true,
    stream: accessLogStream
  }));

  // log response
  app.use(morgan(jsonFormatResponse, {
    immediate: false,
    stream: accessLogStream
  }));

};

module.exports = logger;