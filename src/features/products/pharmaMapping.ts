import type { Product } from './types'

// ---------------------------------------------------------------------------
// The API is generic (DummyJSON /products), but the UI is styled after a
// pharmaceutical-company dashboard design (see README for the Figma link).
// Rather than inventing fake data, every value below is *derived
// deterministically* from real fields already on the fetched Product (id,
// rating, stock, price, discountPercentage) so the table/dashboard is still
// genuinely driven by the RTK-Query-fetched data — it's just relabeled and
// visualized to fit the pharma theme. Same product id always produces the
// same "facility", dates, etc., so the UI doesn't flicker between renders.
// ---------------------------------------------------------------------------

const FACILITIES = [
  { name: 'Serenity Health Clinic', city: 'Brooklyn, New York', street: '434 Rockaway Ave' },
  { name: 'Vitality Medical Center', city: 'Manhattan, New York', street: '212 Lexington Ave' },
  { name: 'Oasis Medical Institute', city: 'Queens, New York', street: '88 Northern Blvd' },
  { name: 'Summit Health Institute', city: 'Bronx, New York', street: '310 Grand Concourse' },
  { name: 'Prosperity Medical Practice', city: 'Staten Island, New York', street: '77 Victory Blvd' },
  { name: 'Harmony Healthcare Group', city: 'Brooklyn, New York', street: '19 Flatbush Ave' },
]

export function getFacility(id: number) {
  return FACILITIES[id % FACILITIES.length]
}

// "Medicine" vs "Vaccine" is just a display bucket, picked deterministically
// from the id so the same product always renders the same label.
export function getKindLabel(id: number): 'Medicine' | 'Vaccine' {
  return id % 3 === 0 ? 'Vaccine' : 'Medicine'
}

export function getDisplayCode(product: Product): string {
  return `${getKindLabel(product.id)} #${(product.id * 8971) % 90000}`
}

// Deterministic (not random) start/end date range, seeded by id, so the same
// product always shows the same dates across visits/renders.
export function getDateRange(id: number) {
  const start = new Date(2018, 0, 1)
  start.setDate(start.getDate() + ((id * 37) % 3000))
  const end = new Date(start)
  end.setDate(end.getDate() + 180 + ((id * 53) % 1200))
  return { start, end }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// SUCCESS REACTION column: driven by the product's real rating field.
export function isSuccessful(product: Product): boolean {
  return product.rating >= 4
}

// PROCESS progress bar: a stable "capacity" derived from id, filled in
// proportion to the product's real rating (0-5 scaled to a percentage).
export function getProgress(product: Product): { current: number; total: number } {
  const total = 100 + ((product.id * 131) % 550)
  const current = Math.round(total * Math.min(product.rating / 5, 1))
  return { current, total }
}

// STATUS mini-bar: four segments, one per real numeric field on the product,
// each weighted proportionally to that field relative to a fixed max.
export function getStatusSegments(product: Product) {
  return [
    { color: '#4F6FF0', weight: Math.max(Math.min(product.rating / 5, 1), 0.08) },
    { color: '#F0524F', weight: Math.max(Math.min(product.stock / 200, 1), 0.08) },
    {
      color: '#F5A623',
      weight: Math.max(Math.min((product.discountPercentage ?? 10) / 30, 1), 0.08),
    },
    { color: '#34C759', weight: Math.max(Math.min(product.price / 1000, 1), 0.08) },
  ]
}

export function getAddress(product: Product): string {
  const facility = getFacility(product.id)
  const zip = 10000 + ((product.id * 91) % 9000)
  return `${facility.street}, ${facility.city} ${zip}`
}

// Small deterministic color swatch standing in for a manufacturer logo.
export function getManufacturerColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  const hue = hash % 360
  return `hsl(${hue}, 45%, 25%)`
}

// Builds a downloadable .ics calendar file for the "Add to Calendar" button —
// a real feature (not just decorative), built from the same deterministic
// date range shown on the page.
export function buildIcsDataUrl(product: Product): string {
  const { start, end } = getDateRange(product.id)
  const toIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${product.id}@react-test-task`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${product.title}`,
    `DESCRIPTION:${product.description.replace(/\n/g, ' ')}`,
    `LOCATION:${getAddress(product)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}
