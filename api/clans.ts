import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('clans')
      .select('*, clan_members(user_id, role, contributed_credits)')
      .order('total_reputation', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ ok: true, clans: data || [] });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { action, userId, payload } = req.body || {};
    if (!userId || !action) {
      return res.status(400).json({ error: 'Missing userId or action' });
    }

    if (action === 'create_clan') {
      const tag = String(payload?.tag || '')
        .trim()
        .toUpperCase()
        .slice(0, 4);
      const name = String(payload?.name || '').trim();
      const motto = String(payload?.motto || '').trim();

      if (!tag || !name) {
        return res.status(400).json({ error: 'Clan tag and name are required' });
      }

      const { data: resRow, error: resErr } = await supabase
        .from('resources')
        .select('credits')
        .eq('user_id', userId)
        .single();

      if (resErr || !resRow || resRow.credits < 100) {
        return res.status(400).json({ error: 'Requires 100 Credits to charter a Clan' });
      }

      const { data: clanRow, error: clanErr } = await supabase
        .from('clans')
        .insert({
          tag,
          name,
          motto: motto || 'Autonomous grid supremacy.',
          founder_id: userId,
          level: 1,
          treasury_credits: 0,
        })
        .select('*')
        .single();

      if (clanErr || !clanRow) throw clanErr || new Error('Failed to create clan');

      await Promise.all([
        supabase
          .from('resources')
          .update({ credits: resRow.credits - 100 })
          .eq('user_id', userId),
        supabase.from('clan_members').upsert({
          clan_id: clanRow.id,
          user_id: userId,
          role: 'Commander',
          contributed_credits: 100,
        }),
        supabase
          .from('users')
          .update({ syndicate_tag: tag })
          .eq('id', userId),
      ]);

      return res.status(200).json({ ok: true, clan: clanRow });
    }

    if (action === 'join_clan') {
      const clanId = payload?.clanId as string;
      if (!clanId) {
        return res.status(400).json({ error: 'Missing clanId' });
      }

      const { data: clanRow, error: clanErr } = await supabase
        .from('clans')
        .select('id, tag')
        .eq('id', clanId)
        .single();

      if (clanErr || !clanRow) {
        return res.status(404).json({ error: 'Clan not found' });
      }

      await supabase.from('clan_members').delete().eq('user_id', userId);
      await supabase.from('clan_members').insert({
        clan_id: clanId,
        user_id: userId,
        role: 'Operative',
        contributed_credits: 0,
      });

      await supabase
        .from('users')
        .update({ syndicate_tag: clanRow.tag })
        .eq('id', userId);

      return res.status(200).json({ ok: true, clanId });
    }

    if (action === 'contribute_treasury') {
      const clanId = payload?.clanId as string;
      const amount = Number(payload?.amount || 0);
      if (!clanId || amount <= 0) {
        return res.status(400).json({ error: 'Invalid contribution parameters' });
      }

      const [{ data: resRow }, { data: clanRow }] = await Promise.all([
        supabase.from('resources').select('credits').eq('user_id', userId).single(),
        supabase
          .from('clans')
          .select('id, level, treasury_credits')
          .eq('id', clanId)
          .single(),
      ]);

      if (!resRow || resRow.credits < amount) {
        return res.status(400).json({ error: 'Insufficient Credits' });
      }
      if (!clanRow) {
        return res.status(404).json({ error: 'Clan not found' });
      }

      const nextTreasury = (clanRow.treasury_credits || 0) + amount;
      const targetCredits = clanRow.level * 1000;
      const leveledUp = nextTreasury >= targetCredits;

      await Promise.all([
        supabase
          .from('resources')
          .update({ credits: resRow.credits - amount })
          .eq('user_id', userId),
        supabase
          .from('clans')
          .update({
            level: leveledUp ? clanRow.level + 1 : clanRow.level,
            treasury_credits: leveledUp ? nextTreasury - targetCredits : nextTreasury,
          })
          .eq('id', clanId),
      ]);

      return res.status(200).json({
        ok: true,
        leveledUp,
        treasuryCredits: leveledUp ? nextTreasury - targetCredits : nextTreasury,
      });
    }

    return res.status(400).json({ error: 'Unsupported clan action' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Clan endpoint error' });
  }
}