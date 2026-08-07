export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} e ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} e ${items.at(-1)}`;
}

export function normalizeTextarea(value: string): string {
  return value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  const value = bytes / (1024 * 1024);
  return `${value.toFixed(value >= 10 ? 0 : 1).replace('.', ',')} MB`;
}

export function sanitizeFilename(value: string): string {
  return (value || 'cliente')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'cliente';
}

export function createId(prefix: string): string {
  const random = crypto.getRandomValues(new Uint32Array(2));
  return `${prefix}_${Date.now()}_${random[0].toString(36)}${random[1].toString(36)}`;
}
