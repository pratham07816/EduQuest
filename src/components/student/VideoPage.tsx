import { Button } from "../ui/button";
import { ArrowLeft, Download } from "lucide-react";

interface VideoPageProps {
  data: {
    subject: any;
    chapter: any;
  };
  onBack: () => void;
}

export function VideoPage({ data, onBack }: VideoPageProps) {
  const { subject, chapter } = data;

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{chapter.name}</h1>
            <p className="text-sm text-gray-600">{subject.name}</p>
          </div>
        </div>

        {/* VIDEO PLAYER */}
        <div className="flex justify-center">
          <video
            controls
            src={chapter.videoUrl}
            className="w-full max-w-2xl rounded-lg shadow"
            style={{ aspectRatio: "16 / 9" }}
          />
        </div>

        {/* DOWNLOAD NOTES */}
        {chapter.pdfUrl && (
          <Button
            variant="outline"
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_API_BASE_URL}/downloads/${chapter.pdfUrl}`
              )
            }
          >
            <Download className="w-4 h-4 mr-2" />
            Download Notes
          </Button>
        )}
      </div>
    </div>
  );
}
