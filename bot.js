const {TeleBot} = require("telebot");
const translate = require("translation-google");

const {
    TELEBOT_TOKEN: TOKEN,
    TELEBOT_URL: URL,
    TELEBOT_HOST: HOST,
    PORT
} = process.env;

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

const bot = new TeleBot({
    token: TOKEN,
    webhook: {
        url: URL,
        host: HOST,
        port: PORT
    },
    allowedUpdates: ["message"]
});

bot.on("text", (message) => {
    const {
        message_id,
        text,
        chat: {
            id: chat_id
        },
        from: {
            id: from_id,
            first_name
        }
    } = message;

    console.log(`${chat_id}: ${first_name} (${from_id}) - ${text}`);

    return translate(text, {to: TRANSLATE_TO}).then(({text, from}) => {
        const iso = from.language.iso;
        if (iso !== TRANSLATE_TO) {
            const icon = TRANSLATE_ICONS[iso] || "";
            return bot.sendMessage(chat_id, `${icon} ${text}`, {
                reply_to_message_id: message_id,
                disable_notification: true,
                disable_web_page_preview: true
            });
        }
    });
});

bot.deleteWebhook().then(() => {
    bot.start();
});

