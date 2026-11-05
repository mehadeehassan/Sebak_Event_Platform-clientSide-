import Link from "next/link";
import { HandHeart, Mail, MapPin } from "lucide-react";
import { FacebookIcon, GithubIcon, XIcon, YoutubeIcon } from "@/components/brand-icons";
import CurrentYear from "@/components/current-year";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/upcoming-events", label: "Upcoming Events" },
  { href: "/create-event", label: "Create Event" },
  { href: "/joined-events", label: "Joined Events" },
  { href: "/manage-events", label: "Manage Events" },
];

const categoryLinks = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blanket Distribution",
  "Blood Donation",
  "Health Camp",
];

const socialLinks = [
  { label: "Follow Sebak on X", href: "https://x.com/", icon: XIcon },
  { label: "Sebak on Facebook", href: "https://facebook.com/", icon: FacebookIcon },
  { label: "Sebak on YouTube", href: "https://youtube.com/", icon: YoutubeIcon },
  { label: "Sebak on GitHub", href: "https://github.com/", icon: GithubIcon },
];

export default function Footer() {
  return (
    <footer className="bg-teal-950 text-teal-50 dark:bg-[oklch(0.16_0.02_195)]">
      <div className="container-wide grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-teal-400 text-teal-950">
              <HandHeart className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight">Sebak</span>
          </div>
          <p className="text-sm leading-relaxed text-teal-100/80">
            Sebak is a community-driven platform that connects volunteers with social
            development events across Bangladesh, so helping hands always find each other.
          </p>
          <div className="flex gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-white/10 text-teal-50 transition-colors hover:bg-teal-400 hover:text-teal-950"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-widest text-teal-200 uppercase">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-teal-100/80">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-teal-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-widest text-teal-200 uppercase">
            Event Types
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-teal-100/80">
            {categoryLinks.map((label) => (
              <li key={label}>
                <Link href="/upcoming-events" className="transition-colors hover:text-teal-50">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-widest text-teal-200 uppercase">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-teal-100/80">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-teal-300" />
              <a href="mailto:hello@sebak.app" className="transition-colors hover:text-teal-50">
                hello@sebak.app
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-300" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-teal-100/10">
        <p className="container-wide py-4 text-center text-xs text-teal-100/60">
          © <CurrentYear /> Sebak — a community service platform. Built together, served together.
        </p>
      </div>
    </footer>
  );
}
