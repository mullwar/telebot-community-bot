const t = require("translatte");
const {countryCodeEmoji} = require("country-code-emoji");

const TRANSLATE_TO = "en";

module.exports = {
    translate(value, translateTo = TRANSLATE_TO) {
        return t(value, {to: translateTo}).then(({text, from}) => {
            const iso = from.language.iso;
            if (iso !== translateTo) {
                const icon = countryCodeEmoji(iso);
                return [icon, text].filter(Boolean).join(" ");
            }
            return null;
        })
    }
};