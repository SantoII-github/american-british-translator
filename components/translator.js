const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    reverseTranslations(translationFile) {
        // Create a new object by swapping keys and values
        const reversed = {};
        for (let key in translationFile) {
            reversed[translationFile[key]] = key;
        }
        return reversed;
      }

    translateAmerican = [
        americanOnly,
        this.reverseTranslations(britishOnly),
        americanToBritishSpelling,
        americanToBritishTitles
        ]

    translateBritish = [
        this.reverseTranslations(americanOnly),
        britishOnly,
        this.reverseTranslations(americanToBritishSpelling),
        this.reverseTranslations(americanToBritishTitles)
        ]

    translate(text, translationsArray)  {
        let translation = text;

        translationsArray.forEach(translationObj => {
            for (let key in translationObj) {
                const regex = new RegExp(`\\b${key}\\b`, 'g');
                translation = translation.replace(regex, translationObj[key]);
            }
        })

        return translation;
    }

    americanToBritish(text) {
        return this.translate(text, this.translateAmerican)
    }

    britishToAmerican(text) {
        return this.translate(text, this.translateBritish)
    }
}

module.exports = Translator;