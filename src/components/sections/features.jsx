import { CalendarPlus, LayoutList, MonitorSmartphone, ShieldCheck, SunMoon, Users } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: CalendarPlus,
    title: "Create events in minutes",
    description:
      "Fill in the details, pick a future date and your social drive goes live for neighbours to join.",
  },
  {
    icon: Users,
    title: "Join events near you",
    description:
      "Browse upcoming social service events and become a volunteer with a single click.",
  },
  {
    icon: LayoutList,
    title: "Manage your own activities",
    description:
      "Update the details or cancel an event anytime from your personal dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description:
      "Private pages stay protected and every request is verified with a JSON web token.",
  },
  {
    icon: SunMoon,
    title: "Light and dark mode",
    description:
      "A one-click theme switch keeps late night volunteering easy on the eyes.",
  },
  {
    icon: MonitorSmartphone,
    title: "Made for every screen",
    description:
      "The layout adapts smoothly to mobile, tablet and desktop so nobody is left behind.",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Why Sebak"
          title="Everything you need to make it happen"
          description="From planning a clothes drive to tracking who has joined, Sebak gives back the hours you would spend on paperwork."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-shadow hover:shadow-md">
              <CardContent>
                <span className="bg-primary/10 text-primary inline-flex size-11 items-center justify-center rounded-lg">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-heading mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
