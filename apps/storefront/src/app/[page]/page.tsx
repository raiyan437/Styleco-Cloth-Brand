import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/info/demo-forms";
import { SizeTable } from "@/components/catalog/size-guide";
import { Breadcrumb } from "@/components/ui/shared";
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
        "A work in progress. Just like good style.",
        "Styleco is currently a local frontend concept. Product imagery, prices and brand statements are illustrative, ready for a real collection to make them its own.",
      ],
    ],
  },
  contact: {
    title: "Let’s talk.",
    eyebrow: "WE’RE ALL EARS",
    intro:
      "A question about a fit? A thought about the collection? We’d love to hear it. This contact form is a visual demo and does not send messages.",
    sections: [],
  },
  faq: {
    title: "Good questions.",
    eyebrow: "A LITTLE HELP GOES A LONG WAY",
    intro:
      "A few things you might be wondering. These are preview policies for the demo.",
    sections: [
      [
        "Can I place a real order?",
        "No. This storefront is an interactive frontend demo. Checkout simulates an order without payment or delivery.",
      ],
      [
        "How do I find my size?",
        "Open the size guide from any product page. If you like an easy fit, choose your usual size. All sizing is illustrative for now.",
      ],
      [
        "Where is my wishlist saved?",
        "Favorites and your bag are saved on this browser using localStorage. They are not linked to an account or synced between devices.",
      ],
      [
        "What happens at checkout?",
        "Choose Cash on Delivery or a displayed demo card number. You will receive an on-screen confirmation only. No email is sent.",
      ],
      [
        "Can I return a piece?",
        "The proposed return window is 7 days for unworn pieces. This is a draft policy; there are no real purchases in the demo.",
      ],
    ],
  },
  "shipping-returns": {
    title: "Good things, on their way.",
    eyebrow: "SHIPPING & RETURNS",
    intro:
      "Simple delivery. A little room to change your mind. These are illustrative demo policies, not a fulfillment promise.",
    sections: [
      [
        "Standard delivery",
        "৳80 for orders below ৳3,000; free at a merchandise subtotal of ৳3,000 or more, before coupon discounts. Indicative delivery: 3–5 working days.",
      ],
      [
        "Express delivery",
        "৳150. Indicative delivery: 1–2 working days. Select your option at demo checkout.",
      ],
      [
        "Room to reconsider",
        "Proposed policy: return unworn, unwashed pieces with tags within 7 days. Final policy and service coverage will be confirmed before a real launch.",
      ],
    ],
  },
  "size-guide": {
    title: "Find your feel-good fit.",
    eyebrow: "THE SIZE GUIDE",
    intro:
      "A little measuring goes a long way. Use this general demo guide as a starting point.",
    sections: [],
  },
  privacy: {
    title: "Your space matters.",
    eyebrow: "PRIVACY · DEMO NOTICE",
    intro:
      "This prototype has no backend, tracking pixel, email provider or real authentication. This page describes the current local demo, not a final production privacy policy.",
    sections: [
      [
        "On this browser",
        "Bag items, saved products and the demo coupon are stored in localStorage. Your most recent order address is stored in sessionStorage for the current browser session.",
      ],
      [
        "What we don’t collect",
        "Card numbers and login passwords are not stored or sent. Account details and product reviews shown in the demo are illustrative.",
      ],
      [
        "Your control",
        "Clear this site's browser storage to remove the bag and favorites. Closing the browser tab clears session order information according to your browser's session behavior. Final production privacy terms will be defined before launch.",
      ],
    ],
  },
  terms: {
    title: "A few ground rules.",
    eyebrow: "TERMS · DEMO NOTICE",
    intro:
      "Styleco is a frontend demonstration for visual and functional review. It does not sell or fulfill products at this stage.",
    sections: [
      [
        "Illustrative content",
        "Images, stock, prices, discounts, reviews and delivery estimates are sample content. They do not constitute a sales offer.",
      ],
      [
        "No transactions",
        "The checkout is simulated. Do not enter real payment information; use the supplied test numbers only. No money is collected.",
      ],
      [
        "Before launch",
        "Real policies, service coverage, product descriptions and consumer terms must be finalized before accepting real orders.",
      ],
    ],
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  return { title: content[(await params).page]?.title ?? "Page not found" };
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
            src="/images/hero.webp"
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
