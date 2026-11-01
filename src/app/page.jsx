import Banner from "@/components/sections/banner";
import Features from "@/components/sections/features";
import RecentEvents from "@/components/sections/recent-events";
import Gallery from "@/components/sections/gallery";
import Newsletter from "@/components/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Features />
      <RecentEvents />
      <Gallery />
      <Newsletter />
    </>
  );
}
