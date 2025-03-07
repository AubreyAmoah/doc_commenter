// components/CaseDetails.jsx
export default function CaseDetails({ caseData, files }) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          {caseData.name}
        </h2>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Created:</span>{" "}
          {new Date(caseData.createdTime).toLocaleDateString()}
        </p>
        {caseData.description && (
          <p className="text-gray-700 mt-2">{caseData.description}</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Case Files</h3>
        {files && files.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id} className="py-3">
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:bg-gray-50 p-2 rounded transition"
                >
                  <div>
                    <p className="font-medium text-blue-600">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.mimeType.replace(
                        "application/vnd.google-apps.",
                        ""
                      )}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No files found in this case folder.</p>
        )}
      </div>
    </div>
  );
}
