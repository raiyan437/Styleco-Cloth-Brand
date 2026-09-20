import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/info/demo-forms";
import { SizeTable } from "@/components/catalog/size-guide";
import { Breadcrumb } from "@/components/ui/shared";
import { localAssetPath } from "@/config/site";
const content: Record<
  string,
  {
    title: string;
    eyebrow: string;
    intro: string;
    sections: [string, string][];
  }
> = {
  about: {
    title: "Less ordinary. More you.",
    eyebrow: "THIS IS STYLECO",
    intro:
      "We believe the best clothes are the ones you live in. The pieces that feel familiar from day one, yet bring a fresh energy every time you wear them.",
    sections: [
      [
        "For the everyday, and everything else.",
        "From the ease of a cotton tee to the quiet character of a Katua, our edit makes room for all the ways you show up. Considered silhouettes. Feel-good fabrics. Your own point of view.",
      ],
      [
        "Made for the everyday.",
        "We make easy, considered clothing for everyday life—relaxed silhouettes, thoughtful details and feel-good fabrics designed to move with you.",
      ],
    ],
  },
  contact: {
    title: "Let’s talk.",
    eyebrow: "WE’RE ALL EARS",
    intro:
      "A question about fit? A thought about the collection? We’d love to hear it. Send us a note and our team will get back to you.",
    sections: [],
  },
  faq: {
    title: "Good questions.",
    eyebrow: "A LITTLE HELP GOES A LONG WAY",
    intro:
      "A few things you might be wondering. Find the essentials before you place your order.",
    sections: [
      [
        "Can I place an order?",
        "Yes. Choose your favourite pieces, select your size and colour, then complete checkout to place your order.",
      ],
      [
        "How do I find my size?",
        "Open the size guide from any product page. If you prefer a relaxed fit, choose your usual size.",
      ],
      [
        "Where is my wishlist saved?",
        "Your favourites and bag stay available on this device so you can pick up where you left off.",
      ],
      [
        "What happens at checkout?",
        "Choose Cash on Delivery or card payment at checkout. You’ll see your order confirmation as soon as your order is placed.",
      ],
      [
        "Can I return a piece?",
        "Returns are accepted within 7 days for unworn pieces with tags attached. Please contact us with your order details to start a return.",
      ],
    ],
  },
  "shipping-returns": {
    title: "Good things, on their way.",
    eyebrow: "SHIPPING & RETURNS",
    intro:
      "Simple delivery. A little room to change your mind. Here’s what to expect when your order is on its way.",
    sections: [
      [
        "Standard delivery",
        "৳80 for orders below ৳3,000; free at a merchandise subtotal of ৳3,000 or more, before coupon discounts. Indicative delivery: 3–5 working days.",
      ],
      [
        "Express delivery",
        "৳150. Delivery takes 1–2 working days. Choose express delivery at checkout.",
      ],
      [
        "Room to reconsider",
        "Return unworn, unwashed pieces with tags within 7 days. Please contact us with your order details to arrange a return.",
      ],
    ],
  },
  "size-guide": {
    title: "Find your feel-good fit.",
    eyebrow: "THE SIZE GUIDE",
    intro:
      "A little measuring goes a long way. Use this guide as a starting point for finding your most comfortable fit.",
    sections: [],
  },
  privacy: {
    title: "Your space matters.",
    eyebrow: "PRIVACY",
    intro:
      "Your privacy matters to us. We use your details only to support your Styleco shopping experience and keep your preferences close.",
    sections: [
      [
        "On this browser",
        "Your bag, saved products and preferences are stored on this device so your Styleco experience feels personal. Your latest order details remain available during your current browsing session.",
      ],
      [
        "What we don’t collect",
        "Card numbers and passwords are not stored or sent. We only use the details needed to manage your account, orders and saved products.",
      ],
      [
        "Your control",
        "Clear this site's browser storage to remove your bag and favourites. You can also close your browser session to remove temporary order details.",
      ],
    ],
  },
  terms: {
    title: "A few ground rules.",
    eyebrow: "TERMS",
    intro:
      "These terms explain how Styleco orders, payments, delivery and returns work.",
    sections: [
      [
        "Product information",
        "Images, prices, availability, discounts, reviews and delivery estimates may change as the collection evolves.",
      ],
      [
        "Payments",
        "Choose your payment method at checkout. You’ll receive an order confirmation after placing your order.",
      ],
      [
        "Our service",
        "We’ll keep these terms and our service information up to date as the Styleco collection grows.",
      ],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(content).map((page) => ({ page }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const data = content[(await params).page];
  return {
    title: data?.title ?? "Page not found",
    description: data?.intro,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const data = content[page];
  if (!data) notFound();
  return (
    <main id="main-content" className="site-container page-space info-page">
      <Breadcrumb
        items={[
          {
            label:
              page === "shipping-returns" ? "Shipping & Returns" : data.title,
          },
        ]}
      />
      <header className="page-heading">
        <p className="text-eyebrow">{data.eyebrow}</p>
        <h1>{data.title}</h1>
        <p className="info-intro">{data.intro}</p>
      </header>
      {page === "about" && (
        <div className="about-image">
          <Image
            src={localAssetPath("/images/hero.webp")}
            alt="Styleco orange overshirt editorial"
            fill
            sizes="100vw"
          />
        </div>
      )}
      {page === "contact" && <ContactForm />}
      {page === "size-guide" && <SizeTable />}
      <div className="info-sections">
        {data.sections.map(([title, text]) =>
          page === "faq" ? (
            <details key={title}>
              <summary>
                {title}
                <span>+</span>
              </summary>
              <p>{text}</p>
            </details>
          ) : (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ),
        )}
      </div>
      <Link href="/new-arrivals" className="text-cta">
        Back to the good stuff ↗
      </Link>
    </main>
  );
}
