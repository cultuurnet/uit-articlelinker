const config = require('../config.json');
const axios = require('axios');

/**
  * @desc makes request to news_articles api 
  * @param {object} res - express res object
  * @param {string} cdbid - id of event
  * @param {string} url - original url of the article 
  * @param {object} meta - meta data (headline, text, url) of the article
*/

const handleArticle = (res, cdbid, meta) => {
    if(!meta.headline || !meta.url || !meta.text){
      res.message = `required meta tags are missing. headline: ${meta.headline}, url: ${meta.url}, text: ${meta.text}`;
      res.status(200).send(res.message);
      return;
    }
    const newsArticleRequest = `${config.api}/news_articles?url=${meta.url}&about=${cdbid}`;
    axios.get(newsArticleRequest)
    .then(function (response) {
        // handle success
        const resData = response.data;
        if(resData["hydra:totalItems"] == 0) {
        // add article
        createArticle(res, cdbid, meta);
        } else {
        // update article
        const existingId = resData["hydra:member"][0].id;
        const needToUpdate = resData["hydra:member"][0].headline !== meta.headline || resData["hydra:member"][0].text !== meta.text;
            if(needToUpdate) {
              updateArticle(res, existingId, cdbid, meta);
            } else {
              res.message = `No need for update: ${existingId}`;
              res.status(200).send(res.message);
            }
        }
    })
    .catch(function (error) {
        // handle error
        res.message = `can't connect to api ${error}`;
        res.status(200).send(res.message);
    });
};

/**
  * @desc get the parameters for the request
  * @param {string} cdbid - id of event
  * @param {object} meta - object containing the meta data of the article
  * @returns {object}
*/

const getCuratorenApiParams = (cdbid, meta) => {
  let params = {
    "headline": meta.headline,
    "inLanguage": "nl",
    "text": meta.text,
    "about": cdbid,
    "publisher": meta.publisher,
    "url": meta.url
  };

  if (meta.favicon) { 
    params.publisherLogo = meta.favicon;
  }

  return params;
};

/**
  * @desc creates an article via the api
  * @param {object} res - express res object
  * @param {string} cdbid - id of event
  * @param {object} meta - meta data (headline, text, url) of the article
*/

const createArticle = (res, cdbid, meta) => {
    axios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: config.api + '/news_articles',
      data: getCuratorenApiParams(cdbid, meta)
    })
    .then( response => {
      res.message = `Created article`;
      res.status(200).send(res.message);
    })
    .catch( error => {
      res.message = `Error while creating article ${error}`;
      res.status(200).send();
    });
  };

/**
  * @desc updates an article via the api
  * @param {object} res - express res object
  * @param {string} id - existing id of the article
  * @param {string} cdbid - id of event
  * @param {object} meta - meta data (headline, text, url) of the article
*/

const updateArticle = (res, id, cdbid, meta) => {
    axios({
      method: 'put',
      headers: { 'content-type': 'application/json' },
      url: config.api + '/news_articles/' + id,
      data: getCuratorenApiParams(cdbid, meta)
    })
    .then( response => {
      res.message = `Updated article ${id}`;
      res.status(200).send(res.message);
    })
    .catch(error => {
      res.message = `Error while updating article ${id}: ${error}`;
      res.status(200).send(res.message);
    });
};



module.exports = handleArticle;