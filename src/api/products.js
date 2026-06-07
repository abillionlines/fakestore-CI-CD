/*
Products API helpers
*/

/*
Firestore-backed products API
- Replaces Axios/FakeStore with Firestore reads/writes.
*/

import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const handleError = (err) => {
  // Log original error for easier debugging in browser console
  // then rethrow the original error so React Query shows accurate message.
  // This avoids swallowing the stack trace.
  // eslint-disable-next-line no-console
  console.error("Firestore API error:", err);
  throw err;
};

export const getProducts = async () => {
  try {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    handleError(err);
  }
};

export const getProduct = async (id) => {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Product not found");
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    handleError(err);
  }
};

export const createProduct = async (data) => {
  try {
    const ref = await addDoc(collection(db, "products"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    handleError(err);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const ref = doc(db, "products", id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return id;
  } catch (err) {
    handleError(err);
  }
};

export const deleteProduct = async (id) => {
  try {
    const ref = doc(db, "products", id);
    await deleteDoc(ref);
    return id;
  } catch (err) {
    handleError(err);
  }
};

export const getCategories = async () => {
  try {
    // derive categories from products
    const snap = await getDocs(collection(db, "products"));
    const set = new Set();
    snap.docs.forEach((d) => {
      const c = d.data()?.category;
      if (c) set.add(c);
    });
    return Array.from(set);
  } catch (err) {
    handleError(err);
  }
};

// Compatibility wrappers expected by UI components
export const fetchProducts = async (category = "all") => {
  try {
    const products = await getProducts();
    if (!category || category === "all") return products;
    return products.filter((p) => p.category === category);
  } catch (err) {
    handleError(err);
  }
};

export const fetchCategories = async () => {
  try {
    return await getCategories();
  } catch (err) {
    handleError(err);
  }
};
