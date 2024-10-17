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
    CartItem: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantity: { type: 'integer' },
        userId: { type: 'string' },
      },
    },
    Category: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
    OrderItem: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
        productId: { type: 'string' },
        quantity: { type: 'integer' },
        price: { type: 'number' },
      },
    },
    Order: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        totalAmount: { type: 'number' },
        status: { type: 'string', enum: ['pending', 'completed', 'canceled'] },
      },
    },
    Payment: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
        amount: { type: 'number' },
        method: { type: 'string', enum: ['credit_card', 'paypal', 'bank_transfer'] },
        status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
      },
    },
    Product: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        categoryId: { type: 'string' },
        description: { type: 'string' },
        stock: { type: 'integer' },
      },
    },
    Review: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        userId: { type: 'string' },
        rating: { type: 'integer' },
        comment: { type: 'string' },
      },
    },
    ShoppingCart: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        items: { type: 'array', items: { $ref: '#/definitions/CartItem' } },
      },
    },
  },

  paths: {
    '/users': {
      get: {
        tags: ['User Accounts'],
        summary: 'Get all user accounts',
        parameters: [{ in: 'header', name: 'Authorization', required: true, type: 'string', description: 'Bearer token for authentication' }],
        responses: {
          200: {
            description: 'List of user accounts',
            schema: { type: 'array', items: { $ref: '#/definitions/User' } },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['User Accounts'],
        summary: 'Create a new user account',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/User' } }],
        responses: {
          200: { description: 'User account created successfully' },
          400: { description: 'Invalid input' },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['User Accounts'],
        summary: 'User login',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/Login' } }],
        responses: {
          200: { description: 'User logged in successfully' },
          400: { description: 'Invalid credentials' },
        },
      },
    },
    '/users/forgot-password': {
      post: {
        tags: ['User Accounts'],
        summary: 'Forgot password',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/ForgotPassword' } }],
        responses: {
          200: { description: 'Password recovery initiated' },
          400: { description: 'Invalid email' },
        },
      },
    },
    '/users/reset-password/{token}': {
      post: {
        tags: ['User Accounts'],
        summary: 'Reset password',
        parameters: [
          { in: 'path', name: 'token', required: true, type: 'string' },
          { in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/ResetPassword' } },
        ],
        responses: {
          200: { description: 'Password reset successfully' },
          400: { description: 'Invalid input' },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['User Accounts'],
        summary: 'Get a single user by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, type: 'string' },
          { in: 'header', name: 'Authorization', required: true, type: 'string', description: 'Bearer token for authentication' },
        ],
        responses: {
          200: { description: 'User retrieved successfully', schema: { $ref: '#/definitions/User' } },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['User Accounts'],
        summary: 'Update user by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, type: 'string' },
          { in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/User' } },
          { in: 'header', name: 'Authorization', required: true, type: 'string', description: 'Bearer token for authentication' },
        ],
        responses: {
          200: { description: 'User updated successfully' },
          400: { description: 'Invalid input' },
        },
      },
      delete: {
        tags: ['User Accounts'],
        summary: 'Delete user by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, type: 'string' },
          { in: 'header', name: 'Authorization', required: true, type: 'string', description: 'Bearer token for authentication' },
        ],
        responses: {
          200: { description: 'User deleted successfully' },
          400: { description: 'Error deleting user' },
        },
      },
    },
    paths: {
    '/cartitems': {
      get: {
        tags: ['Shopping Cart'],
        summary: 'Get all cart items',
        responses: {
          200: { description: 'List of cart items', schema: { type: 'array', items: { $ref: '#/definitions/CartItem' } } },
        },
      },
      post: {
        tags: ['Shopping Cart'],
        summary: 'Add item to cart',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/CartItem' } }],
        responses: {
          200: { description: 'Item added to cart successfully' },
          400: { description: 'Invalid input' },
        },
      },
    },
  },
  paths: {
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        responses: {
          200: { description: 'List of orders', schema: { type: 'array', items: { $ref: '#/definitions/Order' } } },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/Order' } }],
        responses: {
          200: { description: 'Order created successfully' },
          400: { description: 'Invalid input' },
        },
      },
    },
  },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by ID',
        parameters: [{ in: 'path', name: 'id', required: true, type: 'string' }],
        responses: {
          200: { description: 'Order retrieved successfully', schema: { $ref: '#/definitions/Order' } },
          404: { description: 'Order not found' },
        },
      },
      put: {
        tags: ['Orders'],
        summary: 'Update order by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, type: 'string' },
          { in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/Order' } },
        ],
        responses: {
          200: { description: 'Order updated successfully' },
          400: { description: 'Invalid input' },
        },
      },
      delete: {
        tags: ['Orders'],
        summary: 'Delete order by ID',
        parameters: [{ in: 'path', name: 'id', required: true, type: 'string' }],
        responses: {
          200: { description: 'Order deleted successfully' },
          404: { description: 'Order not found' },
        },
      },
    },
    paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        responses: {
          200: { description: 'List of products', schema: { type: 'array', items: { $ref: '#/definitions/Product' } } },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Add a new product',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/Product' } }],
        responses: {
          200: { description: 'Product added successfully' },
          400: { description: 'Invalid input' },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [{ in: 'path', name: 'id', required: true, type: 'string' }],
        responses: {
          200: { description: 'Product retrieved successfully', schema: { $ref: '#/definitions/Product' } },
          404: { description: 'Product not found' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update product by ID',
        parameters: [
          { in: 'path', name: 'id', required: true, type: 'string' },
          { in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/Product' } },
        ],
        responses: {
          200: { description: 'Product updated successfully' },
          400: { description: 'Invalid input' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product by ID',
        parameters: [{ in: 'path', name: 'id', required: true, type: 'string' }],
        responses: {
          200: { description: 'Product deleted successfully' },
          404: { description: 'Product not found' },
        },
      },
    },
  },
  paths: {
    '/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get all reviews',
        responses: {
          200: { description: 'List of reviews', schema: { type: 'array', items: { $ref: '#/definitions/Review' } } },
        },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Add a new review',
        parameters: [{ in: 'body', name: 'body', required: true, schema: { $ref: '#/definitions/Review' } }],
        responses: {
          200: { description: 'Review added successfully' },
          400: { description: 'Invalid input' },
        },
      },
    },
  },
},
};


const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);