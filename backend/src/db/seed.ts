/**
 * Seed script — fetches all cards from key Pokemon sets and LEGO sets,
 * caches them in the DB, then creates real listings from them.
 * Run: npm run seed
 */
import { pool } from '../config/database'
import { getPokemonSet } from '../services/cardService'
import { config } from 'dotenv'
config()

// All major Pokemon sets to seed
const POKEMON_SETS = [
  'base1',   // Base Set
  'base2',   // Jungle
  'base3',   // Fossil
  'base4',   // Base Set 2
  'gym1',    // Gym Heroes
  'gym2',    // Gym Challenge
  'neo1',    // Neo Genesis
  'neo2',    // Neo Discovery
  'neo3',    // Neo Revelation
  'neo4',    // Neo Destiny
  'ecard1',  // Expedition
  'ex1',     // Ruby & Sapphire
  'dp1',     // Diamond & Pearl
  'pl1',     // Platinum
  'hgss1',   // HeartGold SoulSilver
  'bw1',     // Black & White
  'xy1',     // XY
  'sm1',     // Sun & Moon
  'swsh1',   // Sword & Shield
  'swsh4',   // Vivid Voltage
  'swsh9',   // Brilliant Stars
  'swsh10',  // Astral Radiance
  'swsh11',  // Lost Origin
  'swsh12',  // Silver Tempest
  'sv1',     // Scarlet & Violet
  'sv2',     // Paldea Evolved
  'sv3',     // Obsidian Flames
  'sv3pt5',  // Pokemon 151
  'sv4',     // Paradox Rift
  'sv5',     // Temporal Forces
  'sv6',     // Twilight Masquerade
  'cel25',   // Celebrations
]

// Representative listings to create from seeded cards (card_id -> price/condition)
const LISTING_SEEDS: Array<{
  card_id: string; price: number; condition: string;
  seller_name: string; seller_email: string; description: string
}> = [
  { card_id:'base1-4',  price:850, condition:'Graded - PSA 9', seller_name:'PokeVault', seller_email:'vault@playswell.com', description:'Base Set Charizard holo rare. PSA 9 Mint.' },
  { card_id:'base1-2',  price:420, condition:'Raw - VG',       seller_name:'WaterVault', seller_email:'water@playswell.com', description:'Base Set Blastoise holo. Solid centering.' },
  { card_id:'base1-15', price:310, condition:'Raw - VG',       seller_name:'GrassVault', seller_email:'grass@playswell.com', description:'Base Set Venusaur holo.' },
  { card_id:'base1-10', price:280, condition:'Raw - VG',       seller_name:'PsychicVault', seller_email:'psychic@playswell.com', description:'Base Set Mewtwo holo.' },
  { card_id:'base1-58', price:320, condition:'Graded - PSA 10', seller_name:'ElitePoke', seller_email:'elite@playswell.com', description:'Base Set Pikachu gem mint.' },
  { card_id:'base1-14', price:220, condition:'Raw - VG',       seller_name:'ElectricSlabs', seller_email:'electric@playswell.com', description:'Base Set Raichu holo.' },
  { card_id:'base1-12', price:185, condition:'Raw - VG',       seller_name:'FireCards', seller_email:'fire@playswell.com', description:'Base Set Ninetales holo.' },
  { card_id:'base1-16', price:165, condition:'Raw - VG',       seller_name:'ElectricSlabs', seller_email:'electric@playswell.com', description:'Base Set Zapdos holo.' },
  { card_id:'base2-3',  price:110, condition:'Raw - VG',       seller_name:'FireCards', seller_email:'fire@playswell.com', description:'Jungle Flareon holo.' },
  { card_id:'base2-4',  price:120, condition:'Raw - VG',       seller_name:'ElectricSlabs', seller_email:'electric@playswell.com', description:'Jungle Jolteon holo.' },
  { card_id:'base2-10', price:95,  condition:'Raw - VG',       seller_name:'BugCards', seller_email:'bug@playswell.com', description:'Jungle Scyther holo.' },
  { card_id:'base3-5',  price:140, condition:'Raw - VG',       seller_name:'GhostPull', seller_email:'ghost@playswell.com', description:'Fossil Gengar holo.' },
  { card_id:'base3-2',  price:130, condition:'Raw - VG',       seller_name:'IceVault', seller_email:'ice@playswell.com', description:'Fossil Articuno holo.' },
  { card_id:'neo1-9',   price:850, condition:'Raw - VG',       seller_name:'LugiaPull', seller_email:'lugia@playswell.com', description:'Neo Genesis Lugia holo. Most valuable vintage non-base card.' },
  { card_id:'neo1-7',   price:550, condition:'Raw - VG',       seller_name:'LugiaPull', seller_email:'lugia@playswell.com', description:'Neo Genesis Ho-Oh holo.' },
  { card_id:'neo3-13',  price:310, condition:'Raw - VG',       seller_name:'DarkVault', seller_email:'dark@playswell.com', description:'Neo Revelation Umbreon holo rare.' },
  { card_id:'neo3-1',   price:220, condition:'Raw - VG',       seller_name:'PsychicVault', seller_email:'psychic@playswell.com', description:'Neo Discovery Espeon holo rare.' },
  { card_id:'sv3pt5-199', price:95, condition:'Raw - VG',      seller_name:'SIRKing', seller_email:'sir@playswell.com', description:'Pokemon 151 Charizard ex SIR.' },
  { card_id:'sv3pt5-193', price:55, condition:'Raw - VG',      seller_name:'SIRKing', seller_email:'sir@playswell.com', description:'Pokemon 151 Mew ex Ultra Rare.' },
  { card_id:'sv3pt5-205', price:75, condition:'Raw - VG',      seller_name:'HyperCards', seller_email:'hyper@playswell.com', description:'Pokemon 151 Mew ex Hyper Rare (Gold).' },
  { card_id:'sv4-199',  price:520, condition:'Graded - PSA 10', seller_name:'SlabKing', seller_email:'slab@playswell.com', description:'Paradox Rift Charizard ex SIR. Gem mint PSA 10.' },
  { card_id:'swsh11-211', price:890, condition:'Graded - PSA 10', seller_name:'AltArtKing', seller_email:'alt@playswell.com', description:'Lost Origin Umbreon VMAX Alt Art. PSA 10.' },
]

