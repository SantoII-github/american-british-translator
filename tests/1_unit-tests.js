const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const americanTestStrings = require('./american-test-strings.js');
const britishTestStrings = require('./british-test-strings.js');

suite('Unit Tests', () => {
    let translator = new Translator();

    suite("americanToBritish() tests", () => {
        for (let string in americanTestStrings) {
            test(`Test String: "${string}"`, (done) => {
                assert.equal(translator.americanToBritish(string), americanTestStrings[string]);
                done();
            });
        }
    });

    suite("britishToAmerican() tests", () => {
        for (let string in britishTestStrings) {
            test(`Test String: "${string}"`, (done) => {
                assert.equal(translator.britishToAmerican(string), britishTestStrings[string]);
                done();
            });
        }
    });
});
