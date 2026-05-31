/**
 * Bulk-imports all LEGO sets from Rebrickable's free CSV download.
 * No API key needed. Loads ~26,939 sets into card_cache, then creates
 * listings for popular/high-value sets.
 *
 * Run: npx ts-node src/db/seed_lego.ts
 */
import { createReadStream } from 'fs'
import { createGunzip } from 'zlib'
import { pool } from '../config/database'
import { config } from 'dotenv'
config()

const SETS_CSV   = '/tmp/lego_sets.csv.gz'
const THEMES_CSV = '/tmp/lego_themes.csv.gz'

// Build theme map: id -> name
async function loadThemes(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const data = await readCSVGz(THEMES_CSV)
  for (const row of data) {
    if (row.id && row.name) map.set(row.id, row.name)
  }
  return map
}

// Simple CSV+gzip reader
function readCSVGz(file: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const rows: Record<string, string>[] = []
    let headers: string[] = []
    let leftover = ''

    const stream = createReadStream(file).pipe(createGunzip())

    stream.on('data', (chunk: Buffer) => {
      const text = leftover + chunk.toString()
      const lines = text.split('\n')
      leftover = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue
        // Simple CSV parse (fields may not contain commas in this dataset)
        const cols = line.split(',')
        if (headers.length === 0) {
          headers = cols.map(h => h.trim())
        } else {
          const row: Record<string, string> = {}
          headers.forEach((h, i) => { row[h] = (cols[i] || '').trim() })
          rows.push(row)
        }
      }
    })
    stream.on('end', () => resolve(rows))
    stream.on('error', reject)
  })
}

