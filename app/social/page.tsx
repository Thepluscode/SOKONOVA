import { getCommunityStories, getInfluencerStorefronts } from "@/lib/api/social";
import { StoryCard } from "@/components/StoryCard";
import { InfluencerCard } from "@/components/InfluencerCard";
import Image from "next/image";
import Link from "next/link";

export default async function SocialPage() {
  // Fetch community stories and influencer storefronts
  const [storiesResponse, influencersResponse] = await Promise.all([
    getCommunityStories(10),
    getInfluencerStorefronts(10)
  ]);

  const stories = storiesResponse || [];
  const influencers = influencersResponse || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Community Stories
        </h1>
        <p className="text-muted-foreground text-sm">
          See what others are saying about products on SokoNova
        </p>
      </header>

      {/* Community Stories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Latest Stories</h2>
        </div>
        
        {stories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story: any) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No community stories yet. Be the first to share your experience!</p>
          </div>
        )}
      </section>

      {/* Influencer Storefronts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Featured Influencers</h2>
        </div>
        
        {influencers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {influencers.map((influencer: any) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured influencers yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}