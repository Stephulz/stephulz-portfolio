import { EXPERIENCES } from './experience.model';

describe('Experience data', () => {
  it('should have 6 experience entries', () => {
    expect(EXPERIENCES.length).toBe(6);
  });

  it('should be sorted by id in descending order (most recent first)', () => {
    for (let i = 0; i < EXPERIENCES.length - 1; i++) {
      const current = EXPERIENCES.at(i);
      const next = EXPERIENCES.at(i + 1);
      expect(current!.id).toBeGreaterThan(next!.id);
    }
  });

  it('each entry should have all required Experience fields', () => {
    for (const exp of EXPERIENCES) {
      expect(exp).toHaveProperty('id');
      expect(exp).toHaveProperty('company');
      expect(exp).toHaveProperty('role');
      expect(exp).toHaveProperty('rolePt');
      expect(exp).toHaveProperty('period');
      expect(exp).toHaveProperty('periodPt');
      expect(exp).toHaveProperty('description');
      expect(exp).toHaveProperty('descriptionPt');
      expect(exp).toHaveProperty('technologies');
    }
  });

  it('each entry should have a positive integer id', () => {
    for (const exp of EXPERIENCES) {
      expect(Number.isInteger(exp.id)).toBe(true);
      expect(exp.id).toBeGreaterThan(0);
    }
  });

  it('each entry should have a non-empty company name', () => {
    for (const exp of EXPERIENCES) {
      expect(exp.company.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have non-empty role and rolePt', () => {
    for (const exp of EXPERIENCES) {
      expect(exp.role.trim().length).toBeGreaterThan(0);
      expect(exp.rolePt.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have non-empty period and periodPt', () => {
    for (const exp of EXPERIENCES) {
      expect(exp.period.trim().length).toBeGreaterThan(0);
      expect(exp.periodPt.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have non-empty description and descriptionPt', () => {
    for (const exp of EXPERIENCES) {
      expect(exp.description.trim().length).toBeGreaterThan(0);
      expect(exp.descriptionPt.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have at least one technology', () => {
    for (const exp of EXPERIENCES) {
      expect(exp.technologies.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('all technologies should be non-empty strings', () => {
    for (const exp of EXPERIENCES) {
      for (const tech of exp.technologies) {
        expect(typeof tech).toBe('string');
        expect(tech.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('should contain unique company names', () => {
    const companies = EXPERIENCES.map((e) => e.company);
    const unique = new Set(companies);
    expect(unique.size).toBe(companies.length);
  });

  it('should contain unique ids', () => {
    const ids = EXPERIENCES.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('specific entry: Bradesco', () => {
  const bradesco = EXPERIENCES.find((e) => e.company === 'Bradesco');

  it('should exist', () => {
    expect(bradesco).toBeDefined();
  });

  it('should have correct English role', () => {
    expect(bradesco!.role).toBe('Senior Software Engineer');
  });

  it('should have correct Portuguese role', () => {
    expect(bradesco!.rolePt).toBe('Engenheiro de Software Sênior');
  });

  it('should have period marking most recent', () => {
    expect(bradesco!.period).toContain('Present');
    expect(bradesco!.periodPt).toContain('Presente');
  });

  it('should include Angular in technologies', () => {
    expect(bradesco!.technologies).toContain('Angular');
  });

  it('should include Azure in technologies', () => {
    expect(bradesco!.technologies).toContain('Azure');
  });
});

describe('specific entry: Stefanini', () => {
  const stefanini = EXPERIENCES.find((e) => e.company === 'Stefanini');

  it('should exist', () => {
    expect(stefanini).toBeDefined();
  });

  it('should have intern role', () => {
    expect(stefanini!.role).toBe('Intern');
    expect(stefanini!.rolePt).toBe('Estagiário');
  });

  it('should have earliest period', () => {
    expect(stefanini!.period).toBe('2018 - 2019');
  });

  it('should have at least Java and Angular', () => {
    expect(stefanini!.technologies).toContain('Java');
    expect(stefanini!.technologies).toContain('Angular');
  });
});
