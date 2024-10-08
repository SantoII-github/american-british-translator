'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      if (req.body.text == "") {
        res.json({ error: 'No text to translate' });
        return;
      } else if (!req.body.text  || !req.body.locale) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      let text = req.body.text;
      let locale = req.body.locale;
      let translation;


      switch(locale) {
        case "american-to-british":
          translation = translator.americanToBritish(text);
          break;
        case "british-to-american":;
          translation = translator.britishToAmerican(text);
          break;
        default:
        	res.json({ error: 'Invalid value for locale field' })
          return;
      }

      if (text === translation) {
        res.json({
          text,
          translation: "Everything looks good to me!"
        });
        return;
      } else {
        res.json({
          text,
          translation
        });
      }
    });
};
