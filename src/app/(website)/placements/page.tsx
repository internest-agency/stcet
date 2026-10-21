import PlacementHero from "@/src/components/sections/placement/PlacementHero";
import PlacementHead from "@/src/components/sections/placement/PlacementHead";
import IndustryConnect from "@/src/components/sections/placement/IndustryConnect";
import CareerReadiness from "@/src/components/sections/placement/CareerReadiness";
import IndustryEngagement from "@/src/components/sections/placement/IndustryEngagement";
import PlacementFuture from "@/src/components/sections/placement/PlacementFuture";
import PlacementCell from "@/src/components/sections/placement/PlacementCell";
import ManagedPlacementContent from "@/src/components/sections/placement/ManagedPlacementContent";
import {
  getPublishedPlacementContent,
  getPublishedPlacementLeadership,
} from "@/src/lib/queries/placements";

export default async function PlacementPage() {
  const [content, leadership] = await Promise.all([
    getPublishedPlacementContent(),
    getPublishedPlacementLeadership(),
  ]);
  return (
    <>
      <PlacementHero />
      <PlacementCell />
      <PlacementHead content={leadership ?? undefined} />
      <IndustryConnect />
      <CareerReadiness />
      <IndustryEngagement />
      {/* <ManagedPlacementContent {...content} /> */}
      <PlacementFuture />
    </>
  );
}
