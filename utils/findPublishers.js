const publishers = require('../publishers.json');
const psl = require('psl');

/**
  * @desc finds out if a publisher is a trusted publihser
  * @param string searchUrl - url which needs to be verified
  * @return array - returns array with trusted publishers
*/

const findPublishers = searchUrl => {
    if(isHomePage(searchUrl)){
      return []; // an article posted on a homepage of a publisher is NOT considered a trusted publisher
    }
    const url = getDomainName(searchUrl);
    let trustedPublishersArr = publishers.filter( publisher => publisher.urls.includes(url.domain) );
    const trustedPublisher = trustedPublishersArr[0];
    let blacklisted = false;
    if(trustedPublishersArr.length > 0){
      blacklisted = isBlackListedUrl(searchUrl, trustedPublisher);  // Check if url is blacklisted
      trustedPublishersArr = (blacklisted) ? [] : trustedPublishersArr; // reset the trustedPublishersArr if the url is blacklisted
    }
    return trustedPublishersArr;
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

/**
  * @desc check if a url is blacklisted by a publisher
  * @param string scrapedUrl - url which was scraped 
  * @param object publisher 
  * @return bool - returns if the scrapedUrl is blacklisted
*/

const isBlackListedUrl = (scarpedUrl, publisher) => {
  var blacklisted = publisher.blacklisted_urls.some( blacklistedUrl => {
    return scarpedUrl.indexOf(blacklistedUrl) > -1;
  });
  return blacklisted;
};

/**
  * @desc check if url is homepage
  * @param string url - url which needs to be checked
  * @param publisher url - url which needs to be parsed
  * @return bool - returns if the url is a homepage
*/

const isHomePage = url => {
  var urlPath = new URL(url).pathname;
  if(urlPath.length <= 1){
    return true;
  }
};

module.exports = findPublishers;