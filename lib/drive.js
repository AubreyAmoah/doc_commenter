// lib/drive.js
import { google } from "googleapis";

export async function getDriveClient(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.drive({ version: "v3", auth });
}

export async function searchCases(accessToken, query) {
  const drive = await getDriveClient(accessToken);

  // Search for folders with mimeType=folder and name contains query
  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name contains '${query}'`,
    fields: "files(id, name, createdTime)",
    orderBy: "createdTime desc",
  });

  return response.data.files;
}

export async function getCaseFiles(accessToken, caseId) {
  const drive = await getDriveClient(accessToken);

  // Get all files inside the case folder
  const response = await drive.files.list({
    q: `'${caseId}' in parents`,
    fields: "files(id, name, mimeType, webViewLink, createdTime)",
    orderBy: "createdTime desc",
  });

  return response.data.files;
}

export async function getCaseDetails(accessToken, caseId) {
  const drive = await getDriveClient(accessToken);

  // Get the case folder details
  const response = await drive.files.get({
    fileId: caseId,
    fields: "id, name, createdTime, description",
  });

  return response.data;
}