// Bulk upsert using COPY-style batching
async function batchUpsert(rows: any[], batchSize = 500) {
  let total = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    // Build multi-row INSERT
    const values: any[] = []
    const placeholders = batch.map((row, j) => {
      const base = j * 8
      values.push(row.id, row.category, row.card_name, row.set_name,
                  row.card_number, row.rarity, row.image_url, JSON.stringify(row.extra))
      return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8},NOW())`
    }).join(',')

    await pool.query(`
      INSERT INTO card_cache
        (id, category, card_name, set_name, card_number, rarity, image_url, extra, fetched_at)
      VALUES ${placeholders}
      ON CONFLICT (id) DO UPDATE SET
        card_name=$3, set_name=$4, card_number=$5, rarity=$6,
        image_url=$7, extra=$8, fetched_at=NOW()
      WHERE card_cache.id = EXCLUDED.id
    `.replace(/\$3,\$4,\$5,\$6,\$7,\$8/,
      // Fix: use EXCLUDED references for the DO UPDATE
      'EXCLUDED.card_name,EXCLUDED.set_name,EXCLUDED.card_number,EXCLUDED.rarity,EXCLUDED.image_url,EXCLUDED.extra'
    ), values)

    total += batch.length
    process.stdout.write(`\r  Inserted ${total.toLocaleString()} / ${rows.length.toLocaleString()} sets...`)
  }
  console.log('')
  return total
}

// Simpler individual upsert for reliability
async function upsertBatch(rows: any[], batchSize = 200) {
  let total = 0
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const row of rows) {
      await client.query(`
        INSERT INTO card_cache
          (id, category, card_name, set_name, card_number, rarity, image_url, extra, fetched_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
        ON CONFLICT (id) DO UPDATE SET
          card_name=EXCLUDED.card_name, set_name=EXCLUDED.set_name,
          card_number=EXCLUDED.card_number, rarity=EXCLUDED.rarity,
          image_url=EXCLUDED.image_url, extra=EXCLUDED.extra, fetched_at=NOW()
      `, [row.id, row.category, row.card_name, row.set_name,
          row.card_number, row.rarity, row.image_url, JSON.stringify(row.extra)])
      total++
      if (total % batchSize === 0) {
        await client.query('COMMIT')
        await client.query('BEGIN')
        process.stdout.write(`\r  Cached ${total.toLocaleString()} / ${rows.length.toLocaleString()} sets...`)
      }
    }
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
  return total
}

// Popular sets to create real listings for (set_num -> price estimate)
const LISTING_PRICES: Record<string, { price: number; condition: string; desc: string }> = {
  '75192-1': { price: 850,  condition: 'New - Sealed',    desc: 'UCS Millennium Falcon. The largest LEGO Star Wars set ever. Factory sealed.' },
  '10294-1': { price: 320,  condition: 'New - Sealed',    desc: 'Titanic. 9,090 pieces. Factory sealed.' },
  '10307-1': { price: 220,  condition: 'New - Sealed',    desc: 'Eiffel Tower. 10,001 pieces — tallest LEGO set ever.' },
  '42083-1': { price: 290,  condition: 'Like New - Complete', desc: 'Bugatti Chiron. Built once, all 3,599 pieces present.' },
  '75257-1': { price: 160,  condition: 'New - Sealed',    desc: 'Millennium Falcon. Factory sealed, minor box wear.' },
  '10261-1': { price: 380,  condition: 'Like New - Complete', desc: 'Roller Coaster. Retired. Complete with all minifigs.' },
  '21037-1': { price: 95,   condition: 'New - Sealed',    desc: 'LEGO House. Exclusive set only available at the LEGO House in Billund.' },
  '75313-1': { price: 700,  condition: 'New - Sealed',    desc: 'UCS AT-AT. 6,785 pieces. Retired Star Wars flagship.' },
  '10300-1': { price: 180,  condition: 'New - Sealed',    desc: 'Back to the Future Time Machine. Retired Icons set.' },
  '10281-1': { price: 110,  condition: 'New - Sealed',    desc: 'Bonsai Tree. Relaxing build, great display piece.' },
  '76178-1': { price: 75,   condition: 'New - Sealed',    desc: 'Daily Bugle. 3,772-piece Spider-Man set.' },
  '43197-1': { price: 65,   condition: 'New - Sealed',    desc: 'The Ice Castle. Disney Princess set.' },
  '75290-1': { price: 130,  condition: 'New - Sealed',    desc: "Mos Eisley Cantina. 3,187 pieces, 21 minifigs." },
  '10276-1': { price: 250,  condition: 'New - Sealed',    desc: 'Colosseum. 9,036 pieces. Retired Icons set.' },
  '71374-1': { price: 95,   condition: 'New - Sealed',    desc: 'Nintendo Entertainment System. Retired.' },
  '21325-1': { price: 280,  condition: 'New - Sealed',    desc: 'Medieval Blacksmith. Retired Ideas set.' },
  '10305-1': { price: 400,  condition: 'New - Sealed',    desc: "Lion Knights' Castle. 4,514 pieces, retired." },
  '70657-1': { price: 85,   condition: 'New - Sealed',    desc: 'NINJAGO City Docks. Retired modular city set.' },
  '71043-1': { price: 480,  condition: 'New - Sealed',    desc: "Hogwarts Castle. 6,020 pieces, retired." },
}

async function seed() {
  console.log('Loading LEGO themes...')
  const themes = await loadThemes()
  console.log(`  Loaded ${themes.size} themes.`)

  console.log('\nReading LEGO sets CSV (~26,939 sets)...')
  const rawSets = await readCSVGz(SETS_CSV)
  console.log(`  Read ${rawSets.length.toLocaleString()} sets.`)

  // Transform to card_cache rows
  const cacheRows = rawSets
    .filter(s => s.set_num && s.name)
    .map(s => {
      const theme = themes.get(s.theme_id) || 'LEGO'
      const imgUrl = s.img_url && s.img_url !== 'None'
        ? s.img_url
        : `https://cdn.rebrickable.com/media/sets/${s.set_num}.jpg`
      return {
        id:          `lego-${s.set_num}`,
        category:    'lego',
        card_name:   s.name,
        set_name:    theme,
        card_number: s.set_num,
        rarity:      s.num_parts ? `${s.num_parts} pieces` : null,
        image_url:   imgUrl,
        extra:       { year: s.year, num_parts: s.num_parts, theme_id: s.theme_id },
      }
    })

  console.log(`\nInserting ${cacheRows.length.toLocaleString()} sets into card_cache...`)
  const total = await upsertBatch(cacheRows)
  console.log(`\n  Done: ${total.toLocaleString()} sets cached.`)

  // Create listings for popular sets
  console.log('\nCreating listings for popular sets...')
  let listed = 0, skipped = 0

  for (const [setNum, meta] of Object.entries(LISTING_PRICES)) {
    const cacheId = `lego-${setNum}`
    const { rows: cached } = await pool.query(
      'SELECT * FROM card_cache WHERE id=$1', [cacheId]
    )
    if (!cached[0]) { console.log(`  SKIP ${setNum} — not in cache`); skipped++; continue }
    const card = cached[0]

    // Skip if already listed
    const { rows: exists } = await pool.query(
      "SELECT id FROM listings WHERE card_id=$1 AND status='active'", [cacheId]
    )
    if (exists.length > 0) { skipped++; continue }

    await pool.query(`
      INSERT INTO listings
        (card_id, card_name, set_name, card_number, category, image_url,
         price, condition, seller_name, seller_email, description, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
      cacheId, card.card_name, card.set_name, card.card_number,
      'lego', card.image_url, meta.price, meta.condition,
      'BrickVault', 'brick@playswell.com', meta.desc,
      [card.set_name, meta.condition.includes('Sealed') ? 'Sealed' : 'Complete'].filter(Boolean),
    ])
    console.log(`  LISTED ${card.card_name} (${card.set_name}) — $${meta.price}`)
    listed++
  }

  const { rows: stats } = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM card_cache WHERE category='lego') AS lego_cached,
      (SELECT COUNT(*) FROM listings WHERE category='lego') AS lego_listings,
      (SELECT COUNT(*) FROM listings) AS total_listings
  `)
  console.log(`
Summary:
  LEGO sets in cache:  ${stats[0].lego_cached.toLocaleString()}
  LEGO listings:       ${stats[0].lego_listings}
  Total listings:      ${stats[0].total_listings}
  `)
  await pool.end()
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })
