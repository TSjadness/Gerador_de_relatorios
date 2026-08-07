export const CNPJ_BASE_LENGTH = 12;
export const CNPJ_CHECK_DIGITS_LENGTH = 2;
export const CNPJ_LENGTH = CNPJ_BASE_LENGTH + CNPJ_CHECK_DIGITS_LENGTH;

export function normalizeCnpj(value: string): string {
  const characters = value.toLocaleUpperCase('pt-BR').replace(/[^A-Z0-9]/g, '');
  const base = characters.slice(0, CNPJ_BASE_LENGTH);
  const checkDigits = characters.slice(CNPJ_BASE_LENGTH).replace(/\D/g, '').slice(0, CNPJ_CHECK_DIGITS_LENGTH);
  return `${base}${checkDigits}`;
}

export function maskCnpj(value: string): string {
  const characters = normalizeCnpj(value);
  if (characters.length <= 2) return characters;
  if (characters.length <= 5) return `${characters.slice(0, 2)}.${characters.slice(2)}`;
  if (characters.length <= 8) return `${characters.slice(0, 2)}.${characters.slice(2, 5)}.${characters.slice(5)}`;
  if (characters.length <= 12) return `${characters.slice(0, 2)}.${characters.slice(2, 5)}.${characters.slice(5, 8)}/${characters.slice(8)}`;
  return `${characters.slice(0, 2)}.${characters.slice(2, 5)}.${characters.slice(5, 8)}/${characters.slice(8, 12)}-${characters.slice(12)}`;
}

function characterValue(character: string): number {
  return character.charCodeAt(0) - 48;
}

function calculateCheckDigit(base: string, weights: number[]): number {
  const total = base.split('').reduce((sum, character, index) => sum + characterValue(character) * weights[index], 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const characters = normalizeCnpj(value);
  if (!/^[A-Z0-9]{12}\d{2}$/.test(characters)) return false;
  if (/^(\d)\1{13}$/.test(characters)) return false;

  const base = characters.slice(0, CNPJ_BASE_LENGTH);
  const firstDigit = calculateCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateCheckDigit(`${base}${firstDigit}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return characters.slice(CNPJ_BASE_LENGTH) === `${firstDigit}${secondDigit}`;
}

export function isAlphanumericCnpj(value: string): boolean {
  const characters = normalizeCnpj(value);
  return characters.length === CNPJ_LENGTH && /[A-Z]/.test(characters.slice(0, CNPJ_BASE_LENGTH));
}

export function normalizeFullName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleUpperCase('pt-BR');
}

export function formatCnpjRoot(value: string): string {
  const characters = normalizeCnpj(value);
  if (characters.length < 8) return '';
  const root = characters.slice(0, 8);
  return `${root.slice(0, 2)}.${root.slice(2, 5)}.${root.slice(5, 8)}`;
}

export function buildAutomaticCompanyName(cnpj: string, name: string): string {
  const characters = normalizeCnpj(cnpj);
  const normalizedName = normalizeFullName(name);
  if (characters.length !== CNPJ_LENGTH || normalizedName.split(' ').filter(Boolean).length < 2) return '';
  return `${formatCnpjRoot(characters)} ${normalizedName}`;
}
