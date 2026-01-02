import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../shared/Logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function TeacherLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 TEACHER LOGIN
  const handleTeacherLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (res.data.user.role !== "teacher") {
        toast.error("Please login from Student Login page");
        return;
      }

      login(res.data);
      toast.success("Teacher logged in successfully 👨‍🏫");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // 📝 TEACHER SIGNUP
  const handleTeacherSignup = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: "teacher",
      });

      login(res.data);
      toast.success("Teacher account created successfully 🎓");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle>
            {isSignup ? "Create Teacher Account" : "Teacher Login"}
          </CardTitle>
          <CardDescription>
            {isSignup
              ? "Join as a teacher and start inspiring students"
              : "Access your teaching dashboard"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 👤 Full Name (Signup only) */}
          {isSignup && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* 📧 Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="teacher@eduquest.com"
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

          {/* 🔘 MAIN BUTTON */}
          <Button
            className="w-full"
            onClick={isSignup ? handleTeacherSignup : handleTeacherLogin}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up as Teacher"
              : "Login as Teacher"}
          </Button>

          {/* 🔁 TOGGLE LOGIN / SIGNUP */}
          <div className="text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-orange-600 hover:underline"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* 🔁 SWITCH TO STUDENT LOGIN */}
          <div className="pt-4 border-t">
            <Button
              variant="link"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Login as Student →
            </Button>
          </div>

          <div className="text-center pt-4">
            <div className="text-4xl mb-2">👨‍🏫</div>
            <p className="text-xs text-gray-500">
              Teach. Inspire. Empower.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
