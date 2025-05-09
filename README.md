# Bolghty – Full-Stack E-Commerce Web App

Bolghty is a responsive and feature-rich full-stack e-commerce web application for selling shoes. It allows users to register, authenticate, browse products, add items to their cart, place orders, and track their purchases. Admin users have enhanced privileges to manage the product catalog and oversee user orders. This application was built with a clean, modular structure that follows industry best practices for backend development, secure authentication, and scalable deployment.

---

## Key Features

### User Features
- User registration and login with secure password hashing using bcrypt.
- JWT-based authentication with protected routes.
- Role-based access: users vs. admins.
- Profile viewing and editing with profile picture upload.
- Browse and search shoes by name, brand, or color.
- Dynamic single product page with size and color selection.
- Add to cart functionality and persistent cart across sessions.
- Checkout page with order placement and total calculation.
- View past orders with status tracking (e.g., pending, shipped).
- Authenticated contact form with server-side validation.

### Admin Features
- Admin dashboard route protection based on role in JWT payload.
- Ability to manage (CRUD) products (planned or extendable).
- View all submitted orders and user messages (planned or extendable).

### API Features
- RESTful design with clean separation between controllers, routes, models, and middleware.
- Express middleware for authentication and admin-only access.
- MongoDB document structure for users, products, and orders.
- File upload support using Multer for handling profile pictures.
- FormData parsing for profile updates with image files.
- Product filtering by search keywords on the server side.

---

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla JS)
- Bootstrap 5 for UI components and grid layout
- Client-side navigation and API interaction using Fetch API
- Responsive design with custom media queries and utility classes

### Backend
- Node.js & Express.js for HTTP API server
- MongoDB Atlas (cloud) + Mongoose ODM
- JSON Web Tokens (JWT) for stateless authentication
- bcrypt for hashing and verifying passwords
- Multer for image uploads (profile pictures)
- dotenv for environment configuration

### Dev & Testing Tools
- Postman (API testing)
- MongoDB Compass (data inspection)
- nodemon (auto-restarting backend dev server)
- Console debugging (DevTools and Node logs)

---

## Project Structure

```
Directory structure:
└── e-commerce-app/
    ├── README.md
    ├── package.json
    ├── seedFromLocal.js
    ├── client/
    │   └── public/
    │       ├── checkout.html
    │       ├── contact.html
    │       ├── editProfile.html
    │       ├── index.html
    │       ├── login.html
    │       ├── orders.html
    │       ├── product.html
    │       ├── products.html
    │       ├── profile.html
    │       ├── search.html
    │       ├── sign-up.html
    │       ├── Admin-Pages/
    │       │   ├── add_user.html
    │       │   ├── dashboard.html
    │       │   ├── edit_user.html
    │       │   ├── inventory_management.html
    │       │   ├── order_management.html
    │       │   ├── user_management.html
    │       │   ├── view_product.html
    │       │   ├── view_user.html
    │       │   └── services/
    │       │       ├── addUser.js
    │       │       ├── dashboard.js
    │       │       ├── editUser.js
    │       │       ├── inventoryManagement.js
    │       │       ├── orderManagement.js
    │       │       ├── userManagement.js
    │       │       ├── viewProduct.js
    │       │       └── viewUser.js
    │       ├── assets/
    │       │   ├── CSS/
    │       │   │   ├── add_user.css
    │       │   │   ├── checkout.css
    │       │   │   ├── contact-us.css
    │       │   │   ├── dashboard.css
    │       │   │   ├── edit_user.css
    │       │   │   ├── editProfile.css
    │       │   │   ├── index.css
    │       │   │   ├── inventory_management.css
    │       │   │   ├── login.css
    │       │   │   ├── order_management.css
    │       │   │   ├── orders.css
    │       │   │   ├── product.css
    │       │   │   ├── products.css
    │       │   │   ├── profile.css
    │       │   │   ├── sign-up.css
    │       │   │   ├── user_management.css
    │       │   │   ├── view_product.css
    │       │   │   └── view_user.css
    │       │   └── images/
    │       └── services/
    │           ├── app.js
    │           ├── auth.js
    │           ├── cart.js
    │           ├── checkout.js
    │           ├── contact.js
    │           ├── editProfile.js
    │           ├── index.js
    │           ├── nav.js
    │           ├── order.js
    │           ├── product.js
    │           ├── products.js
    │           ├── profile.js
    │           ├── search.js
    │           └── view_product.js
    ├── data/
    │   └── products.json
    └── server/
        ├── app.js
        ├── server.js
        ├── config/
        │   └── db.js
        ├── controllers/
        │   ├── adminController.js
        │   ├── authController.js
        │   ├── cartController.js
        │   ├── contactController.js
        │   ├── orderController.js
        │   ├── ordersController.js
        │   ├── productController.js
        │   ├── reviewController.js
        │   ├── userController.js
        │   └── usersController.js
        ├── middleware/
        │   ├── auth.js
        │   └── multer.js
        ├── models/
        │   ├── Address.js
        │   ├── Cart.js
        │   ├── Coupon.js
        │   ├── Message.js
        │   ├── Order.js
        │   ├── Product.js
        │   ├── Review.js
        │   └── User.js
        ├── routes/
        │   ├── adminRoutes.js
        │   ├── authRoutes.js
        │   ├── cartRoutes.js
        │   ├── contactRoutes.js
        │   ├── ordersRoutes.js
        │   ├── productRoutes.js
        │   └── userRoutes.js
        └── utils/
            ├── index.js
            └── .gitkeep

```

---

## Setup Instructions

### 1. Clone and install
```bash
git clone https://github.com/Adham-Osama11/e-commerce-app.git
cd e-commerce-app
npm install
```

### 2. Configure environment
Create a `.env` file in the root with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_string
PORT=5000
```

### 3. Seed database (optional)
```bash
node seedFromLocal.js
```

### 4. Run the server
```bash
npm run dev
```
Then open `http://localhost:5000`

---

## API Endpoints Overview

### Auth (`/api/auth/`)
- `POST /register` — Register new user
- `POST /login` — Authenticate and return JWT token
- `GET /me` — Get logged-in user's info (requires JWT)
- `PUT /me` — Update user profile (protected, accepts FormData)

### Products (`/api/products/`)
- `GET /` — Get all products (supports `?search=` query)

### Orders (`/api/order/`)
- `GET /` — Get authenticated user's orders (protected)

### Contact (`/api/contact/`)
- `POST /` — Submit contact form (requires authentication)

### Admin (`/api/admin/`)
- `GET /dashboard` — View admin-only content (admin role only)

---

## Pages

- `index.html` — Landing page with featured shoes
- `products.html` — Grid-based product catalog with search bar
- `product.html` — Single product detail page with size/color options
- `login.html` and `sign-up.html` — Auth pages
- `profile.html` — User profile viewer
- `edit-profile.html` — Editable form with image preview
- `contact.html` — Contact form (authenticated users only)
- `orders.html` — List of all placed orders for the user
- `admin/dashboard.html` — Admin-only landing area

---

## Future Improvements

- Dashboard analytics for admins
- Integrate Stripe or PayPal for payment processing

---