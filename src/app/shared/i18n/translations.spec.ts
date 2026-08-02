import { EN } from './en';
import { PT } from './pt';
import { TRANSLATIONS } from './translations';

/** Returns all leaf key paths of a translation object, e.g. 'nav.projects'. */
function collectLeafPaths(obj: object, prefix = ''): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object') {
      paths.push(...collectLeafPaths(value, path));
    } else {
      paths.push(path);
    }
  }
  return paths;
}

/** Asserts every leaf value in a translation object is a string. */
function expectAllStringValues(obj: object): void {
  for (const value of Object.values(obj)) {
    if (value !== null && typeof value === 'object') {
      expectAllStringValues(value);
    } else {
      expect(typeof value).toBe('string');
    }
  }
}

describe('Translations data consistency', () => {
  it('EN and PT should expose the same keys recursively', () => {
    expect(collectLeafPaths(PT).sort()).toEqual(collectLeafPaths(EN).sort());
  });

  it('every leaf value in EN and PT should be a string', () => {
    expectAllStringValues(EN);
    expectAllStringValues(PT);
  });

  it('TRANSLATIONS should map both languages to their objects', () => {
    expect(TRANSLATIONS.en).toBe(EN);
    expect(TRANSLATIONS.pt).toBe(PT);
  });
});
