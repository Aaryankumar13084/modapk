import { UploadForm } from "@/components/UploadForm";

export default function Upload() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upload APK File</h3>
          <p className="mt-1 text-sm text-gray-500">Share your modified APK with the community.</p>
        </div>
        <div className="px-6 py-6">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
