import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { action, userId, payload } = req.body || {};
    if (!userId || !action) {
      return res.status(400).json({ error: 'Missing userId or action' });
    }

    if (action === 'complete_stage') {
      const { stageId, starsEarned, earnedMerits, earnedFragments, energySpent } =
        payload || {};

      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('expedition_energy, cyber_merits, fragment_data, expedition_stars')
        .eq('id', userId)
        .single();

      if (userErr || !userRow) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentStars = userRow.expedition_stars || {};
      const updatedStars = {
        ...currentStars,
        [stageId]: Math.max(currentStars[stageId] || 0, Number(starsEarned) || 0),
      };

      const nextEnergy = Math.max(
        0,
        (userRow.expedition_energy ?? 100) - (Number(energySpent) || 0)
      );
      const nextMerits = (userRow.cyber_merits || 0) + (Number(earnedMerits) || 0);
      const nextFragments =
        (userRow.fragment_data || 0) + (Number(earnedFragments) || 0);

      const { error: updateErr } = await supabase
        .from('users')
        .update({
          expedition_energy: nextEnergy,
          cyber_merits: nextMerits,
          fragment_data: nextFragments,
          expedition_stars: updatedStars,
        })
        .eq('id', userId);

      if (updateErr) throw updateErr;

      return res.status(200).json({
        ok: true,
        expeditionEnergy: nextEnergy,
        cyberMerits: nextMerits,
        fragmentData: nextFragments,
        stageStars: updatedStars,
      });
    }

    if (action === 'redeem_shop_item') {
      const { itemId, meritCost, fragmentCost, rewardPayload } = payload || {};

      const [{ data: userRow }, { data: resRow }] = await Promise.all([
        supabase
          .from('users')
          .select('cyber_merits, fragment_data, unlocked_implants, unlocked_decor')
          .eq('id', userId)
          .single(),
        supabase
          .from('resources')
          .select('energy, data, crypto, credits')
          .eq('user_id', userId)
          .single(),
      ]);

      if (!userRow || !resRow) {
        return res.status(404).json({ error: 'User or resources not found' });
      }

      if (
        (userRow.cyber_merits || 0) < meritCost ||
        (userRow.fragment_data || 0) < fragmentCost
      ) {
        return res.status(400).json({ error: 'Insufficient Expedition tokens' });
      }

      const nextImplants = rewardPayload?.implantId
        ? Array.from(new Set([...(userRow.unlocked_implants || []), rewardPayload.implantId]))
        : userRow.unlocked_implants || [];

      const nextDecor = rewardPayload?.decorId
        ? Array.from(new Set([...(userRow.unlocked_decor || []), rewardPayload.decorId]))
        : userRow.unlocked_decor || [];

      await Promise.all([
        supabase
          .from('users')
          .update({
            cyber_merits: userRow.cyber_merits - meritCost,
            fragment_data: userRow.fragment_data - fragmentCost,
            unlocked_implants: nextImplants,
            unlocked_decor: nextDecor,
          })
          .eq('id', userId),
        supabase
          .from('resources')
          .update({
            energy: resRow.energy + (rewardPayload?.energy || 0),
            data: resRow.data + (rewardPayload?.data || 0),
            crypto: resRow.crypto + (rewardPayload?.crypto || 0),
            credits: resRow.credits + (rewardPayload?.credits || 0),
          })
          .eq('user_id', userId),
      ]);

      return res.status(200).json({ ok: true, itemId });
    }

    return res.status(400).json({ error: 'Unsupported expedition action' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Expedition API error' });
  }
}