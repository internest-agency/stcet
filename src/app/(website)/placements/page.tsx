import PlacementHero from "@/src/components/sections/placement/PlacementHero";
import PlacementHead from "@/src/components/sections/placement/PlacementHead";
import IndustryConnect from "@/src/components/sections/placement/IndustryConnect";
import CareerReadiness from "@/src/components/sections/placement/CareerReadiness";
import IndustryEngagement from "@/src/components/sections/placement/IndustryEngagement";
import PlacementFuture from "@/src/components/sections/placement/PlacementFuture";

export default function PlacementPage() {
  return (
    <>
      <PlacementHero />
      <PlacementHead />
      <IndustryConnect />
      <CareerReadiness />
      <IndustryEngagement />
      <PlacementFuture />
    </>
  );
}
