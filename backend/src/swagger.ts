import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Testing APIs',
    version: '1.0.0',
    description: 'These are the APIs made for the project',
  },
  servers: [
    {
      url: '/users',
      description: 'Users endpoint APIs',
    },
  ],
};

const options: Options = {
  swaggerDefinition,
  apis: [__dirname + '/routes/*.{ts,js}'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;