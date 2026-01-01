import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Languages } from "lucide-react";
import { Subject, Language } from "../../types";

interface SubjectPageProps {
  subject: Subject | null;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export function SubjectPage({
  subject,
  onNavigate,
  onBack,
}: SubjectPageProps) {
  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading subject...</p>
      </div>
    );
  }

  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) =>
      prev === "en" ? "hi" : prev === "hi" ? "mr" : "en"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`${subject.color} w-12 h-12 rounded-full flex items-center justify-center`}
              >
                <span className="text-2xl">{subject.icon}</span>
              </div>
              <h1 className="text-2xl font-semibold">{subject.name}</h1>
            </div>

            <p className="text-gray-600">
              {subject.chapters.length} chapters available
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={toggleLanguage}>
            <Languages className="w-4 h-4 mr-2" />
            {language === "en"
              ? "English"
              : language === "hi"
              ? "हिंदी"
              : "मराठी"}
          </Button>
        </div>

        {/* CHAPTER LIST */}
        <div className="space-y-4">
          {subject.chapters.map((chapter: any, index: number) => (
            <Card key={index} className="hover:shadow-md transition">
              <CardHeader className="space-y-4">
                <Badge className="w-fit">
                  Chapter {index + 1}
                </Badge>

                <CardTitle className="text-xl font-extrabold underline underline-offset-4">
                  {chapter.name}
                </CardTitle>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Description
                  </p>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {chapter.description?.[language]}
                  </CardDescription>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Key Concepts
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {chapter.keyConcepts?.[language]}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex bg-gray-100 rounded-full p-1 gap-1 mb-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("video", { subject, chapter });
                    }}
                    className="flex-1 bg-white text-sm font-medium rounded-full py-1.5 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Content
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("quiz", {
                        preselectedChapter: chapter,
                        directStart: true,
                      });
                    }}
                    className="flex-1 text-sm font-medium rounded-full py-1.5 hover:bg-white transition cursor-pointer"
                  >
                    Practice
                  </button>
                </div>

              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
