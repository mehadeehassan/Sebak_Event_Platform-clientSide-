import Image from "next/image";
import SectionHeading from "@/components/section-heading";

/* Static snapshots of community service events. */
const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    alt: "Tree plantation drive",
  },
  {
    src: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=800&auto=format&fit=crop",
    alt: "Food distribution day",
  },
  {
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop",
    alt: "Donation drive",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    alt: "Children at a community program",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    alt: "Volunteers planning together",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    alt: "Community team meetup",
  },
  {
    src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop",
    alt: "Helping hands",
  },
  {
    src: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
    alt: "Food bank supplies",
  },
];

export default function Gallery() {
  return (
    <section className="bg-secondary/40 py-12 sm:py-16 md:py-24 dark:bg-white/5">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments of service"
          description="Snapshots from community drives, cleanups and plantations across the country."
        />

        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
          {GALLERY_IMAGES.map((image) => (
            <figure key={image.alt} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-8 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
