const {TeleBot} = require("telebot");
const express = require("express");
const autoTranslator = require("./plugins/autoTranslator");

const app = express();
app.use(express.json());

const {
    PORT,
    TELEBOT_TOKEN,
    TELEBOT_WEBHOOK_URL
} = process.env;

const bot = new TeleBot({
    token: TELEBOT_TOKEN,
    allowedUpdates: ["message"]
});

bot.plugin(autoTranslator, {
    translateTo: "en"
});

bot.deleteWebhook().then(() => {
    return bot.setWebhook(`${TELEBOT_WEBHOOK_URL}/bot/${TELEBOT_TOKEN}`, {
        drop_pending_updates: true
    });
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

bot.hears("/delete", (msg) => {
    if (msg?.reply_to_message?.from?.id === bot.me.id) {
        return bot.parallel([
            bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id),
            bot.deleteMessage(msg.chat.id, msg.message_id)
        ]);
    }
});

bot.on("error", (error) => console.error("ERROR", error));

app.post(`/bot/${TELEBOT_TOKEN}`, (request, response) => {
    bot.processTelegramUpdates([request.body]);
    response.sendStatus(200);
});

app.get("/", (request, response) => {
    response.status(301).redirect("https://github.com/mullwar/telebot-community-bot")
});

app.listen(PORT || 80, () => console.log(
    `bot server is started: ${TELEBOT_WEBHOOK_URL}/bot/%TELEBOT_TOKEN%`
));
