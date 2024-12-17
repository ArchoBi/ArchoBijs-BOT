require('dotenv').config();
const { Bot } = require('grammy');

// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на токен вашего бота
const bot = new Bot(process.env.BOT_API_KEY);


bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать! Введите сумму займа и срок в днях через запятую: сумма, срок.');
});

bot.on('message', (ctx) => {
    const text = ctx.message.text;

    // Проверка на ввод суммы и срока
    const match = text.match(/(\d+),\s*(\d+)/);

    if (match) {
        const amount = Number(match[1]);
        const days = Number(match[2]);

        if (!isValidInput(amount, days)) {
            ctx.reply('Пожалуйста, введите корректные значения суммы (до 10,000 руб.) и срока (до 30 дней).');
            return;
        }

        const totalDebt = calculateTotalDebt(amount, days);
        const reply = `Сумма займа: ${amount} руб.\nСрок: ${days} дней\nОбщая сумма к оплате: ${totalDebt.toFixed(2)} руб.`;
        ctx.reply(reply);
    } else {
        ctx.reply('Я не понимаю тебя! Чё тебе надо?');
        ctx.replyWithSticker('CAACAgIAAxkBAAEK_IxnYYDeikRwjcwaMOEnabsaO10MGwACvUQAAluIyElShhp2T_ek5jYE');
    }
});

function isValidInput(amount, days) {
    return !isNaN(amount) && !isNaN(days) && amount > 0 && amount <= 10000 && days > 0 && days <= 30;
}

function calculateTotalDebt(amount, days) {
    return amount * Math.pow(1.01, days);
}

// Запускаем бот
bot.start();
