export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(200).send('Telegram webhook endpoint is operational.');
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || '9094282696:AAHHF5Yl3MdsnEKpVJ2BhazDXEqgYxPrAao';
  const webAppUrl = process.env.WEB_APP_URL || 'https://cyber-game-jet.vercel.app/';

  try {
    const update = req.body;

    // Handle pre-checkout query (required for Telegram Stars payments)
    if (update && update.pre_checkout_query) {
      const preCheckoutId = update.pre_checkout_query.id;
      await fetch(`https://api.telegram.org/bot${token}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: preCheckoutId,
          ok: true,
        }),
      });
      return res.status(200).json({ ok: true });
    }

    if (update && update.message && update.message.chat) {
      const chatId = update.message.chat.id;
      const text = update.message.text || '';
      const firstName = update.message.from?.first_name || 'Оператор';

      // Handle successful payment
      if (update.message.successful_payment) {
        const payment = update.message.successful_payment;
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ Оплата подтверждена! На ваш аккаунт зачислено приобретение на сумму ${payment.total_amount} ⭐️ Telegram Stars. Возвращайтесь в Терминал!`,
            reply_markup: {
              inline_keyboard: [
                [{ text: '⚡ Открыть Терминал', web_app: { url: webAppUrl } }],
              ],
            },
          }),
        });
        return res.status(200).json({ ok: true });
      }

      if (text.startsWith('/start')) {
        const welcomeMessage =
          `Добро пожаловать в Cyber Syndicate, ${firstName}.\n\n` +
          `Вы подключились к закрытому терминалу управления синдикатом. ` +
          `Здесь вам предстоит отстраивать собственную серверную базу, развивать добычу ресурсов, ` +
          `вступать в технологические корпорации и соревноваться с другими хакерами в PvP-дуэлях.\n\n` +
          `Для старта нажмите кнопку ниже:`;

        const payload = {
          chat_id: chatId,
          text: welcomeMessage,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '⚡ Войти в Терминал',
                  web_app: { url: webAppUrl },
                },
              ],
            ],
          },
        };

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(200).json({ ok: false, error: error.message });
  }
}
