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
    title: 'Sales Kafka Orchestration',
    titlePt: 'Sales Kafka Orquestrado',
    description: 'E-commerce case implementing Orchestration Saga Pattern, using Kafka and Spring',
    descriptionPt: 'Implementação do padrão Saga Orquestrado utilizando Kafka e Spring Boot em um caso de E-commerce',
    technologies: ['Java', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'MongoDB', 'Docker'],
    gitUrl: 'https://github.com/Stephulz/sales-kafka-saga',
    archDetails: 'https://learn.microsoft.com/pt-br/azure/architecture/patterns/saga#orchestration'
  },
  {
    id: 2,
    imageUrl: 'assets/sales-kafka-choreography.png',
    imageUrlDark: 'assets/sales-kafka-choreography-dark.png',
    title: 'Sales Kafka Choreography',
    titlePt: 'Sales Kafka Coreografado',
    description: 'E-commerce case implementing Choreography Saga Pattern, using Kafka and Spring',
    descriptionPt: 'Implementação do padrão Saga Coreografado utilizando Kafka e Spring Boot em um caso de E-commerce',
    technologies: ['Java', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'MongoDB', 'Docker'],
    gitUrl: 'https://github.com/Stephulz/sales-kafka-saga-choreographed',
    archDetails: 'https://learn.microsoft.com/pt-br/azure/architecture/patterns/saga#choreography'
  }
];
