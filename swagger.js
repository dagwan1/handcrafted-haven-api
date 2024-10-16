const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
  info: {
    title: 'Handcrafted Haven API',
    description: `API documentation for the Handcrafted Haven platform. This API is designed to help manage user accounts, seller profiles, and various related functionalities. It allows you to create, retrieve, update, and delete records seamlessly.

**Key Features:**

- **Create User Account:** Use the POST endpoint to add new user accounts, providing details like full name, username, password, and email.

- **Login:** Authenticate users with their credentials through the login endpoint.

- **Forgot Password:** Enable users to initiate a password recovery process via email.

- **Reset Password:** Allow users to set a new password securely.

- **Rate Products:** Submit ratings and reviews for products.

- **Order Products:** Choose products based on your selections.

**Sample Requests and Responses:** Sample JSON requests and responses are included for each endpoint to facilitate interaction with the API.

**Error Handling:** The API provides error responses and status codes to assist you in resolving issues.`,
  },

  host: process.env.HOST || 'localhost:8080',
  schemes: [process.env.SCHEMES || 'http'],

  definitions: {
    User: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        confirmPassword: { type: 'string' },
        userType: { type: 'string', enum: ['buyer', 'seller'] },
        profilePicture: { type: 'string', format: 'url' },
        bio: { type: 'string' },
        address: { type: 'string' },
      },
    },
    Login: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
    ForgotPassword: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
    ResetPassword: {
      type: 'object',
      properties: {
        password: { type: 'string' },
        confirmPassword: { type: 'string' },
      },
    },
    // Include any additional models or schemas as needed
  },

  paths: {
    '/users': {
      get: {
        tags: ['User Accounts'],
        summary: 'Get all user accounts',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            type: 'string',
            description: 'Bearer token for authentication',
          },
        ],
        responses: {
          200: {
            description: 'List of user accounts',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/User',
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
      post: {
        tags: ['User Accounts'],
        summary: 'Create a new user account',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/User',
            },
          },
        ],
        responses: {
          200: {
            description: 'User account created successfully',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['User Accounts'],
        summary: 'User login',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/Login',
            },
          },
        ],
        responses: {
          200: {
            description: 'User logged in successfully',
          },
          400: {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/users/forgot-password': {
      post: {
        tags: ['User Accounts'],
        summary: 'Forgot password',
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/ForgotPassword',
            },
          },
        ],
        responses: {
          200: {
            description: 'Password recovery initiated',
          },
          400: {
            description: 'Invalid email',
          },
        },
      },
    },
    '/users/reset-password/{token}': {
      post: {
        tags: ['User Accounts'],
        summary: 'Reset password',
        parameters: [
          {
            in: 'path',
            name: 'token',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/ResetPassword',
            },
          },
        ],
        responses: {
          200: {
            description: 'Password reset successfully',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['User Accounts'],
        summary: 'Get a single user by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            type: 'string',
            description: 'Bearer token for authentication',
          },
        ],
        responses: {
          200: {
            description: 'User retrieved successfully',
            schema: {
              $ref: '#/definitions/User',
            },
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
      put: {
        tags: ['User Accounts'],
        summary: 'Update user by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/User',
            },
          },
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            type: 'string',
            description: 'Bearer token for authentication',
          },
        ],
        responses: {
          200: {
            description: 'User updated successfully',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
      delete: {
        tags: ['User Accounts'],
        summary: 'Delete user by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            type: 'string',
            description: 'Bearer token for authentication',
          },
        ],
        responses: {
          200: {
            description: 'User deleted successfully',
          },
          400: {
            description: 'Error deleting user',
          },
        },
      },
    },
    // Include other endpoints as necessary
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
