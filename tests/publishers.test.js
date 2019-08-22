const findPublishers = require('../utils/findPublishers');

describe('findPublishers: check if a publisher is trusted or not', () => {

    test('bruzz.be should be a trusted publisher', () => {
        const articleUrl = "https://www.bruzz.be/mobiliteit/billy-bike-breidt-uit-naar-10-extra-gemeentes-2019-07-12";
        const publishers = findPublishers(articleUrl);
        expect(publishers.length).toBeTruthy();
    });

    test('an article of bruzz.be should return the correct trusted publisher', () => {
        const articleUrl = "https://bruzz.be/en/uit/eat-drink/cafe-flora-road-memphis-2019-07-12";
        const publishers = findPublishers(articleUrl);
        const foundPublisherName = publishers[0].name.toLowerCase();
        expect(foundPublisherName).toEqual('bruzz');
    });

    test('an article posted on a excluded subdomain is NOT considered a trusted publisher', () => {
        const articleUrl = "https://admin.bruzz.be/en/uit/eat-drink/cafe-flora-road-memphis-2019-07-12";
        const publishers = findPublishers(articleUrl);
        expect(publishers.length).toBeFalsy();
    });

    test('an article posted on a excluded subdomain is NOT considered a trusted publisher', () => {
        const articleUrl = "https://stag.bruzz.be/economie/brussel-bij-aantrekkelijkste-europese-steden-voor-start-ups-2019-08-21 b323a3c9-e897-4114-a6f9-68ea4ec9acbd";
        const publishers = findPublishers(articleUrl);
        expect(publishers.length).toBeFalsy();
    });

    test('an article posted on a excluded subdomain is NOT considered a trusted publisher', () => {
        const articleUrl = "https://staging.bruzz.be/en/uit/eat-drink/cafe-flora-road-memphis-2019-07-12";
        const publishers = findPublishers(articleUrl);
        expect(publishers.length).toBeFalsy();
    });

    test('thevinylfactory.be should not be a trusted publisher', () => {
        const articleUrl = "https://thevinylfactory.com/features/the-best-albums-of-2019-so-far/";
        const publishers = findPublishers(articleUrl);
        expect(publishers.length).toBeFalsy();
    });


});

