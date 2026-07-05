export interface Project {
  id: number;
  imageUrl: string;
  imageUrlDark: string;
  title: string;
  titlePt: string;
  description: string;
  descriptionPt: string;
  technologies: string[];
  gitUrl: string;
  archDetails: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    imageUrl: 'assets/sales-kafka.png',
    imageUrlDark: 'assets/sales-kafka-dark.png',
    title: 'Sales Kafka',
    titlePt: 'Sales Kafka',
    description: 'Implementing orchestration saga pattern, using Kafka and Spring',
    descriptionPt: 'Implementação do padrão Saga Orquestrado utilizando Kafka e Spring Boot.',
    technologies: ['Java', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'MongoDB', 'Docker'],
    gitUrl: 'https://github.com/Stephulz/sales-kafka-saga',
    archDetails: 'https://learn.microsoft.com/azure/architecture/patterns/saga'
  }
];
