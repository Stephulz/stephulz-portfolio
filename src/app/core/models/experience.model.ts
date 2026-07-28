export interface Experience {
  id: number;
  company: string;
  role: string;
  rolePt: string;
  period: string;
  periodPt: string;
  description: string;
  descriptionPt: string;
  technologies: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    id: 6,
    company: 'Bradesco',
    role: 'Senior Software Engineer',
    rolePt: 'Engenheiro de Software Sênior ',
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
      'Designed insurance and financial software solutions. Built responsive frontends, developed backend microservices, and participated in the full software development lifecycle using agile methodologies.',
    descriptionPt:
      'Arquitetou soluções de software para seguros e finanças. Construiu interfaces responsivas, desenvolveu microsserviços e participou de todo o ciclo de desenvolvimento de software usando metodologias ágeis.',
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
      'Designed scalable web applications for the life insurance sector. Collaborated in agile squads to deliver features from concept to production, focusing on performance optimization and clean architecture.',
    descriptionPt:
      'Projetou aplicações web escaláveis para o setor de seguros de vida. Colaborou em squads ágeis para entregar funcionalidades do conceito à produção, com foco em otimização de performance e arquitetura limpa.',
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
