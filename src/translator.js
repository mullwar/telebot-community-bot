const {translate} = require("./translate");

module.exports = {
    id: "telebot-translator",
    name: "Auto Translator",
    version: "1.0.0",
    plugin(bot, config = {}) {
        const {translateTo} = config;
        
        bot.on("text", (msg) => {
            const {
                message_id,
                text,
                chat: {
                    id: chat_id,
                    type
                },
                from: {
                    id: from_id,
                    first_name,
                    last_name,
                    username
                }
            } = msg;

            console.log(`[${type}] ${chat_id}: ${[first_name, last_name, username && `@${username}`]
                .filter(Boolean).join(" ")} (${from_id}) - ${text}`);

            if (!(["group", "supergroup"].includes(type))) return;

            return translate(text, translateTo).then((value) => {
                if (value) {
                    return bot.sendMessage(chat_id, value, {
                        reply_to_message_id: message_id,
                        disable_notification: true,
                        disable_web_page_preview: true
                    });
                }
            });
        });

    }
};