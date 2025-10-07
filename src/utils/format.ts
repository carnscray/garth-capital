// src/utils/format.ts
export function toTitleCase(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function decodeRegion(slug: string): string {
  return slug.replace('AU-', '') // add more logic here later if needed
}
