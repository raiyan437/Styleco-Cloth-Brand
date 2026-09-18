import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import type { HomepageContent } from "@/domain/homepage";
export function Hero({ content }: { content: HomepageContent["hero"] }) {
  const lines = content.title.split("\n");
  return (
    <section className="hero site-container">
      <div className="hero-copy">
        <p className="text-eyebrow">
          <span className="tiny-star">✳</span> {content.eyebrow}
        </p>
        <h1>
          {lines[0]}
          <br />
          <span>{lines[1]}</span>
        </h1>
        <p className="hero-description">{content.description}</p>
        <Link className="button hero-cta" href={content.href}>
          {content.cta}
          <ArrowUpRight size={20} />
        </Link>
        <div className="hero-bottom">
          <span>
            LOOK GOOD.
            <br />
            FEEL LIKE YOURSELF.
          </span>
          <a
            href="#categories"
            className="icon-button circle-outline"
            aria-label="Explore categories below"
          >
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <Image
          src={content.image}
          alt={content.alt}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          priority
        />
        <div className="hero-image-caption">
          <span>THE EVERYDAY EDIT</span>
          <span>01 / 05</span>
        </div>
        <div className="hero-sticker">
          <span>MADE TO</span>
          <strong>live in.</strong>
          <span>STYLECO ORIGINALS</span>
        </div>
      </div>
      <div className="hero-side-note">NOT JUST CLOTHES. A FEELING.</div>
    </section>
  );
}
export function Campaigns({ content }: { content: HomepageContent }) {
  const first = content.campaigns[0]!;
  const second = content.campaigns[1]!;
  return (
    <div className="site-container campaigns">
      <section className="campaign-main">
        <div className="campaign-photo">
          <Image
            src={first.image}
            alt={first.alt}
            fill
            sizes="(max-width:767px) 100vw, 50vw"
          />
        </div>
        <div className="campaign-copy">
          <p className="text-eyebrow">{first.eyebrow}</p>
          <h2>{first.title}</h2>
          <p>{first.description}</p>
          <Link className="text-cta" href={first.href}>
            {first.cta}
            <ArrowUpRight />
          </Link>
          <span className="campaign-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
      <section className="campaign-mosaic">
        <div className="slow-campaign">
          <Image
            src={second.image}
            alt={second.alt}
            fill
            sizes="(max-width:767px) 100vw, 60vw"
          />
          <div>
            <p className="text-eyebrow">{second.eyebrow}</p>
            <h2>{second.title}</h2>
            <Link className="button button-light" href={second.href}>
              {second.cta}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="sale-campaign">
          <p className="text-eyebrow">{content.promotion.eyebrow}</p>
          <h2>
            {content.promotion.title.split("\n").map((line, index) => (
              <span
                key={line}
                style={{
                  display: "block",
                  fontSize: index === 2 ? "0.6em" : "inherit",
                }}
              >
                {line}
              </span>
            ))}
          </h2>
          <Link className="text-cta" href={content.promotion.href}>
            {content.promotion.cta} <ArrowUpRight />
          </Link>
          <div className="sale-stamp">{content.promotion.stamp}</div>
        </div>
      </section>
    </div>
  );
}
