/**
 * @jest-environment node
 */

const scraper = require('../utils/scraper');

describe('Scraper: get meta data from websites', () => {

    test('scraper should return meta object with headline, text, url, favicon properties', () => {
        const url = 'https://thevinylfactory.com/features/the-best-albums-of-2019-so-far/';
        return scraper(url).then( res => {
            const meta = res;
            expect(meta).toMatchObject({ 
                headline: expect.any(String),
                text: expect.any(String),
                url: expect.any(String),
                favicon: expect.any(String)
            });
        });
    });

    test('scraper should return meta object with correct info', () => {
        const url = 'https://thevinylfactory.com/news/radiohead-share-18-hours-ok-computer-sessions-mini-disc-hacked/';
        const correctMeta = {
            headline: 'Radiohead share 18 hours of OK Computer studio sessions',
            text: ".",
            url: 'https://thevinylfactory.com/news/radiohead-share-18-hours-ok-computer-sessions-mini-disc-hacked/',
            favicon: "https://thevinylfactory.com/wp-content/uploads/2017/01/cropped-VFselects-logo-2-1-32x32.png"
        };
        return scraper(url).then( res => {
            const meta = res;
            expect(meta).toMatchObject(correctMeta);
        });
    });


    test('scraper should return meta object with canonical url instead of initial url', () => {
        const url = 'https://amp.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy';
        const canonical = 'https://www.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy';
        return scraper(url).then( res => {
            const meta = res;
            expect(meta.url).toBe(canonical);
        });
    });

    test('scraper should return meta object with stripped url instead of url with params', () => {
        const url = 'https://www.bruzz.be/culture/events-festivals/30-jaar-boterhammen-het-park-met-jari-demeulemeester-muziek-moet-kunnen?fbclid=IwAR0UEuKftZJHXEYOkqKgAy0bXKI7lx83iKNN4k4u1swgnaTn6XAtcEU5gog';
        const strippedUrl = 'https://www.bruzz.be/culture/events-festivals/30-jaar-boterhammen-het-park-met-jari-demeulemeester-muziek-moet-kunnen';
        return scraper(url).then( res => {
            const meta = res;
            expect(meta.url).toBe(strippedUrl);
        });
    });


    test('scraper should throw an error when url is not valid', () => {
        const url = 'https://www.notavalidurl.be';
        return scraper(url)
            .then()
            .catch( err => expect(err).toBeDefined() );
    });

});

