const {TeleBot} = require("telebot");
const express = require("express");
const translator = require("./translator");

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

bot.plugin(translator, {
    translateTo: "en"
});

bot.deleteWebhook().then(() => {
    return bot.setWebhook(`${TELEBOT_WEBHOOK_URL}/bot/${TELEBOT_TOKEN}`, {
        drop_pending_updates: true
    });
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
    `bot server ${TELEBOT_WEBHOOK_URL}/bot/%TELEBOT_TOKEN% started`
));
