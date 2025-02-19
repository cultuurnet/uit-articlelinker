/**
 * @jest-environment node
 */

const scraper = require('../utils/scraper');

describe('Scraper: get meta data from websites', () => {

    test('scraper should return meta object with headline, text, url, favicon properties', () => {
        const url = 'https://amp.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy';
        return scraper(url).then(res => {
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
        const url = 'https://amp.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy';
        const correctMeta = {
            headline: 'Google workers can listen to what people say to its AI home devices',
            "text": "Company admitted that contractors can access recordings made by Assistant, after some of its recordings were leaked",
            "url": "https://www.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy",
            "favicon": "https://static.guim.co.uk/images/favicon-32x32.ico",
        };
        return scraper(url).then(res => {
            const meta = res;
            expect(meta).toMatchObject(correctMeta);
        });
    });

    test('scraper should return the relative path of favicon', () => {
        const url = 'https://www.gva.be/cnt/DMF20191003_04642727';
        const favicon = 'https://www.gva.be/favicon.svg';
        return scraper(url).then(res => {
            const meta = res;
            expect(meta.favicon).toContain(favicon);
        });
    });


    test('scraper should return meta object with canonical url instead of initial url', () => {
        const url = 'https://amp.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy';
        const canonical = 'https://www.theguardian.com/technology/2019/jul/11/google-home-assistant-listen-recordings-users-privacy';
        return scraper(url).then(res => {
            const meta = res;
            expect(meta.url).toBe(canonical);
        });
    });

    test('scraper should return meta object with stripped url instead of url with params', () => {
        const url = 'https://www.bruzz.be/culture/events-festivals/30-jaar-boterhammen-het-park-met-jari-demeulemeester-muziek-moet-kunnen?fbclid=IwAR0UEuKftZJHXEYOkqKgAy0bXKI7lx83iKNN4k4u1swgnaTn6XAtcEU5gog';
        const strippedUrl = 'https://www.bruzz.be/culture/events-festivals/30-jaar-boterhammen-het-park-met-jari-demeulemeester-muziek-moet-kunnen';
        return scraper(url).then(res => {
            const meta = res;
            expect(meta.url).toBe(strippedUrl);
        });
    });

    test('scraper should throw an error when url is not valid', () => {
        const url = 'https://www.notavalidurl.be';
        return scraper(url)
            .then()
            .catch(err => expect(err).toBeDefined());
    });

});
