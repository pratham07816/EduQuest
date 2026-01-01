import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Lock, Share2, Sparkles } from "lucide-react";
import { Badge as BadgeType } from "../../types";
import { ALL_BADGES } from "../../utils/badges";


interface BadgesPageProps {
  onBack: () => void;
  badges: BadgeType[];
}

export function BadgesPage({ onBack, badges = [] }: BadgesPageProps) {
  const mergedBadges = ALL_BADGES.map((badge) => {
    const unlockedBadge = badges.find((b) => b.id === badge.id);

    return unlockedBadge
      ? {
          ...badge,
          unlocked: true,
          unlockedAt: unlockedBadge.unlockedAt,
        }
      : badge;
  });

  const unlockedBadges = mergedBadges.filter((b) => b.unlocked);
  const lockedBadges = mergedBadges.filter((b) => !b.unlocked);


  const getBadgeStyle = (type: BadgeType["type"]) => {
    if (type === "gold") return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (type === "silver") return "bg-gradient-to-br from-gray-300 to-gray-500";
    return "bg-gradient-to-br from-orange-400 to-orange-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl">Badges & Achievements</h1>
            <p className="text-gray-600">
              {unlockedBadges.length} of {badges.length} badges unlocked
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {["gold", "silver", "bronze"].map((type, i) => (
            <Card key={type}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">{["🥇", "🥈", "🥉"][i]}</div>
                <p className="text-2xl">
                  {mergedBadges.filter((b) => b.unlocked && b.type === type).length}
                </p>
                <p className="text-xs text-gray-600 capitalize">{type}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unlocked Badges */}
        <div>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Unlocked Badges
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {unlockedBadges.map((badge) => (
              <Card key={badge.id}>
                <CardHeader>
                  <div className="flex gap-4">
                    <div
                      className={`w-16 h-16 rounded-full ${getBadgeStyle(
                        badge.type
                      )} flex items-center justify-center text-3xl`}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <CardTitle>{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                      {badge.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked on{" "}
                          {new Date(badge.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="w-3 h-3 mr-2" />
                    Share Badge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            Locked Badges
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {lockedBadges.map((badge) => (
              <Card key={badge.id} className="opacity-60">
                <CardHeader>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl relative">
                      <span className="grayscale">{badge.icon}</span>
                      <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle>{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
