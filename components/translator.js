const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishToAmericanTitles = require("./british-to-american-titles.js");
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
        americanToBritishSpelling
        ]

    translateBritish = [
        this.reverseTranslations(americanOnly),
        britishOnly,
        this.reverseTranslations(americanToBritishSpelling)
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
            const regex = new RegExp(`\\b(${key})\\b`, 'gi');
            translation = translation.replace(regex, (match, p1) => {
                return `<span class="highlight">${this.preserveCase(p1, translationObj[key])}</span>`;
            });
        }
        })

        return translation;
    }

    honorificsToBritish(inputString) {
        // Create a regular expression to match honorifics with an optional trailing period
        const honorificsRegex = new RegExp(`\\b(${Object.keys(americanToBritishTitles).join('|')})\\.?`, 'gi');
      
        // Replace the honorifics using the mapping object and wrap them in a span
        const convertedString = inputString.replace(honorificsRegex, (match) => {
          // Get the British equivalent from the mapping object
          const britishHonorific = americanToBritishTitles[match.toLowerCase()] || match;
          // Wrap the honorific in a span with the highlight class
          // If there was a period, append it outside the span
          return `<span class="highlight">${britishHonorific}</span>${match.endsWith('.') ? '' : '.'}`;
        });
      
        return convertedString;
      }

    honorificsToAmerican(inputString) {
        // Create a regular expression to match honorifics in the input string
        const honorificsRegex = new RegExp(`\\b(${Object.keys(britishToAmericanTitles).join('|')})\\b`, 'gi');
      
        // Replace the honorifics using the mapping object and wrap them in a span
        const convertedString = inputString.replace(honorificsRegex, (match) => {
          // Get the American equivalent from the mapping object
          const americanHonorific = britishToAmericanTitles[match.toLowerCase()] || match;
          return `<span class="highlight">${americanHonorific}</span>`;
        });
      
        return convertedString;
    }
    
    timeToBritish(str) {
        // Replace American time format (HH:MM) with British format (HH.MM)
        return str.replace(/\b(\d{1,2}):(\d{2})\b/g, '<span class="highlight">' + '$1.$2' + '</span>');
    }

    timeToAmerican(str) {
        // Use a regular expression to find time in the British format (HH.MM) and replace it with the American format (HH:MM)
        return str.replace(/\b(\d{1,2})\.(\d{2})\b/g, '<span class="highlight">' + '$1:$2' + '</span>');
    }

    americanToBritish(text) {
        let translated = this.translate(text, this.translateAmerican);
        let honorificsSwapped = this.honorificsToBritish(translated);
        let finalOutput = this.timeToBritish(honorificsSwapped);

        return finalOutput;
    }

    britishToAmerican(text) {
        let translated = this.translate(text, this.translateBritish);
        let honorificsSwapped = this.honorificsToAmerican(translated);
        let finalOutput = this.timeToAmerican(honorificsSwapped);

        return finalOutput;
    }
}

module.exports = Translator;