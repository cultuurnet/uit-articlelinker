/**
 * @jest-environment node
 */

jest.setTimeout(30000);

const articlelinker = require('../index');
const request = require('supertest');
const axios = require('axios');
const config = require('../config.json');
const api = config.api;
const testCdbid = config.testCdbid;

describe('Articlelinker', () => {

  // remove article from curatoren api after test suite
  afterAll(() => {
    return new Promise(done => {
      axios.get(`${api}/news_articles?about=${testCdbid}`)
      .then(function(res){
        const id = res.data['hydra:member'][0].id;
        axios.delete(`${api}/news_articles/${id}`).then(function(){
          done();
        });
      });
    });
  });

  test('should return error message when publisher is NOT valid', done => {
    const testUrl = "https://www.google.be";
    const testCdbid = "a3b43810-5ca0-4565-86de-65d3b69dc764";
    return request(articlelinker)
    .post('/linkArticle')
    .send({
      url: testUrl,
      cdbid: testCdbid 
    })
    .then(function(res){
      expect(res.text).toBe(`No trusted publisher is found for ${testUrl}`);
      done();
    });
  });

  test('should return impossible to scrape when url is NOT valid', done => {
    const testUrl = "https://www.google";
    return request(articlelinker)
    .post('/linkArticle')
    .send({
      url: testUrl
    })
    .then(function(res){
      expect(res.text).toContain('Impossible to scrape');
      done();
    });
  });

  test('should create the article', done => {
    const testUrl = "https://www.bruzz.be/mobiliteit/fietsverpleegster-na-aanrijding-op-haachtsesteenweg-overweeg-droom-op-te-bergen-2019-09";
    const testCdbid = "a3b43810-5ca0-4565-86de-65d3b69dc764";
    return request(articlelinker)
    .post('/linkArticle')
    .send({
      url: testUrl,
      cdbid: testCdbid 
    })
    .then(function(res){
      expect(res.text).toBe(`Created article`);
      done();
    });
  });

  test('should return article already up to date', done => {
    const testUrl = "https://www.bruzz.be/mobiliteit/fietsverpleegster-na-aanrijding-op-haachtsesteenweg-overweeg-droom-op-te-bergen-2019-09";
    return request(articlelinker)
    .post('/linkArticle')
    .send({
      url: testUrl,
      cdbid: testCdbid 
    })
    .then(function(res){
      expect(res.text).toContain('No need for update');
      done();
    });
  });



});