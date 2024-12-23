import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EntryDetailsDialogProps {
  entry: {
    date: Date;
    type: string;
    resisted: boolean;
    level: string;
    trigger: string;
    notes: string;
    mood?: number;
    affirmation?: string;
  } | null;
  onOpenChange: (open: boolean) => void;
}

const getTemptationLevelText = (value: string) => {
  const levelValue = parseInt(value);
  if (levelValue <= 25) return "Low - I can resist easily";
  if (levelValue <= 50) return "Medium - It's challenging but manageable";
  if (levelValue <= 75) return "High - I struggle significantly";
  return "Severe - Almost impossible to resist";
};

export const EntryDetailsDialog = ({ entry, onOpenChange }: EntryDetailsDialogProps) => {
  if (!entry) return null;

  const isCheckIn = entry.type === "Daily check-in";

  return (
    <Dialog open={!!entry} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry.type} - {format(entry.date || new Date(), "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!isCheckIn && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outcome</p>
              <p>{entry.resisted ? "Resisted" : "Gave in"}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Level</p>
            <p>{getTemptationLevelText(entry.level)}</p>
          </div>
          {!isCheckIn && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trigger</p>
              <p>{entry.trigger}</p>
            </div>
          )}
          {isCheckIn ? (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mood Description</p>
                <p>{entry.notes}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Affirmation</p>
                <p>{entry.affirmation}</p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p>{entry.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};