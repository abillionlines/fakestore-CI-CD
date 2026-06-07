#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "fakestore-68327";
// If a service account exists at repo root, use it; otherwise initialize for emulator
const svcPath = path.join(process.cwd(), "serviceAccount.json");
if (fs.existsSync(svcPath)) {
  const serviceAccount = require(svcPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || PROJECT_ID,
  });
  console.log("Initialized admin SDK with serviceAccount.json");
} else {
  // Initialize with default project id and rely on emulator host env var
  process.env.FIRESTORE_EMULATOR_HOST =
    process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  admin.initializeApp({ projectId: PROJECT_ID });
  console.log(
    "Initialized admin SDK in emulator mode (no serviceAccount.json)",
  );
}

const db = admin.firestore();

const products = [
  {
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest.",
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/81fAn7Y7yAL._AC_UL640_FMwebp_QL65_.jpg",
    rating: { rate: 3.9, count: 120 },
  },
  {
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim-fitting style, contrast raglan long sleeve.",
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.1, count: 259 },
  },
  {
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "Great outerwear jacket for Spring/Autumn/Winter.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.7, count: 500 },
  },
  {
    title: "Mens Casual Slim Fit",
    price: 15.99,
    description:
      "The color could be slightly different between on the screen and in practice.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    rating: { rate: 2.1, count: 430 },
  },
  {
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Bracelet",
    price: 695.0,
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon.",
    category: "jewelery",
    image:
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg",
    rating: { rate: 4.6, count: 400 },
  },
  {
    title: "Solid Gold Petite Micropave",
    price: 168.0,
    description:
      "Satisfaction guaranteed. Return or exchange any order within 30 days.",
    category: "jewelery",
    image:
      "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_FMwebp_QL65_.jpg",
    rating: { rate: 3.9, count: 70 },
  },
  {
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64.0,
    description:
      "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    rating: { rate: 3.3, count: 203 },
  },
  {
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 109.0,
    description:
      "Easy upgrade for faster boot up, shutdown, games and applications.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    rating: { rate: 2.9, count: 470 },
  },
  {
    title: "Silicon Power 256GB SSD",
    price: 109.0,
    description: "3D NAND flash are applied to deliver high transfer speeds.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg",
    rating: { rate: 4.8, count: 319 },
  },
  {
    title:
      "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    price: 114.0,
    description: "Expand your PS4 gaming experience, Play anywhere.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    rating: { rate: 4.8, count: 400 },
  },
  {
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    price: 599.0,
    description: "21. 5 inches Full HD (1920 x 1080) widescreen IPS display.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    rating: { rate: 2.9, count: 250 },
  },
  {
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
    price: 56.99,
    description: "Detachable Liner Windproof Waterproof Hard Shell Ski Jacket.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: { rate: 2.6, count: 235 },
  },
  {
    title:
      "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description: "100% POLYURETHANE(shell) 100% POLYESTER(lining).",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879-2.jpg",
    rating: { rate: 2.9, count: 340 },
  },
  {
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description:
      "Lightweight perfect for trip or casual wear---Warm and Comfortable.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879-2.jpg",
    rating: { rate: 3.8, count: 679 },
  },
  {
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description: "95% RAYON 5% SPANDEX, Made in USA or Imported.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    rating: { rate: 4.7, count: 130 },
  },
  {
    title: "Opna Women's Short Sleeve Moisture Tunic",
    price: 7.95,
    description: "100% Polyester, Machine wash, 100% Polyester.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    rating: { rate: 4.5, count: 146 },
  },
  {
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description: "95% COTTON, 5% SPANDEX. Features: Casual, Short Sleeve.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    rating: { rate: 3.6, count: 145 },
  },
];

async function fetchFromAPI() {
  const https = require("https");
  return new Promise((resolve, reject) => {
    https
      .get("https://fakestoreapi.com/products", (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(chunks.join("")));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function seed() {
  try {
    const colRef = db.collection("products");

    // Fetch live products from FakeStore API (guarantees current image URLs)
    console.log("Fetching products from FakeStore API...");
    let apiProducts;
    try {
      apiProducts = await fetchFromAPI();
      console.log(`Fetched ${apiProducts.length} products from API.`);
    } catch (fetchErr) {
      console.warn(
        "API fetch failed, falling back to local products array:",
        fetchErr.message,
      );
      apiProducts = products;
    }

    console.log("Clearing existing products...");
    const existing = await colRef.get();
    await Promise.all(existing.docs.map((d) => d.ref.delete()));
    console.log(`Deleted ${existing.size} existing product(s).`);

    console.log(
      "Seeding to",
      process.env.FIRESTORE_EMULATOR_HOST || "production Firestore",
    );
    for (const p of apiProducts) {
      const docRef = await colRef.add({
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        image: p.image,
        rating: p.rating || { rate: 0, count: 0 },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Added:", docRef.id, "-", p.title);
    }
    console.log("Seeding complete:", apiProducts.length, "products added.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
