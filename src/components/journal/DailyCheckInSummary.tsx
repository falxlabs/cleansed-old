import { format, isToday } from "date-fns";
import { getMoodEmoji } from "./EntryDetailsDialog";
import { getSinEmoji } from "@/utils/sinEmoji";
import { getSeverityEmoji } from "@/utils/severityEmoji";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface DailyCheckInSummaryProps {
  entry?: {
    date: Date;
    trigger: string;
    level: string;
    mood?: number;
    description?: string;
    affirmation?: string;
  };
  date: Date;
}

const getTemptationLevelText = (level: string) => {
  const levelNum = parseInt(level);
  if (levelNum <= 25) return "Low";
  if (levelNum <= 50) return "Medium";
  if (levelNum <= 75) return "High";
  return "Severe";
};

export const DailyCheckInSummary = ({ entry, date }: DailyCheckInSummaryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!entry && isToday(date)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <span className="text-4xl">📝</span>
          <p className="text-muted-foreground mb-4">
            Fill out your daily check-in now
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/daily-checkin')}
              className="w-full"
              disabled={!user}
            >
              Start Check-in
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground">
                Please sign in to start your daily check-in
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <span className="text-4xl">😢</span>
          <p className="text-muted-foreground">
            Daily check-in was missed on {format(date, "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-primary">Mood</p>
          <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
        </div>
        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${entry.mood}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border">
          <p className="text-xs font-semibold text-primary mb-1">Challenge</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getSinEmoji(entry.trigger)}</span>
            <p className="text-sm capitalize truncate">{entry.trigger}</p>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-xl border">
          <p className="text-xs font-semibold text-primary mb-1">Intensity</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getSeverityEmoji(entry.level)}</span>
            <p className="text-sm truncate">{getTemptationLevelText(entry.level)}</p>
          </div>
        </div>
      </div>

      {entry.description && (
        <div className="bg-white p-3 rounded-xl border">
          <p className="text-xs font-semibold text-primary mb-1">Description</p>
          <p className="text-sm line-clamp-2">{entry.description}</p>
        </div>
      )}

      {entry.affirmation && (
        <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
          <p className="text-xs font-semibold text-primary mb-1">Affirmation</p>
          <p className="text-sm italic line-clamp-2">"{entry.affirmation}"</p>
        </div>
      )}
    </div>
  );
};