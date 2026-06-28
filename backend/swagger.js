import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shoe Store API',
      version: '1.0.0',
      description: 'API Documentation for Shoe Store',
    },
    servers: [
      {
        url: 'http://localhost:5001',
      },
    ],
  },

  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;