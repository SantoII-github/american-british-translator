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

    // These are redundant, but necessary to pass fCC's tests.
    suite('Highlight translation tests', () => {
        test('Highlight translation: "Mangoes are my favorite fruit."', (done) => {
          assert.equal(translator.americanToBritish('Mangoes are my favorite fruit.'), 'Mangoes are my <span class="highlight">favourite</span> fruit.');
          done();
        });
        test('Highlight translation: "I ate yogurt for breakfast."', (done) => {
          assert.equal(translator.americanToBritish('I ate yogurt for breakfast.'), 'I ate <span class="highlight">yoghurt</span> for <span class="highlight">brekky</span>.');
          done();
        });
        test('Highlight translation: "We watched the footie match for a while."', (done) => {
          assert.equal(translator.britishToAmerican('We watched the footie match for a while.'), 'We watched the <span class="highlight">soccer</span> match for a while.');
          done();
        });
        test('Highlight translation: "Paracetamol takes up to an hour to work."', (done) => {
          assert.equal(translator.britishToAmerican('Paracetamol takes up to an hour to work.'), '<span class="highlight">Tylenol</span> takes up to an hour to work.');
          done();
        });
    });
});
