export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || '9094282696:AAHHF5Yl3MdsnEKpVJ2BhazDXEqgYxPrAao';

  try {
    const { title, description, stars, payload } = req.body;

    if (!title || !stars) {
      return res.status(400).json({ error: 'Missing required invoice parameters' });
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/createInvoiceLink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description: description || `Cyber Syndicate bundle: ${title}`,
        payload: payload || JSON.stringify({ item: title, stars }),
        provider_token: '', // Empty for Telegram Stars (XTR)
        currency: 'XTR',
        prices: [{ label: title, amount: parseInt(stars, 10) }],
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: data.description || 'Failed to create invoice' });
    }

    return res.status(200).json({ ok: true, invoiceLink: data.result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
