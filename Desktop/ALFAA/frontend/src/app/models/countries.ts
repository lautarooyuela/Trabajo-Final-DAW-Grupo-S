export interface Country {
  code: string;           // ISO 3166-1 alpha-2 (ES, US, AR, MX, etc.)
  dialCode: string;       // Código telefónico (+34, +1, +54, +52, etc.)
  name: string;           // Nombre del país
  flag: string;           // Emoji de bandera
  format?: string;        // Formato de ejemplo (opcional)
}

export const COUNTRIES: Country[] = [
  // Principales países hispanohablantes y otros
  { code: 'ES', dialCode: '34', name: 'España', flag: '🇪🇸', format: '+34 XXX XX XX XX' },
  { code: 'MX', dialCode: '52', name: 'México', flag: '🇲🇽', format: '+52 XX XXXX XXXX' },
  { code: 'AR', dialCode: '54', name: 'Argentina', flag: '🇦🇷', format: '+54 9 XXXX XXXXXX' },
  { code: 'CO', dialCode: '57', name: 'Colombia', flag: '🇨🇴', format: '+57 XXX XXXXXX' },
  { code: 'PE', dialCode: '51', name: 'Perú', flag: '🇵🇪', format: '+51 9 XXXXXXXX' },
  { code: 'CL', dialCode: '56', name: 'Chile', flag: '🇨🇱', format: '+56 9 XXXX XXXX' },
  { code: 'VE', dialCode: '58', name: 'Venezuela', flag: '🇻🇪', format: '+58 XXX XXXXXX' },
  { code: 'EC', dialCode: '593', name: 'Ecuador', flag: '🇪🇨', format: '+593 9 XXXXXXXX' },
  { code: 'BO', dialCode: '591', name: 'Bolivia', flag: '🇧🇴', format: '+591 XXXXXXXX' },
  { code: 'PY', dialCode: '595', name: 'Paraguay', flag: '🇵🇾', format: '+595 9 XXXXXXXX' },
  { code: 'UY', dialCode: '598', name: 'Uruguay', flag: '🇺🇾', format: '+598 9 XXXXXXXX' },
  { code: 'CU', dialCode: '53', name: 'Cuba', flag: '🇨🇺', format: '+53 XXXXXXXX' },
  { code: 'DO', dialCode: '1', name: 'República Dominicana', flag: '🇩🇴', format: '+1 XXX XXX XXXX' },
  
  // Otros países
  { code: 'US', dialCode: '1', name: 'Estados Unidos', flag: '🇺🇸', format: '+1 XXX XXX XXXX' },
  { code: 'BR', dialCode: '55', name: 'Brasil', flag: '🇧🇷', format: '+55 XX XXXXX XXXX' },
  { code: 'PT', dialCode: '351', name: 'Portugal', flag: '🇵🇹', format: '+351 XXX XXX XXX' },
  { code: 'FR', dialCode: '33', name: 'Francia', flag: '🇫🇷', format: '+33 X XX XX XX XX' },
  { code: 'DE', dialCode: '49', name: 'Alemania', flag: '🇩🇪', format: '+49 XXX XXXXXXXX' },
  { code: 'IT', dialCode: '39', name: 'Italia', flag: '🇮🇹', format: '+39 XXX XXXXXX' },
  { code: 'GB', dialCode: '44', name: 'Reino Unido', flag: '🇬🇧', format: '+44 XXXX XXXXXX' },
];

export function getCountryByDialCode(dialCode: string): Country | undefined {
  return COUNTRIES.find(c => c.dialCode === dialCode);
}

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}
