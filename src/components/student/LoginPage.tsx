import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../shared/Logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Wifi, WifiOff } from "lucide-react";
import { languageOptions } from "../../lib/mockData";
import { Language } from "../../types";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [isOffline, setIsOffline] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 STUDENT LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (res.data.user.role !== "student") {
        toast.error("Please login as Teacher from Teacher Login page");
        return;
      }

      login(res.data);
      toast.success("Logged in successfully 🎉");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // 📝 STUDENT SIGNUP
  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: "student",
      });

      login(res.data);
      toast.success("Student registered successfully 🎓");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle>{isSignup ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            Empowering Rural Education through Innovation - SDG 4
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 🌐 Language */}
          <div className="space-y-2">
            <Label>Language / भाषा</Label>
            <Select
              value={language}
              onValueChange={(val) => setLanguage(val as Language)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 👤 Full Name */}
          {isSignup && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* 📧 Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="student@eduquest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 🔑 Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={isSignup ? handleSignup : handleLogin}
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsOffline(true)}
          >
            {isOffline ? (
              <WifiOff className="w-4 h-4 mr-2" />
            ) : (
              <Wifi className="w-4 h-4 mr-2" />
            )}
            Continue Offline
          </Button>

          <div className="text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="link"
              className="w-full"
              onClick={() => navigate("/teacher-login")}
            >
              Login as Teacher →
            </Button>
          </div>

          <div className="text-center pt-4">
            <div className="text-4xl mb-2">🎓</div>
            <p className="text-xs text-gray-500">
              Your journey to knowledge starts here!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
