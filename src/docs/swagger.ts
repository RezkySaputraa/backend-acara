import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API Acara",
    description: "Dokumentasi API Acara",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://backend-acara-gamma-nine.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "erylrezky",
        password: "123456",
      },
      RegisterRequest: {
        fullName: "Eryl Rezky",
        username: "erylrezky",
        email: "erylrezky@example.com",
        password: "1234567",
        confirmPassword: "1234567",
      },
      ActivationRequest: {
        code: "abcdefgh",
      },
    },
  },
};

const outputFile = "./swaggerrr-output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
