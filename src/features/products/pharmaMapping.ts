import type { Product } from './types'

const FACILITIES = [
  { name: 'Serenity Health Clinic', city: 'Śródmieście, Warsaw', street: 'Marszałkowska 34', lat: 52.2298, lon: 21.0118 },
  { name: 'Vitality Medical Center', city: 'Mokotów, Warsaw', street: 'Puławska 112', lat: 52.1897, lon: 21.0328 },
  { name: 'Oasis Medical Institute', city: 'Wola, Warsaw', street: 'Górczewska 88', lat: 52.2345, lon: 20.9752 },
  { name: 'Summit Health Institute', city: 'Praga-Południe, Warsaw', street: 'Grochowska 310', lat: 52.2364, lon: 21.068 },
  { name: 'Prosperity Medical Practice', city: 'Ursynów, Warsaw', street: 'Puławska 456', lat: 52.1502, lon: 21.0526 },
  { name: 'Harmony Healthcare Group', city: 'Żoliborz, Warsaw', street: 'Słowackiego 19', lat: 52.268, lon: 20.982 },
]

export function getFacility(id: number) {
  return FACILITIES[id % FACILITIES.length]
}

export function getCoordinates(id: number): { lat: number; lon: number } {
  const facility = getFacility(id)
  return { lat: facility.lat, lon: facility.lon }
}

export function getKindLabel(id: number): 'Medicine' | 'Vaccine' {
  return id % 3 === 0 ? 'Vaccine' : 'Medicine'
}

export function getDisplayCode(product: Product): string {
  return `${getKindLabel(product.id)} #${(product.id * 8971) % 90000}`
}

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

export function isSuccessful(product: Product): boolean {
  return product.rating >= 4
}

export function getProgress(product: Product): { current: number; total: number } {
  const total = 100 + ((product.id * 131) % 550)
  const current = Math.round(total * Math.min(product.rating / 5, 1))
  return { current, total }
}

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
  const zip = `0${(product.id * 91) % 10}-${String((product.id * 137) % 1000).padStart(3, '0')}`
  return `${facility.street}, ${zip} ${facility.city}`
}

export function getManufacturerColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  const hue = hash % 360
  return `hsl(${hue}, 45%, 25%)`
}

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
