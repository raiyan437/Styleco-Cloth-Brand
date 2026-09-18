import type { Category, Product } from "../../domain/catalog";
import type { HomepageContent, HomepageSection } from "../../domain/homepage";

// Seed fixtures only: UI must obtain categories through CatalogService.
export const categories: Category[] = [
  {
    id: "shirt",
    slug: "shirt",
    name: "Shirt",
    editorialLabel: "Everyday layers",
    position: 0,
  },
  {
    id: "katua",
    slug: "katua",
    name: "Katua",
    editorialLabel: "Modern tradition",
    position: 1,
  },
  {
    id: "t-shirt",
    slug: "t-shirt",
    name: "T-Shirt",
    editorialLabel: "Easy essentials",
    position: 2,
  },
  {
    id: "pant",
    slug: "pant",
    name: "Pants",
    editorialLabel: "The easy trouser",
    position: 3,
  },
  {
    id: "sleepwear",
    slug: "sleepwear",
    name: "Sleepwear",
    editorialLabel: "Slow morning comfort",
    position: 4,
  },
];

// Merchandising content and imagery will be provided in a later phase.
const catalogGroups = [
  {
    category: "shirt",
    image: "shirt",
    names: [
      "Relaxed Oxford Shirt",
      "Weekend Stripe Shirt",
      "Airy Cotton Shirt",
      "Everyday Poplin Shirt",
      "Studio Overshirt",
    ],
    base: 2490,
    colors: [
      { name: "Sky Blue", hex: "#A8BDD1" },
      { name: "White", hex: "#F2EFE6" },
      { name: "Black", hex: "#272827" },
    ],
  },
  {
    category: "katua",
    image: "katua",
    names: [
      "Everyday Katua",
      "Heritage Cotton Katua",
      "Easy Linen Katua",
      "Mandarin Collar Katua",
      "Textured Weekend Katua",
    ],
    base: 1890,
    colors: [
      { name: "Ivory", hex: "#E7DDC9" },
      { name: "Olive", hex: "#686D4F" },
      { name: "Black", hex: "#272827" },
    ],
  },
  {
    category: "t-shirt",
    image: "tee",
    names: [
      "Oversized Essential Tee",
      "Heavyweight Cotton Tee",
      "Boxy Everyday Tee",
      "Relaxed Crew Tee",
      "Soft Jersey Tee",
    ],
    base: 1190,
    colors: [
      { name: "Forest", hex: "#425647" },
      { name: "White", hex: "#F2EFE6" },
      { name: "Orange", hex: "#D96735" },
    ],
  },
  {
    category: "pant",
    image: "pant",
    names: [
      "Straight Fit Cotton Pant",
      "Relaxed Twill Trouser",
      "Everyday Chino",
      "Wide Leg Studio Pant",
      "Weekend Easy Pant",
    ],
    base: 2290,
    colors: [
      { name: "Sand", hex: "#C6B598" },
      { name: "Black", hex: "#272827" },
      { name: "Olive", hex: "#686D4F" },
    ],
  },
  {
    category: "sleepwear",
    image: "sleepwear",
    names: [
      "Soft Cotton Sleep Set",
      "Sunday Lounge Set",
      "Cloud Cotton Pajamas",
      "Slow Morning Set",
      "Classic Piped Sleep Set",
    ],
    base: 2690,
    colors: [
      { name: "Sky Blue", hex: "#A8BDD1" },
      { name: "Ivory", hex: "#E7DDC9" },
      { name: "Rose", hex: "#C48F8C" },
    ],
  },
];

const productImagePath = (imageKey: string, colorName: string) =>
  `/images/products/${imageKey === "tee" ? "t-shirt" : imageKey}-${colorName.toLowerCase().replaceAll(" ", "-")}.webp`;

for (const category of categories) {
  category.image = {
    id: category.id,
    url: `/images/categories/${category.slug}/category.webp`,
    alt: `${category.name} editorial collection`,
    width: 1120,
    height: 1400,
  };
}

