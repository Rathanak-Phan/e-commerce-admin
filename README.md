
# EcomAdmin – Professional E-Commerce Admin Panel (Vue 3 + Firebase)

A beautiful, fast, and fully functional **admin dashboard** for clothing/e-commerce stores built with **Vue 3 + Vite + Pinia + Firebase**.

Perfect for managing products, orders, customers, and analytics — just like Shopify or WooCommerce.

## Features

- Real Firebase Authentication (admin-only access)
- Protected routes with admin guard
- Full CRUD for Products (with images, sizes, colors)
- Orders management with status updates
- Real-time Dashboard with charts (Chart.js)
- Users/Customer management
- Image upload with Firebase Storage (coming soon)
- Product variants (size/color/stock) support
- Dark / Light mode with persistence
- Mobile-responsive sidebar
- Clean, modern UI (Tailwind CSS + Heroicons)

## Tech Stack

- Vue 3 + Composition API + `<script setup>`
- Vite (blazing fast)
- Pinia (state management)
- Vue Router
- Firebase (Authentication + Firestore + Storage)
- Tailwind CSS
- Heroicons
- Chart.js

## Project Structure

```
src/
├── components/       # Reusable components
├── views/            # Pages (Dashboard, Products, Orders, Login)
├── stores/           # Pinia stores (productStore, orderStore, themeStore, etc.)
├── router/           # Vue Router + admin guard
├── firebase/         # Firebase config
├── assets/           # Images, icons
└── App.vue           # Main layout with sidebar
```

## Setup & Installation

### 1. Clone the project
```bash
git clone https://github.com/yourname/ecom-admin.git
cd ecom-admin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase
1. Go to [https://firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Create a file `src/firebase.js`:

```js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

### 4. Create Your First Admin

1. In Firebase Console → Authentication → Add user:
   - Email: `admin@yourstore.com`
   - Password: `123456`

2. In Firestore → create collection `users` → add document with ID = that user's UID

Add this data:
```json
{
  "email": "admin@yourstore.com",
  "name": "Super Admin",
  "isAdmin": true,
  "photoURL": "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
}
```

### 5. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Login with:
- Email: `admin@yourstore.com`
- Password: `123456`

You’re in!

## Default Admin Login

```
Email:    admin@yourstore.com
Password: 123456
```

## Screenshots

*(Add your own screenshots later)*

## Future Features (Planned)

- Image upload with drag & drop
- Export orders to CSV
- Print invoice / packing slip
- Coupon & discount system
- Low stock email alerts
- Role-based access (staff, manager, owner)

## Contributing

Pull requests are welcome! Feel free to improve design, add features, or fix bugs.

## License

MIT © 2025 Your Name

---
