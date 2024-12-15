import swaggerAutogen from 'swagger-autogen';
import {BaseDir} from './config.js';

const doc = {
    info: {
        title: 'Green Shop',
        description: 'Documentation automatically generated by swagger-autogen',
    },
    host: 'localhost:8000',
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your bearer token in the format: Bearer <token>',
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const outputFile = `${BaseDir}/swagger_output.json`;
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger file generated successfully!');
});