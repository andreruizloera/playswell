// Generate realistic price history for a card
export function generatePriceHistory(basePrice, days = 90, volatility = 0.04) {
  const data = []
  let price = basePrice * 0.75
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.48) * volatility * price
    price = Math.max(price + change, basePrice * 0.3)
    const volume = Math.floor(Math.random() * 12) + 1
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume,
      high: parseFloat((price * (1 + Math.random() * 0.03)).toFixed(2)),
      low: parseFloat((price * (1 - Math.random() * 0.03)).toFixed(2)),
    })
  }
  return data
}

export const trendingCards = [
  { id: 1, name: 'Charizard Base Set Holo', set: 'Base Set', category: 'pokemon', price: 850, change: 12.4, volume: 38, emoji: '🃏' },
  { id: 7, name: 'Black Lotus Alpha', set: 'Alpha', category: 'mtg', price: 6500, change: 8.1, volume: 4, emoji: '🔮' },
  { id: 3, name: '1952 Topps Mickey Mantle', set: '1952 Topps', category: 'baseball', price: 4200, change: 5.7, volume: 2, emoji: '⚾' },
  { id: 6, name: 'LeBron James Topps Chrome RC', set: '2003 Topps', category: 'basketball', price: 1100, change: -3.2, volume: 15, emoji: '🏀' },
  { id: 11, name: '1st Ed. Base Set Booster Pack', set: 'Base Set 1st Ed.', category: 'pokemon', price: 9500, change: 22.1, volume: 1, emoji: '🃏' },
  { id: 9, name: 'Amazing Fantasy #15 CGC 3.0', set: 'Marvel 1962', category: 'comics', price: 18000, change: 4.3, volume: 1, emoji: '💥' },
]

export const marketOrders = {
  1: {
    bids: [
      { price: 820, quantity: 1, user: 'PokeFan99' },
      { price: 800, quantity: 2, user: 'CardKing' },
      { price: 780, quantity: 1, user: 'HoloHunter' },
      { price: 750, quantity: 3, user: 'VaultPro' },
      { price: 720, quantity: 1, user: 'MintMaster' },
    ],
    asks: [
      { price: 850, quantity: 1, user: 'PokeVault' },
      { price: 875, quantity: 1, user: 'EliteCards' },
      { price: 900, quantity: 2, user: 'GrailHunter' },
      { price: 950, quantity: 1, user: 'TopDeck' },
      { price: 1000, quantity: 1, user: 'SlabKing' },
    ],
  },
}

export const gradingServices = [
  { name: 'PSA', turnaround: '3-6 months', cost: 25, avgGrade: 8.2, popMultiplier: { 9: 2.1, 10: 4.8 } },
  { name: 'BGS', turnaround: '2-4 months', cost: 22, avgGrade: 8.0, popMultiplier: { 9: 1.9, 10: 5.2 } },
  { name: 'CGC', turnaround: '6-8 weeks', cost: 18, avgGrade: 8.4, popMultiplier: { 9: 1.7, 10: 4.1 } },
  { name: 'TAG', turnaround: '8-10 weeks', cost: 30, avgGrade: 8.1, popMultiplier: { 9: 2.3, 10: 6.0 } },
]

export const sealedProducts = [
  {
    id: 1, name: 'Scarlet & Violet Booster Box', set: 'Scarlet & Violet', category: 'pokemon',
    msrp: 144, marketPrice: 165, packs: 36, packCost: 4.58,
    topPulls: [
      { name: 'Charizard ex SAR', pullRate: '1/144', value: 280 },
      { name: 'Umbreon ex SAR', pullRate: '1/144', value: 210 },
      { name: 'Mewtwo ex SAR', pullRate: '1/144', value: 180 },
      { name: 'Pikachu ex SAR', pullRate: '1/180', value: 150 },
    ],
    ev: 142,
  },
  {
    id: 2, name: 'Prismatic Evolutions ETB', set: 'Prismatic Evolutions', category: 'pokemon',
    msrp: 65, marketPrice: 280, packs: 8, packCost: 35,
    topPulls: [
      { name: 'Eevee ex SAR', pullRate: '1/8', value: 180 },
      { name: 'Sylveon ex SAR', pullRate: '1/16', value: 95 },
      { name: 'Umbreon ex SAR', pullRate: '1/16', value: 85 },
    ],
    ev: 260,
  },
  {
    id: 3, name: 'Lorcana Archazia Booster Box', set: 'Archazia\'s Island', category: 'lorcana',
    msrp: 144, marketPrice: 130, packs: 24, packCost: 5.42,
    topPulls: [
      { name: 'Enchanted Elsa', pullRate: '1/96', value: 85 },
      { name: 'Enchanted Moana', pullRate: '1/96', value: 70 },
    ],
    ev: 115,
  },
]

export const portfolioItems = [
  { listingId: 1, quantity: 2, purchasePrice: 700, purchaseDate: '2025-11-15' },
  { listingId: 3, quantity: 1, purchasePrice: 3800, purchaseDate: '2025-09-01' },
  { listingId: 6, quantity: 3, purchasePrice: 950, purchaseDate: '2026-01-10' },
]

export const platformStats = {
  totalVolume: 284750,
  totalListings: 1247,
  activeSellers: 389,
  avgSalePrice: 228,
  weeklyVolume: [
    { week: 'Jan W1', volume: 18200 },
    { week: 'Jan W2', volume: 22400 },
    { week: 'Jan W3', volume: 19800 },
    { week: 'Jan W4', volume: 25100 },
    { week: 'Feb W1', volume: 28900 },
    { week: 'Feb W2', volume: 31200 },
    { week: 'Feb W3', volume: 27600 },
    { week: 'Feb W4', volume: 33400 },
    { week: 'Mar W1', volume: 38100 },
    { week: 'Mar W2', volume: 41800 },
    { week: 'Mar W3', volume: 35900 },
    { week: 'Mar W4', volume: 42750 },
  ],
  categoryBreakdown: [
    { name: 'Pokémon', value: 42, color: '#3B4CCA' },
    { name: 'Sports Cards', value: 28, color: '#1a4a1a' },
    { name: 'LEGO', value: 14, color: '#E3000B' },
    { name: 'MTG', value: 9, color: '#4a1a6b' },
    { name: 'Other', value: 7, color: '#6b7280' },
  ],
}
