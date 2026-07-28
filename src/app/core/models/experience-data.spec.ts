import type { Experience } from './experience.model';

const TEST_EXPERIENCES: Experience[] = [
  {
    id: 6,
    company: 'Bradesco',
    role: 'Senior Systems Analyst',
    rolePt: 'Analista de Sistemas Sênior',
    period: '2024 - Present',
    periodPt: '2024 - Presente',
    description:
      'Designing and maintaining enterprise-scale banking systems. Leading modernization initiatives, migrating legacy monoliths to microservices architecture, and ensuring high availability for critical financial applications.',
    descriptionPt:
      'Projetando e mantendo sistemas bancários em escala empresarial. Liderando iniciativas de modernização, migrando monólitos legados para arquitetura de microsserviços e garantindo alta disponibilidade para aplicações financeiras críticas.',
    technologies: ['Java', 'Spring Boot', 'Angular', 'SQL', 'Azure'],
  },
  {
    id: 5,
    company: 'Confitec',
    role: 'Senior Full Stack Developer',
    rolePt: 'Desenvolvedor Full Stack Sênior',
    period: '2022 - 2024',
    periodPt: '2022 - 2024',
    description:
      'Worked on insurance and financial software solutions. Built responsive frontends, developed backend microservices, and participated in the full software development lifecycle using agile methodologies.',
    descriptionPt:
      'Trabalhou em soluções de software para seguros e finanças. Construiu interfaces responsivas, desenvolveu microsserviços backend e participou de todo o ciclo de desenvolvimento de software usando metodologias ágeis.',
    technologies: ['Java', 'Spring Boot', 'React', 'SQL', 'AWS'],
  },
  {
    id: 4,
    company: 'VMBears',
    role: 'Mid-Level Full Stack Developer',
    rolePt: 'Desenvolvedor Full Stack Pleno',
    period: '2021 - 2022',
    periodPt: '2021 - 2022',
    description:
      'Developed scalable web applications for the life insurance sector. Collaborated in agile squads to deliver features from concept to production, focusing on performance optimization and clean architecture.',
    descriptionPt:
      'Desenvolveu aplicações web escaláveis para o setor de seguros de vida. Colaborou em squads ágeis para entregar funcionalidades do conceito à produção, com foco em otimização de performance e arquitetura limpa.',
    technologies: ['Java', 'Spring Boot', 'React', 'SQL', 'GCP'],
  },
  {
    id: 3,
    company: 'AN GLOBAL',
    role: 'Mid-Level Full Stack Developer',
    rolePt: 'Desenvolvedor Full Stack Pleno',
    period: '2020 - 2021',
    periodPt: '2020 - 2021',
    description:
      'Developed and maintained full-stack web applications for banking systems management. Integrated cloud services and collaborated with cross-functional teams to deliver features on schedule.',
    descriptionPt:
      'Desenvolveu e manteve aplicações web completas para gerenciamento de sistemas bancários. Integrou serviços em nuvem e colaborou com equipes multifuncionais para entregar funcionalidades no prazo.',
    technologies: ['Java', 'Spring Boot', 'Angular', 'SQL', 'MongoDB', 'AWS'],
  },
  {
    id: 2,
    company: 'Essence',
    role: 'Junior Full Stack Developer',
    rolePt: 'Desenvolvedor Full Stack Júnior',
    period: '2020 - 2021',
    periodPt: '2020 - 2021',
    description:
      'Built end-to-end web applications for logistics and supply chain management. Developed microservices, integrated cloud services.',
    descriptionPt:
      'Construiu aplicações web completas para gerenciamento de logística e cadeia de suprimentos. Desenvolveu microsserviços, integrou serviços em nuvem.',
    technologies: ['Java', 'Spring Boot', 'Angular', 'SQL'],
  },
  {
    id: 1,
    company: 'Stefanini',
    role: 'Intern',
    rolePt: 'Estagiário',
    period: '2018 - 2019',
    periodPt: '2018 - 2019',
    description:
      'Started career as a software development intern. Assisted in bug fixing, wrote unit tests, and contributed to internal tools while learning enterprise development patterns and best practices.',
    descriptionPt:
      'Iniciou a carreira como estagiário de desenvolvimento de software. Auxiliou na correção de bugs, escreveu testes unitários e contribuiu para ferramentas internas enquanto aprendia padrões de desenvolvimento empresarial e melhores práticas.',
    technologies: ['Java', 'Spring Boot', 'Angular', 'SQL'],
  },
];

describe('Experience data', () => {
  it('should have 6 experience entries', () => {
    expect(TEST_EXPERIENCES.length).toBe(6);
  });

  it('should be sorted by id in descending order (most recent first)', () => {
    for (let i = 0; i < TEST_EXPERIENCES.length - 1; i++) {
      const current = TEST_EXPERIENCES.at(i);
      const next = TEST_EXPERIENCES.at(i + 1);
      expect(current!.id).toBeGreaterThan(next!.id);
    }
  });

  it('each entry should have all required Experience fields', () => {
    for (const exp of TEST_EXPERIENCES) {
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
    for (const exp of TEST_EXPERIENCES) {
      expect(Number.isInteger(exp.id)).toBe(true);
      expect(exp.id).toBeGreaterThan(0);
    }
  });

  it('each entry should have a non-empty company name', () => {
    for (const exp of TEST_EXPERIENCES) {
      expect(exp.company.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have non-empty role and rolePt', () => {
    for (const exp of TEST_EXPERIENCES) {
      expect(exp.role.trim().length).toBeGreaterThan(0);
      expect(exp.rolePt.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have non-empty period and periodPt', () => {
    for (const exp of TEST_EXPERIENCES) {
      expect(exp.period.trim().length).toBeGreaterThan(0);
      expect(exp.periodPt.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have non-empty description and descriptionPt', () => {
    for (const exp of TEST_EXPERIENCES) {
      expect(exp.description.trim().length).toBeGreaterThan(0);
      expect(exp.descriptionPt.trim().length).toBeGreaterThan(0);
    }
  });

  it('each entry should have at least one technology', () => {
    for (const exp of TEST_EXPERIENCES) {
      expect(exp.technologies.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('all technologies should be non-empty strings', () => {
    for (const exp of TEST_EXPERIENCES) {
      for (const tech of exp.technologies) {
        expect(typeof tech).toBe('string');
        expect(tech.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('should contain unique company names', () => {
    const companies = TEST_EXPERIENCES.map((e) => e.company);
    const unique = new Set(companies);
    expect(unique.size).toBe(companies.length);
  });

  it('should contain unique ids', () => {
    const ids = TEST_EXPERIENCES.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('specific entry: Bradesco', () => {
  const bradesco = TEST_EXPERIENCES.find((e) => e.company === 'Bradesco');

  it('should exist', () => {
    expect(bradesco).toBeDefined();
  });

  it('should have correct English role', () => {
    expect(bradesco!.role).toBe('Senior Systems Analyst');
  });

  it('should have correct Portuguese role', () => {
    expect(bradesco!.rolePt).toBe('Analista de Sistemas Sênior');
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
  const stefanini = TEST_EXPERIENCES.find((e) => e.company === 'Stefanini');

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


