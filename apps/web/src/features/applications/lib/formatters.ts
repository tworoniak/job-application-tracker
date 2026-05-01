import type { SalaryType } from '../types'

export const formatDate = (
  iso: string | null,
  style: 'short' | 'long' = 'short',
): string | null => {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export const formatSalary = (
  min: number | null,
  max: number | null,
  type: SalaryType | null,
  style: 'compact' | 'full' = 'compact',
): string | null => {
  if (!min && !max) return null
  if (type === 'HOURLY') {
    const fmt = (n: number) => `$${n % 1 === 0 ? n : n.toFixed(2)}/hr`
    if (min && max) return `${fmt(min)}${style === 'full' ? ' – ' : '–'}${fmt(max)}`
    if (min) return `${fmt(min)}+`
    return `${style === 'full' ? 'Up to' : 'up to'} ${fmt(max!)}`
  }
  if (style === 'full') {
    const fmt = (n: number) => `$${n.toLocaleString()}`
    if (min && max) return `${fmt(min)} – ${fmt(max)}`
    return min ? `${fmt(min)}+` : `Up to ${fmt(max!)}`
  }
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  return min ? `${fmt(min)}+` : `up to ${fmt(max!)}`
}
