const publishers = require('../publishers.json');
const psl = require('psl');


/**
  * @desc finds out if a publisher is a trusted publihser
  * @param string searchUrl - url which needs to be verified
  * @return array - returns array with trusted publishers
*/

const findPublishers = searchUrl => {
    const searchDomain = getDomainName(searchUrl);
    let publisher = publishers.filter( publisher => publisher.urls.includes(searchDomain) );
    return publisher;
};

/**
  * @desc get a domain name (e.g. http://www.bruzz.be/random-article will return bruzz.be)
  * @param string url - url which needs to be parsed
  * @return string - returns the domain name of a given url
*/

const getDomainName = url => {
    // split the url, only keep first part of url
    url = url.split("/")[2];
    const domainName = psl.parse(url).domain;
    return domainName;
};
  
  
module.exports = findPublishers;