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

    preserveCase(original, translated) {
        if (original === original.toUpperCase()) {
            return translated.toUpperCase();
        } else if (original === original.toLowerCase()) {
            return translated.toLowerCase();
        } else if (original[0] === original[0].toUpperCase()) {
            return translated.charAt(0).toUpperCase() + translated.slice(1);
        }
        return translated; // Return as is for mixed case
    }

    translate(text, translationsArray)  {
        let translation = text;

        translationsArray.forEach(translationObj => {
            for (let key in translationObj) {
                const regex = new RegExp(`\\b(${key})(\\.)?`, 'gi');
                translation = translation.replace(regex, (match, p1, p2) => {
                    return `<span class="highlight">${this.preserveCase(p1, translationObj[key])}</span>${p2 || ''}`;
                });
            };
        })

        return translation;
    }
    
    timeToBritish(str) {
        // Replace American time format (HH:MM) with British format (HH.MM)
        return str.replace(/\b(\d{1,2}):(\d{2})\b/g, '<span class="highlight">' + '$1.$2' + '</span>');
    }

    timeToAmerican(str) {
        // Use a regular expression to find time in the British format (HH.MM) and replace it with the American format (HH:MM)
        return str.replace(/\b(\d{1,2})\.(\d{2})\b/g, '$1:$2');
    }

    americanToBritish(text) {
        return this.timeToBritish(this.translate(text, this.translateAmerican));
    }

    britishToAmerican(text) {
        return this.timeToAmerican(this.translate(text, this.translateBritish));
    }
}

module.exports = Translator;