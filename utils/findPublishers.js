const publishers = require('../publishers.json');
const psl = require('psl');


/**
  * @desc finds out if a publisher is a trusted publihser
  * @param string searchUrl - url which needs to be verified
  * @return array - returns array with trusted publishers
*/

const findPublishers = searchUrl => {
    const url = getDomainName(searchUrl);
    let trustedPublishers = publishers.filter( publisher => publisher.urls.includes(url.domain) );
    if(trustedPublishers.length > 0 && trustedPublishers[0].exclude_subdomains){
      trustedPublishers = (trustedPublishers[0].exclude_subdomains.includes(url.subdomain)) ? [] : trustedPublishers;
    }
    return trustedPublishers;
};

/**
  * @desc get a domain name (e.g. http://www.bruzz.be/random-article will return bruzz.be)
  * @param string url - url which needs to be parsed
  * @return string - returns the domain name of a given url
*/

const getDomainName = url => {
    // split the url, only keep first part of url
    url = url.split("/")[2];
    const parsedUrl = psl.parse(url);
    return parsedUrl;
};
  
  
module.exports = findPublishers;