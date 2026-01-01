import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ArrowLeft,
  Camera,
  Trophy,
  BookOpen,
  LogOut,
} from "lucide-react";
import { Student, Language } from "../../types";
import { languageOptions } from "../../lib/mockData";
import { updateProfile } from "../../services/api";
import { toast } from "sonner";

interface ProfilePageProps {
  student: Student;
  onBack: () => void;
  onLogout: () => void;
}

export function ProfilePage({ student, onBack, onLogout }: ProfilePageProps) {
  /* ================= STATES ================= */
  const [name, setName] = useState(student.name || "");
  const [email, setEmail] = useState(student.email || "");
  const [studentClass, setStudentClass] = useState(student.class || "");
  const [language, setLanguage] = useState<Language>("en");
  const [offlineMode, setOfflineMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD LOCAL DATA ================= */
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    const savedOffline = localStorage.getItem("offlineMode");
    const savedImage = localStorage.getItem("profileImage");

    if (savedLang) setLanguage(savedLang as Language);
    if (savedOffline) setOfflineMode(savedOffline === "true");
    if (savedImage) setProfileImage(savedImage);
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = reader.result as string;
      setProfileImage(img);
      localStorage.setItem("profileImage", img);
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    setSaving(true);

    const payload = {
      name,
      email,
      class: studentClass,
      language,
      offlineMode,
      avatar: profileImage,
    };

    // Offline save
    if (!navigator.onLine) {
      localStorage.setItem("pendingProfileUpdate", JSON.stringify(payload));
      toast("Saved offline. Will sync when online.");
      setSaving(false);
      return;
    }

    try {
      await updateProfile(payload);
      localStorage.setItem("language", language);
      localStorage.setItem("offlineMode", String(offlineMode));
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= OFFLINE → ONLINE SYNC ================= */
  useEffect(() => {
    const syncProfile = async () => {
      const pending = localStorage.getItem("pendingProfileUpdate");
      if (!pending) return;

      try {
        await updateProfile(JSON.parse(pending));
        localStorage.removeItem("pendingProfileUpdate");
        toast.success("Offline changes synced");
      } catch {
        console.error("Sync failed");
      }
    };

    window.addEventListener("online", syncProfile);
    return () => window.removeEventListener("online", syncProfile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl">Profile</h1>
            <p className="text-gray-600">Manage your account settings</p>
          </div>
        </div>

        {/* PROFILE CARD */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl">
                      {name.charAt(0) || "S"}
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="profile-upload"
                  onChange={handleImageUpload}
                />

                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("profile-upload")?.click()
                  }
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center">
                <h2 className="text-xl">{name || "Student"}</h2>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">Level {student.progress?.level ?? 1}</p>
                <p className="text-xs text-gray-600">
                  {student.progress?.xp ?? 0} XP
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl">
                  {student.badges?.filter((b: any) => b.unlocked).length ?? 0}
                </p>
                <p className="text-xs text-gray-600">Badges Earned</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PERSONAL INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Class</Label>
              <Input
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SETTINGS */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Offline Mode</Label>
                <p className="text-xs text-gray-600">
                  Save lessons and quizzes locally
                </p>
              </div>
              <Switch
                checked={offlineMode}
                onCheckedChange={(v) => {
                  setOfflineMode(v);
                  localStorage.setItem("offlineMode", String(v));
                }}
              />
            </div>

            <div>
              <Label>Preferred Language</Label>
              <Select
                value={language}
                onValueChange={(val) => {
                  setLanguage(val as Language);
                  localStorage.setItem("language", val);
                }}
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
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          <Button variant="outline" className="flex-1" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
