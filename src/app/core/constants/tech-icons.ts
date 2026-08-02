/** Map of technology names to ng-icon icon names. */
export const TECH_ICONS = {
  Java: 'boxJavaLogo',
  'Spring Boot': 'simpleSpringboot',
  Angular: 'simpleAngular',
  React: 'simpleReact',
  SQL: 'diSqldeveloperPlain',
  GCP: 'simpleGooglecloud',
  AWS: 'boxAwsLogo',
  Azure: 'boxMicrosoftLogo',
  MongoDB: 'boxMongodbLogo',
  'Apache Kafka': 'simpleApachekafka',
  PostgreSQL: 'simplePostgresql',
  Docker: 'simpleDocker',
  Sass: 'simpleSass',
  Typescript: 'simpleTypescript',
} satisfies Record<string, string>;

/** Known technology names that have an icon mapped in `TECH_ICONS`. */
export type Tech = keyof typeof TECH_ICONS;