async function seed() {
  console.log('Seeding PlaysWell database...\n')

  // 1. Fetch all Pokemon sets
  for (const setId of POKEMON_SETS) {
    process.stdout.write(`Fetching set ${setId}... `)
    try {
      const result = await getPokemonSet(setId)
      console.log(`${result.data.length} cards (${result.fromCache ? 'cached' : 'fresh'})`)
    } catch (err: any) {
      console.log(`SKIP (${err.message})`)
    }
  }

  // 2. Create listings from seed data
  console.log('\nCreating listings...')
  for (const seed of LISTING_SEEDS) {
    // Get card data from cache
    const { rows } = await pool.query('SELECT * FROM card_cache WHERE id=$1', [seed.card_id])
    if (!rows[0]) { console.log(`  SKIP ${seed.card_id} — not in cache`); continue }
    const card = rows[0]

    // Check if listing already exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM listings WHERE card_id=$1 AND seller_email=$2',
      [seed.card_id, seed.seller_email]
    )
    if (existing.length > 0) { console.log(`  EXISTS ${card.card_name}`); continue }

    await pool.query(`
      INSERT INTO listings
        (card_id, card_name, set_name, card_number, category, image_url,
         price, condition, seller_name, seller_email, description, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
      seed.card_id, card.card_name, card.set_name, card.card_number,
      card.category, card.image_url, seed.price, seed.condition,
      seed.seller_name, seed.seller_email, seed.description,
      [card.rarity, card.set_name].filter(Boolean),
    ])
    console.log(`  LISTED ${card.card_name} (${card.set_name}) — $${seed.price}`)
  }

  const { rows: stats } = await pool.query('SELECT COUNT(*) as cards FROM card_cache')
  const { rows: lstats } = await pool.query('SELECT COUNT(*) as listings FROM listings')
  console.log(`\nDone! ${stats[0].cards} cards cached, ${lstats[0].listings} listings active.`)

  await pool.end()
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })
