import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Waste Management APIs',
    version: '1.0.0',
    description: 'API documentation for Citizens, Workers, Admins, and Complaints',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Local development server',
    },
  ],
};

const options: Options = {
  swaggerDefinition,
  apis: [__dirname + '/routes/*.{ts,js}'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
