import Banner from "@/components/sections/banner";
import EventTypeNav from "@/components/event-type-nav";
import Features from "@/components/sections/features";
import RecentEvents from "@/components/sections/recent-events";
import Gallery from "@/components/sections/gallery";
import Newsletter from "@/components/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <Banner />
      <EventTypeNav />
      <Features />
      <RecentEvents />
      <Gallery />
      <Newsletter />
    </>
  );
}
