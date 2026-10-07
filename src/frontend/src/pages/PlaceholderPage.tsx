import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

/**
 * Route placeholder for dashboard sections whose page bodies are owned by
 * separate tasks. Keeps the route reachable and the shell complete.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border-border bg-card/80 shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-base">
            <Construction className="h-4 w-4 text-primary" />
            بەم زووانە
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ئەم بەشە لە قۆناغی داهاتوودا دروست دەکرێت.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
