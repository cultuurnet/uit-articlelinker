const axios = require('axios');
const cheerio = require('cheerio');

/**
  * @desc Promise - gets the meta data from a certain url
  * @param {string} url - the url which needs to be scraped for meta data
  * @returns {promise} - returns object with meta data (title, url)
*/

const scrapeUrl = url => {
    return axios.get(url)
    .then( res => {
        const $ = cheerio.load(res.data);
        const canonical = $('link[rel="canonical"]').attr('href');
        const metaDescription = $('meta[name="description"]').attr('content');
        const ogDescription = $('meta[property="og:description"]').attr('content');
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const pageTitle = $('title').text();
        const favicon = $('link[rel="icon"]').attr('href');
        const meta = {};
        meta.headline = (ogTitle) ? ogTitle : pageTitle;
        meta.url = (canonical) ? canonical : url; 
        urlParamIndex = meta.url.indexOf('?'); // check if the url has params
        meta.url = (urlParamIndex > -1) ? meta.url.substr(0, urlParamIndex) : meta.url ; // remove params from url
        meta.text = (ogDescription) ? ogDescription : metaDescription; // if no og:description take meta description
        meta.favicon = getFaviconPath(favicon, url);
        return meta;
    })
    .catch(function (error) {
        // can't scrape this url
        return error;
    });
};

/**
  * @desc gets the relative favicon path for a given url
  * @param {string} path - path of favicon
  * @param {string} scrapedUrl - scraped url
  * @returns {string}
*/

const getFaviconPath = (path, scrapedUrl) => {
  if (isRelativePath(path)) {
    return path;
  }else {
    return absoluteToRelativePath(path, scrapedUrl);
  }
};

/**
  * @desc transforms an absolute to a relative path
  * @param {string} abspath - the absolute path which needs to be transformed
  * @param {string} url - scraped url
  * @returns {string}
*/

const absoluteToRelativePath = (abspath, url) => {
  const rootUrl = new URL(url).origin;
  return rootUrl + abspath;
};

/**
  * @desc checks if a path relative
  * @param {string} path - the path which needs to be checked
  * @returns {boolean}
*/

const isRelativePath = path => {
  var regex = new RegExp(/^https?:\/\//i);
  if (regex.test(path)){
    return true;
  }
};

module.exports = scrapeUrl;