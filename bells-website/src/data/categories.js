// Single source of truth for category slugs + display names, matching the
// backend's Product schema enum exactly (models/Product.js on the backend).
// Every component that needs to show or link to a category reads from here
// instead of hardcoding the list again.

export const CATEGORY_META = [
  {
    slug: "clothes",
    name: "Clothes",
    tagline: "Everyday essentials, well made",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "gym-equipment",
    name: "Gym Equipment",
    tagline: "Kit that lasts past January",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "home-appliances",
    name: "Home Appliances",
    tagline: "Small kitchen, big upgrade",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "pc-setup",
    name: "PC Setup",
    tagline: "Desk gear worth keeping",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "furniture",
    name: "Furniture",
    tagline: "Solid wood, honest joinery",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop",
  },
];

export function categoryLabel(slug) {
  return CATEGORY_META.find((c) => c.slug === slug)?.name || slug;
}
