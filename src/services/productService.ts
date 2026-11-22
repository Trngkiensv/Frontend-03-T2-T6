import axios from "axios";
import type { Product } from "../types/product";

const PRODUCTS_URL =
  "https://api.mockfly.dev/mocks/bb5dda88-6781-4978-a985-b68f6a0c945f/products";

export async function getProducts(q = ""): Promise<Product[]> {
  const response = await axios.get(PRODUCTS_URL, {
    params: q ? { q } : {},
  });
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.products)) {
    return response.data.products;
  }
  throw new Error("API err");
}