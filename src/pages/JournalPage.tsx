import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntriesList } from "@/components/journal/JournalEntriesList";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentSection } from "@/components/layout/ContentSection";

export default function JournalPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          const sampleEntries = [
            {
              id: 1,
              created_at: new Date().toISOString(),
              entry_type: 'check-in',
              checkin_entries: [{
                mood_score: 4,
                temptation_type: 'pride',
                intensity_level: 3
              }]
            },
            {
              id: 2,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              entry_type: 'temptation',
              temptation_entries: [{
                temptation_type: 'greed',
                intensity_level: 2,
                resisted: true
              }]
            }
          ];
          setEntries(sampleEntries);
          return;
        }

        const { data, error } = await supabase
          .from('journal_entries')
          .select(`
            id,
            entry_type,
            created_at,
            temptation_entries (
              temptation_type,
              intensity_level,
              resisted
            ),
            checkin_entries (
              mood_score,
              temptation_type,
              intensity_level
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching entries:', error);
          toast({
            title: "Error loading entries",
            description: "Please try again later",
            variant: "destructive",
          });
          setEntries([]);
        } else {
          setEntries(data || []);
        }
      } catch (error) {
        console.error('Error in loadEntries:', error);
        toast({
          title: "Error loading entries",
          description: "Please try again later",
          variant: "destructive",
        });
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [user, toast]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const dailyCheckIn = showCalendar && date
    ? entries.find(entry => 
        new Date(entry.created_at).toDateString() === date.toDateString() && 
        entry.entry_type === "check-in"
      )
    : null;

  return (
    <PageContainer fullHeight className="py-4 sm:py-6 md:py-8">
      <ContentSection className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Journal</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2"
          >
            {showCalendar ? (
              <>View All Entries <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Filter by Date <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
        
        {!user && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>
                You're viewing sample data. Sign in to track your own journal entries.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {showCalendar && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
              <JournalCalendar
                date={date}
                onDateSelect={handleDateSelect}
                dailyCheckIn={dailyCheckIn}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 sm:gap-8">
            <JournalEntriesList 
              showCalendar={showCalendar}
              isLoading={isLoading}
              entries={entries}
              date={date}
            />

            {showCalendar && (
              <div className="hidden lg:block">
                <JournalCalendar
                  date={date}
                  onDateSelect={handleDateSelect}
                  dailyCheckIn={dailyCheckIn}
                />
              </div>
            )}
          </div>
        </div>
      </ContentSection>
    </PageContainer>
  );
}