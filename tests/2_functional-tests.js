const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    suite('/api/translate route', () => {
        test("Translation with text and locale fields:", (done) => {
            let testData = {
                text: "Mangoes are my favorite fruit.",
                locale: "american-to-british"
            }
            let expectedTranslation = 'Mangoes are my <span class="highlight">favourite</span> fruit.';

            chai
                .request(server)
                .post('/api/translate')
                .send(testData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.text, testData.text);
                    assert.equal(res.body.translation, expectedTranslation);
                    done();
                });
        });

        test("Translation with text and invalid locale field:", (done) => {
            let testData = {
                text: "Ceci n'est pas une pipe",
                locale: 'french-to-american'
            }

            chai
                .request(server)
                .post('/api/translate')
                .send(testData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value for locale field');
                    done();
                });
        });

        test("Translation with missing text field:", (done) => {
            let testData = {
                locale: "american-to-british"
            }

            chai
                .request(server)
                .post('/api/translate')
                .send(testData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test("Translation with missing locale field:", (done) => {
            let testData = {
                text: "Mangoes are my favorite fruit.",
            }

            chai
                .request(server)
                .post('/api/translate')
                .send(testData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test("Translation with empty text:", (done) => {
            let testData = {
                text: "",
                locale: "american-to-british"
            }

            chai
                .request(server)
                .post('/api/translate')
                .send(testData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'No text to translate');
                    done();
                });
        });

        test("Translation with text that needs no translation:", (done) => {
            let testData = {
                text: "I love Pokémon!",
                locale: "american-to-british"
            }

            chai
                .request(server)
                .post('/api/translate')
                .send(testData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.text, testData.text);
                    assert.equal(res.body.translation, 'Everything looks good to me!');
                    done();
                });
        });
    });
});
