import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateEncryptionKey, generateVerificationHash } from "@/utils/encryption";

export function SignInForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const { data: profile } = await supabase
        .from('profiles')
        .select('encryption_key_verification')
        .single();

      if (profile?.encryption_key_verification) {
        const { key } = await generateEncryptionKey(password);
        const verificationHash = await generateVerificationHash(key);

        if (verificationHash !== profile.encryption_key_verification) {
          throw new Error("Incorrect password");
        }
      } else {
        const { key } = await generateEncryptionKey(password);
        const verificationHash = await generateVerificationHash(key);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ encryption_key_verification: verificationHash })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (updateError) throw updateError;
      }

      window.sessionStorage.setItem('temp_encryption_key', password);

      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while signing in.",
        variant: "destructive",
      });

      if (error.message === "Incorrect password") {
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Button
            type="button"
            variant="link"
            className="px-0 font-normal text-sm"
            onClick={handleResetPassword}
            disabled={loading || resetEmailSent}
          >
            {resetEmailSent ? "Check your email" : "Forgot password?"}
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <p className="text-xs text-muted-foreground">
          Your password is used both for authentication and to encrypt your sensitive journal data.
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full duo-button"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}