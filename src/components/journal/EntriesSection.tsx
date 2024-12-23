import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EntriesTable } from "./EntriesTable";

interface Entry {
  id: number;
  date: Date;
  type: string;
  resisted: boolean;
  level: string;
  trigger: string;
  notes: string;
  mood?: number;
  affirmation?: string;
}

interface EntriesSectionProps {
  entries: Entry[];
  isLoading: boolean;
  showCalendar: boolean;
  onEntryClick: (entry: Entry) => void;
}

export const EntriesSection = ({ entries, isLoading, showCalendar, onEntryClick }: EntriesSectionProps) => {
  return (
    <Card className={`${showCalendar ? "" : "lg:col-span-2"}`}>
      <CardHeader className="p-4">
        <CardTitle>Entries</CardTitle>
        <CardDescription>
          {showCalendar 
            ? "Showing entries for selected date" 
            : "Showing all entries"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading entries...
            </div>
          ) : (
            <EntriesTable 
              entries={entries} 
              onEntryClick={onEntryClick} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};