import { getServices } from "@/services/container";
import { Navigation } from "./navigation";
export async function SiteHeader() {
  const categories = await getServices().catalog.getCategories();
  return <Navigation categories={categories} />;
}
