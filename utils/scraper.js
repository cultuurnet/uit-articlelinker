const axios = require('axios');
const cheerio = require('cheerio');

/**
  * @desc Promise - gets the meta data from a certain url
  * @param string url - the url which needs to be scraped for meta data
  * @return object - returns object with meta data (title, url)
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
        const meta = {};
        meta.headline = (ogTitle) ? ogTitle : pageTitle;
        meta.url = (canonical) ? canonical : url; 
        meta.text = (ogDescription) ? ogDescription : metaDescription; // if no og:description take meta description
        return meta;
    })
    .catch(function (error) {
        // can't scrape this url
        return error;
    });
};

module.exports = scrapeUrl;

