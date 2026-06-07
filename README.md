# FakeStore — Firebase + CI/CD

A full-stack e-commerce frontend built with **React**, **Vite**, **Tailwind CSS**, **Redux Toolkit**, **React Query**, and **Firebase** (Authentication + Firestore). Ships with a fully automated **CI/CD pipeline** via GitHub Actions that builds, tests, and deploys to **Vercel** on every push to `main`.

---

## Features

### Products

- Product listing with category filtering, loaded from **Firestore**
- Product cards with image, rating, and add-to-cart
- Product data originally seeded from the FakeStore API, now owned in your Firestore `products` collection

### Authentication

- User registration and login via **Firebase Authentication** (email/password)
- Persistent auth state — stays logged in across page reloads
- Logout available from the navbar

### Cart & Orders

- Cart managed with **Redux Toolkit** and persisted to `sessionStorage`
- Checkout saves the full order (items, totals, user ID) to the Firestore `orders` collection
- **Order History** tab shows all past orders for the logged-in user
- Click any order to see its full product breakdown and total

### Admin Panel

- Admin users can **create**, **edit**, and **delete** products directly in Firestore
- Admin access is gated by `VITE_ADMIN_EMAIL` / `VITE_ADMIN_UID` in `.env.local`

---

## Testing

Tests are written with **Vitest** and **React Testing Library**.

```bash
npm test
```

| File                                     | Type        | Coverage                                                     |
| ---------------------------------------- | ----------- | ------------------------------------------------------------ |
| `src/__tests__/ProductCard.test.jsx`     | Unit        | Renders title/price/category; Add button dispatches to Redux |
| `src/__tests__/Cart.test.jsx`            | Unit        | Empty-state message; item details and quantity displayed     |
| `src/__tests__/CartIntegration.test.jsx` | Integration | Add product via ProductCard → Cart updates in real time      |

---

## CI/CD Pipeline

Defined in `.github/workflows/main.yml`. Triggers automatically on every push to `main`.

```
push to main
    │
    ▼
┌─────────────┐       fail → pipeline stops, deploy blocked
│  test job   │ ──────────────────────────────────────────────►
│  npm ci     │
│  npm build  │
│  npm test   │
└──────┬──────┘
       │ pass
       ▼
┌─────────────────┐
│   deploy job    │
│  vercel build   │
│  vercel deploy  │
└─────────────────┘
```

Deployment only runs if the build **and** all tests pass. Any test failure blocks the deploy.

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions** on the repo:

| Secret                              | Where to get it                        |
| ----------------------------------- | -------------------------------------- |
| `VERCEL_TOKEN`                      | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID`                     | Output of `npx vercel link`            |
| `VERCEL_PROJECT_ID`                 | Output of `npx vercel link`            |
| `VITE_FIREBASE_API_KEY`             | Firebase console → Project settings    |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase console                       |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase console                       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase console                       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase console                       |
| `VITE_FIREBASE_APP_ID`              | Firebase console                       |
| `VITE_ADMIN_EMAIL`                  | Your choice                            |
| `VITE_ADMIN_UID`                    | Firebase console → Authentication      |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env.local` file in the project root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAIL=your-admin@email.com
```

### 3. Seed the database

Populate the Firestore `products` collection (requires `serviceAccount.json` at the repo root):

```bash
node tools/seed-products.cjs
```

### 4. Run the dev server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── firebase.js                  # Firebase SDK init (auth + db)
├── main.jsx                     # App entry — Redux, React Query, AuthProvider
├── App.jsx                      # View switcher (home, cart, login, register, orders, admin)
├── setupTests.js                # Vitest global setup (jest-dom, sessionStorage reset)
├── contexts/
│   └── AuthContext.jsx          # Firebase auth state, useAuth() hook
├── api/
│   ├── products.js              # Firestore CRUD for products
│   └── orders.js                # Firestore CRUD for orders
├── store/
│   ├── index.js                 # Redux store
│   └── cartSlice.js             # Cart state and actions
├── components/
│   ├── Navbar.jsx               # Nav with auth-aware links and admin tab
│   ├── ProductList.jsx          # Product grid with category filter
│   ├── ProductCard.jsx          # Individual product card
│   ├── Cart.jsx                 # Cart view with checkout → Firestore
│   ├── Auth/
│   │   ├── Login.jsx            # Firebase email/password login
│   │   └── Register.jsx         # Firebase registration + Firestore user doc
│   ├── Orders/
│   │   ├── OrderHistory.jsx     # List of user's past orders
│   │   └── OrderDetail.jsx      # Full detail view of a single order
│   └── Admin/
│       ├── ProductAdmin.jsx     # Admin product list with delete
│       └── ProductForm.jsx      # Create / update product form
└── __tests__/
    ├── testUtils.jsx            # renderWithStore helper
    ├── ProductCard.test.jsx     # Unit tests
    ├── Cart.test.jsx            # Unit tests
    └── CartIntegration.test.jsx # Integration test
.github/
└── workflows/
    └── main.yml                 # CI/CD pipeline
```

---

## Firebase Setup Notes

- **Authentication**: Email/password provider must be enabled in the Firebase console.
- **Firestore**: Database must be created in the Firebase console. Rules are in `firestore.rules`.
- **Deploy rules**: `firebase deploy --only firestore:rules`
- **Service account**: `serviceAccount.json` is required locally for admin scripts and is git-ignored.

---

## Tooling

| File                      | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `tools/seed-products.cjs` | Seeds Firestore with live FakeStore product data |
| `firestore.rules`         | Firestore security rules                         |
| `firestore.indexes.json`  | Composite index for orders query                 |
| `firebase.json`           | Firebase CLI config for deploy and emulators     |
