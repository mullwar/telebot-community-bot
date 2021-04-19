const {TeleBot} = require("../../telebot");
const autoTranslator = require("./plugins/autoTranslator");

const {
    PORT,
    TELEBOT_TOKEN,
    TELEBOT_WEBHOOK_URL
} = process.env;

const bot = new TeleBot({
    token: TELEBOT_TOKEN,
    allowedUpdates: ["message"],
    webhook: {
        url: `${TELEBOT_WEBHOOK_URL}/bot`,
        serverHost: "0.0.0.0",
        serverPort: PORT,
        drop_pending_updates: true
    }
});

bot.plugin(autoTranslator, {
    translateTo: "en"
});

bot.on("text", (msg) => {
    const {
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
});

bot.hears("/delete", async (msg) => {
    if (msg?.reply_to_message?.from?.id === bot.me.id) {
        return bot.parallel([
            bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id),
            bot.deleteMessage(msg.chat.id, msg.message_id)
        ]);
    }
});

bot.on("error", (error) => console.error("ERROR", error));

bot.start().then((webhook) => {
    if (webhook) {
        console.log(`bot webhook started on ${webhook.url}`);
    } else {
        console.log("bot started");
    }
});
