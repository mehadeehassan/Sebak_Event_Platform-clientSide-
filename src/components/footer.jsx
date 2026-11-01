import { Facebook, Github, Mail, MapPin, Youtube } from "lucide-react";

/* The new X logo (post rebrand), not the old bird. */
function XLogo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
  { label: "Follow Sebak on X", href: "https://x.com/", icon: XLogo },
  { label: "Sebak on Facebook", href: "https://facebook.com/", icon: Facebook },
  { label: "Sebak on YouTube", href: "https://youtube.com/", icon: Youtube },
  { label: "Sebak on GitHub", href: "https://github.com/", icon: Github },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-teal-950 text-teal-50 dark:bg-[oklch(0.16_0.02_195)]">
      <div className="container-wide grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-teal-400 text-teal-950">
              <LogoMark />
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
          © {year} Sebak — a community service platform. Built together, served together.
        </p>
      </div>
    </footer>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M12 21.35a.95.95 0 0 1-.7-.3l-6.3-6.2C2.9 12.75 2 10.9 2 9.2 2 5.9 4.55 3.5 7.75 3.5c1.7 0 3.25.8 4.25 2.05C13 4.3 14.55 3.5 16.25 3.5 19.45 3.5 22 5.9 22 9.2c0 1.7-.9 3.55-3 5.65l-6.3 6.2a.95.95 0 0 1-.7.3z" />
    </svg>
  );
}
