export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-3 leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
