/**
 * @jest-environment node
 */

const scraper = require('../utils/scraper');

describe('Scraper: get meta data from websites', () => {

    test('scraper should return meta object with headline, text, url properties', () => {
        const url = 'https://thevinylfactory.com/features/the-best-albums-of-2019-so-far/';
        return scraper(url).then( res => {
            const meta = res;
            expect(meta).toMatchObject({ 
                headline: expect.any(String),
                text: expect.any(String),
                url: expect.any(String)
            });
        });
    });

    test('scraper should return meta object with correct info', () => {
        const url = 'https://thevinylfactory.com/news/radiohead-share-18-hours-ok-computer-sessions-mini-disc-hacked/';
        const correctMeta = {
            headline: 'Radiohead share 18 hours of OK Computer studio sessions',
            text: ".",
            url: 'https://thevinylfactory.com/news/radiohead-share-18-hours-ok-computer-sessions-mini-disc-hacked/'
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


    test('scraper should throw an error when url is not valid', () => {
        const url = 'https://www.notavalidurl.be';
        return scraper(url)
            .then()
            .catch( err => expect(err).toBeDefined() );
    });

});

