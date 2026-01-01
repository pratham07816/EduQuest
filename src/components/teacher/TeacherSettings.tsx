import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { ArrowLeft, Camera, RefreshCw } from "lucide-react";
import { Teacher } from "../../types";
import api from "../../services/api";

interface TeacherSettingsProps {
  teacher: Teacher;
  onBack: () => void;
}

export function TeacherSettings({ teacher, onBack }: TeacherSettingsProps) {
  /* ✅ SAFE INITIAL STATE */
  const [name, setName] = useState(teacher.name || "");
  const [school, setSchool] = useState(teacher.school || "");
  const [specialization, setSpecialization] = useState(
    teacher.specialization || ""
  );

  const [emailNotifications, setEmailNotifications] =
    useState<boolean>(true);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    api.get("/teacher/settings").then((res) => {
      setEmailNotifications(!!res.data.emailNotifications);
      setAutoSync(!!res.data.autoSync);
    });
  }, []);

  /* ================= SAVE SETTINGS ================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      await api.put("/teacher/settings", {
        name,
        school,
        specialization,
        emailNotifications,
        autoSync,
      });

      alert("Settings updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-gray-600">
              Manage your preferences and account
            </p>
          </div>
        </div>

        {/* PROFILE */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="relative w-24">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold">
                {name.charAt(0)}
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={teacher.email} disabled />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <Label>School Name</Label>
                <Input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>

              <div>
                <Label>Subject Specialization</Label>
                <Input
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DATA SYNC */}
        <Card>
          <CardHeader>
            <CardTitle>Data Synchronization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Last Synced</p>
                <p className="text-xs text-gray-600">Just now</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>

            <div className="flex justify-between">
              <div>
                <Label>Auto Sync</Label>
                <p className="text-xs text-gray-600">
                  Automatically sync data with cloud
                </p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>

            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
          </CardContent>
        </Card>

        {/* PREFERENCES */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-gray-600">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-2">
          <Button className="flex-1" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setName(teacher.name || "");
              setSchool(teacher.school || "");
              setSpecialization(teacher.specialization || "");
              setEmailNotifications(true);
              setAutoSync(true);
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