export const products: Product[] = catalogGroups.flatMap((group, groupIndex) =>
  group.names.map((name, index) => {
    const slug = name.toLowerCase().replaceAll(" ", "-");
    const id = `${group.category}-${index + 1}`;
    const sale = index === 1 || index === 3;
    const amount = (group.base + index * 150) * 100;
    const colorImages = Object.fromEntries(
      group.colors.map((color, colorIndex) => {
        const imagePath =
          index === 0
            ? productImagePath(group.image, color.name)
            : `/images/products/${slug}/${color.name.toLowerCase().replaceAll(" ", "-")}.webp`;
        return [
          color.name,
          [
            {
              id: `${id}-${colorIndex}-front`,
              url: imagePath,
              alt: `${name}, styled in the ${color.name.toLowerCase()} colorway`,
              width: index === 0 ? 1024 : colorIndex === 1 ? 648 : 647,
              height: index === 0 ? 1280 : 809,
            },
            ...(index === 0
              ? [
                  {
                    id: `${id}-${colorIndex}-detail`,
                    url: imagePath.replace(".webp", "-detail.webp"),
                    alt: `${name} ${color.name.toLowerCase()} fabric and fit detail`,
                    width: 1024,
                    height: 1280,
                  },
                ]
              : []),
          ],
        ];
      }),
    );
    return {
      id,
      slug,
      name,
      categoryIds: [group.category],
      isNew: index === 0 || index === 2,
      images: colorImages[group.colors[0]!.name] ?? [],
      colorImages,
      variants: group.colors.flatMap((color, colorIndex) =>
        ["S", "M", "L", "XL"].map((size, sizeIndex) => {
          const stock =
            index === 4 && groupIndex === 4
              ? 0
              : (colorIndex + sizeIndex + index) % 5 === 2
                ? 0
                : 3 + (sizeIndex % 3);
          return {
            id: `${id}-${colorIndex}-${size}`,
            sku: `SC-${groupIndex}${index}-${colorIndex}-${size}`,
            size,
            color,
            price: { amount, currency: "BDT" },
            originalPrice: sale
              ? { amount: amount + 60000, currency: "BDT" }
              : undefined,
            inStock: stock > 0,
            stock,
          };
        }),
      ),
      description: `A little ease goes a long way. The ${name.toLowerCase()} brings a considered silhouette and soft, breathable fabric to your everyday rotation. Made for wherever the day takes you.`,
      material:
        group.category === "katua"
          ? "70% cotton, 30% linen. Lightly textured, naturally breathable."
          : "100% cotton. Soft-touch finish with a comfortable, breathable feel.",
      fit:
        group.category === "pant"
          ? "Straight leg with an easy fit through the hip. Choose your usual size."
          : "Relaxed fit. Choose your usual size for an easy silhouette, or size down for a closer fit.",
      care: "Machine wash cold with similar colors. Dry in shade. Warm iron on reverse. Do not bleach.",
      keywords: [
        group.category,
        "cotton",
        "everyday",
        ...group.colors.map((c) => c.name.toLowerCase()),
      ],
      releasedAt: `2026-09-${String(15 - index - groupIndex).padStart(2, "0")}`,
      rating: 4.6 + (index % 3) / 10,
      reviewCount: 12 + index * 7 + groupIndex * 4,
    };
  }),
);
export const homepageSections: HomepageSection[] = [
  {
    id: "categories",
    title: "Categories",
    kind: "categories",
    enabled: true,
    position: 0,
  },
  {
    id: "latest-products",
    title: "Latest Products",
    kind: "curated-products",
    enabled: true,
    position: 1,
    products: [
      "shirt-1",
      "katua-1",
      "t-shirt-1",
      "pant-1",
      "sleepwear-1",
      "shirt-2",
      "katua-3",
      "t-shirt-2",
      "pant-3",
      "sleepwear-2",
      "shirt-3",
      "katua-2",
    ].map((productId, position) => ({ productId, position })),
  },
  {
    id: "top-sellers",
    title: "Top Sellers",
    kind: "curated-products",
    enabled: true,
    position: 2,
    products: [
      "t-shirt-3",
      "shirt-4",
      "katua-2",
      "pant-2",
      "sleepwear-3",
      "shirt-2",
      "pant-4",
      "katua-4",
      "t-shirt-4",
      "sleepwear-4",
      "shirt-5",
      "pant-5",
    ].map((productId, position) => ({ productId, position })),
  },
];

export const homepageContent: HomepageContent = {
  promotion: {
    eyebrow: "GOOD FINDS. BETTER PRICES.",
    title: "A little\nless.\nA lot more.",
    cta: "Shop the sale edit",
    href: "/sale",
    stamp: "THE SALE EDIT",
  },
  announcement:
    "A little something on us. Free standard delivery on orders ৳3,000+",
  hero: {
    eyebrow: "THE EVERYDAY EDIT / 2026",
    title: "Good clothes.\nGreat days.",
    description:
      "Fresh silhouettes. Feel-good fabrics. A little more you, every single day.",
    image: "/images/current-sale-banner.png",
    alt: "Styleco sale editorial with a rust overshirt, tailored trousers and a clothing rack",
    href: "/new-arrivals",
    cta: "Meet your new favorites",
  },
  campaigns: [
    {
      eyebrow: "ROOTED IN TRADITION. MADE FOR NOW.",
      title: "A familiar feeling.\nA fresh perspective.",
      description:
        "Meet the modern Katua. Easy, considered, and unmistakably you.",
      image: "/images/katua.webp",
      alt: "Ivory cotton Katua in warm natural light",
      href: "/category/katua",
      cta: "Explore the Katua edit",
    },
    {
      eyebrow: "OFF THE CLOCK",
      title: "Take it\neasy.",
      description:
        "Soft landings for slow mornings. Your new favorite way to do nothing.",
      image: "/images/sleepwear.webp",
      alt: "Sky blue cotton sleep set for slow mornings",
      href: "/category/sleepwear",
      cta: "Find your comfort zone",
    },
  ],
};
