import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Mascot } from "@/components/dashboard/Mascot";
import { ReflectionTimer } from "@/components/crossroad/ReflectionTimer";
import { ChoiceButtons } from "@/components/crossroad/ChoiceButtons";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentSection } from "@/components/layout/ContentSection";

export default function CrossroadPage() {
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [unlockTime, setUnlockTime] = useState(3);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitToGod = () => {
    toast({
      title: "Praise God!",
      description: "You've chosen the path of righteousness.",
    });
    navigate("/reflection", { state: { choice: "submitted" } });
  };

  const handleFallToSin = () => {
    toast({
      title: "Don't give up!",
      description: "Remember, God's grace is sufficient for you.",
    });
    navigate("/reflection", { state: { choice: "fell" } });
  };

  const mascotMessage = isTimerComplete
    ? "You've waited more than 5 minutes - that's incredible strength! Keep going, you're doing amazing."
    : "Take a moment to try one of these activities. Remember, God is with you, guiding and strengthening you right now";

  return (
    <PageContainer fullHeight className="flex flex-col h-full">
      <div className="flex justify-start">
        <Button 
          variant="ghost" 
          className="mb-2" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <ContentSection className="flex-1 flex flex-col gap-4 sm:gap-6">
        <Mascot 
          message={mascotMessage}
          className="animate-fade-in"
        />

        <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-6">
          <ReflectionTimer 
            onComplete={() => setIsTimerComplete(true)} 
            onUnlockTimeChange={setUnlockTime}
          />
          
          <ChoiceButtons
            onSubmitToGod={handleSubmitToGod}
            onFallToSin={handleFallToSin}
            isTimerComplete={isTimerComplete}
            unlockTime={unlockTime}
          />
        </div>
      </ContentSection>
    </PageContainer>
  );
}