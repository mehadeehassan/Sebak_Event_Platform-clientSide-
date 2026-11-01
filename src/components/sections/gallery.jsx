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
    src: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop",
    alt: "Neighbourhood street cleanup",
  },
  {
    src: "https://images.unsplash.com/photo-1466921583968-f07aa80c526e?q=80&w=800&auto=format&fit=crop",
    alt: "Volunteer team huddle",
  },
  {
    src: "https://images.unsplash.com/photo-1471560090527-d1af5e4e6eb6?q=80&w=800&auto=format&fit=crop",
    alt: "Winter clothes drive",
  },
  {
    src: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=800&auto=format&fit=crop",
    alt: "Beach cleanup campaign",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    alt: "Donation handover ceremony",
  },
  {
    src: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop",
    alt: "Community planning meeting",
  },
];

export default function Gallery() {
  return (
    <section className="bg-secondary/40 py-16 md:py-24 dark:bg-white/5">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments of service"
          description="Snapshots from community drives, cleanups and plantations across the country."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {GALLERY_IMAGES.map((image) => (
            <figure key={image.alt} className="group relative overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
