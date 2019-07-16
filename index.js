const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const logger = require('./logger');
const scraper = require('./utils/scraper');
const findPublishers = require('./utils/findPublishers');
const handleArticle = require('./utils/handleArticle');

app.listen(port);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({extended: true})); // support encoded bodies

// set up the logger
logger(app);

app.post('/linkArticle', (req, res) => {

    let url = req.body.url;
    const cdbid = req.body.cdbid;
    
    scraper(url, res)
      .then( response => {
        const meta = response; // get the metadata 
        const foundPublishers = findPublishers(meta.url); // check if publisher is trusted
        if(foundPublishers.length) {
          // trusted publisher
          const foundPublisher = foundPublishers[0];
          meta.publisher = foundPublisher.name;
          // handle article
          handleArticle(res, cdbid, url, meta);
        } else {
          // unknown publisher
          res.message = `No trusted publisher is found for ${meta.url}`;
          res.status(200).send(res.message);
        }
      })
      .catch( err => {
        res.message = `Impossible to scrape url: ${err}`;
        res.status(200).send(res.message);
      });
});






