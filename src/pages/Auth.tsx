import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Factory, Shield, Users, TrendingUp } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email("Adresse email invalide");
const passwordSchema = z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères");

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError(error.message);
      }
    } else {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, firstName, lastName);
    
    if (error) {
      if (error.message.includes('already registered')) {
        setError('Cet email est déjà utilisé');
      } else {
        setError(error.message);
      }
    } else {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-primary/5">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Factory className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">SFM Pro</span>
          </div>
          
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Shop Floor Management
          </h1>
          <p className="text-muted-foreground mb-12">
            Pilotez la performance opérationnelle de votre usine avec un dashboard visuel et interactif.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/20">
                <TrendingUp className="h-5 w-5 text-status-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Suivi KPI en temps réel</h3>
                <p className="text-sm text-muted-foreground">S, Q, L, C, P, H, E, W</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Gestion collaborative</h3>
                <p className="text-sm text-muted-foreground">Actions et problèmes en équipe</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning/20">
                <Shield className="h-5 w-5 text-status-warning" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Contrôle par rôle</h3>
                <p className="text-sm text-muted-foreground">Admin, Manager, Chef d'équipe, Opérateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Factory className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SFM Pro</span>
            </div>
            <CardTitle className="text-2xl">Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous ou créez un compte pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-4" style={{ width: 'calc(100% - 3rem)' }}>
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Prénom</Label>
                      <Input
                        id="first-name"
                        placeholder="Jean"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nom</Label>
                      <Input
                        id="last-name"
                        placeholder="Dupont"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer un compte"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

          <div className="px-6 pb-6 text-center text-xs text-muted-foreground">
            <p>Nouveau compte = rôle Opérateur par défaut</p>
            <p>Un administrateur peut modifier votre rôle</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
