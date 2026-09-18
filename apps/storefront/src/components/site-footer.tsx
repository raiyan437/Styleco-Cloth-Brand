import Link from "next/link";
import { getServices } from "@/services/container";
export async function SiteFooter() {
  const categories = await getServices().catalog.getCategories();
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div className="footer-statement">
            <p className="text-eyebrow">LESS ORDINARY. MORE YOU.</p>
            <h2>
              Wear your
              <br />
              own way.
            </h2>
          </div>
          <div className="footer-links">
            <div>
              <h3>SHOP</h3>
              <Link href="/new-arrivals">New Arrivals</Link>
              {categories.map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
              <Link href="/sale">Sale</Link>
            </div>
            <div>
              <h3>HERE TO HELP</h3>
              <Link href="/contact">Contact us</Link>
              <Link href="/faq">FAQs</Link>
              <Link href="/shipping-returns">Shipping & returns</Link>
              <Link href="/size-guide">Size guide</Link>
            </div>
            <div>
              <h3>STYLECO WORLD</h3>
              <Link href="/about">Our story</Link>
              <Link href="/account">My account</Link>
              <Link href="/wishlist">Your wishlist</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <div>
              <h3>LET’S CONNECT</h3>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook ↗
              </a>
              <p className="footer-note">
                Social destinations are placeholders for the demo.
              </p>
            </div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          styleco<span>®</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Styleco. Every day, your way.</span>
          <span>BDT ৳ · Bangladesh</span>
          <span>LOCAL STOREFRONT DEMO</span>
        </div>
      </div>
    </footer>
  );
}
