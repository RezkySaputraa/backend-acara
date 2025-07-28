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
        identifier: "eryl2026",
        password: "Eryl2026",
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
      UpdateProfileRequest: {
        fullName: "",
        profilePicture: "",
      },
      UpdatePasswordRequest: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: 3273,
          coordinates: [0, 0],
          address: "",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateBannerRequest: {
        title: "Banner 2 - Title",
        image:
          "https://res.cloudinary.com/dnc0k567c/image/upload/v1753173661/mmbr5dhpa3i3os8onruh.jpg",
        isShow: false,
      },
      CreateTicketRequest: {
        price: 1500,
        name: "Ticket Reguler",
        events: "687f28f3e1ec19c495892a1a",
        description: "Ticket Reguler - description",
        quantity: 100,
      },
      CreateOrderRequest: {
        events: "6883888a95641aa4b9a4bbf6",
        ticket: "6884e8a8208cf2062f860daa",
        quantity: 8,
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
