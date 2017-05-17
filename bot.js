const TeleBot = require('telebot');
const translate = require('google-translate-api');

const {
    TELEBOT_TOKEN: TOKEN,
    TELEBOT_URL: URL,
    TELEBOT_HOST: HOST,
    TELEBOT_PORT: PORT,
} = process.env;

const TRANSLATE_TO = 'en';
const TRANSLATE_ICONS = {
    ru: '🇷🇺', lv: '🇱🇻', ua: '🇺🇦', uz: '🇺🇿', fr: '🇫🇷',
    es: '🇪🇸', it: '🇮🇹', nl: '🇳🇱'
};

const bot = new TeleBot({
    token: TOKEN,
    url: URL,
    host: HOST,
    port: PORT
});

bot.on('text', (msg) => {

    const text = msg.text;
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    console.log('+', chatId, messageId, text);

    return translate(text, {to: TRANSLATE_TO}).then((response) => {

        const translatedText = response.text;
        const languageId = response.from.language.iso;

        if (languageId !== TRANSLATE_TO) {

            const languageIcon = TRANSLATE_ICONS[languageId] || '';

            return bot.sendMessage(chatId, `${languageIcon} ${translatedText}`, {
                reply: messageId,
                preview: false
            });
            
        }

    });

});

bot.start();
