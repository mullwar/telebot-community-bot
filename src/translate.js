const t = require("translatte");

const TRANSLATE_TO = "en";
const TRANSLATE_ICONS = {
    ru: "🇷🇺",
    lv: "🇱🇻",
    ua: "🇺🇦",
    uz: "🇺🇿",
    fr: "🇫🇷",
    es: "🇪🇸",
    it: "🇮🇹",
    nl: "🇳🇱"
};

module.exports = {
    translate(value, translateTo = TRANSLATE_TO) {
        return t(value, {to: translateTo}).then(({text, from}) => {
            const iso = from.language.iso;
            if (iso !== translateTo) {
                const icon = TRANSLATE_ICONS[iso];
                return [icon, text].filter(Boolean).join(" ");
            }
            return null;
        })
    }
};