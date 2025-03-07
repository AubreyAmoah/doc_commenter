# Legal Case Notes App

A Next.js 15 application that integrates with Google Drive to help law firms manage case files and add digital notes or reminders.

## Overview

This application allows legal professionals to:

- Search for case folders stored in Google Drive
- View case details and files
- Add, edit, and delete digital notes/reminders for specific cases
- Replace paper-based note systems with a digital solution

## Features

- **Google Drive Integration**: Access case files directly from your existing Google Drive structure
- **Case Search**: Quickly find cases by name
- **Digital Notes System**: Add timestamped notes and reminders to case files
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Authentication**: OAuth 2.0 with Google

## Setup Requirements

### Prerequisites

- Node.js 18.17 or later
- Google Cloud Platform account
- MongoDB database (for storing notes)

### Environment Variables

Create a `.env.local` file with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000 # In development
```

### Google Cloud Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Drive API
3. Create OAuth credentials (Web application type)
4. Configure the OAuth consent screen
5. Add the following authorized redirect URI:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
6. Configure the following OAuth scopes:
   - `https://www.googleapis.com/auth/drive.readonly`
   - `https://www.googleapis.com/auth/drive.file`
   - `email`
   - `profile`

### MongoDB Setup

1. Create a MongoDB database (either locally or using MongoDB Atlas)
2. Set up a collection named `notes` for storing case notes

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/legal-case-notes.git
cd legal-case-notes
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                   # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── cases/             # Case pages
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Home page
├── public/                # Static assets
├── .env.local             # Environment variables (create this)
├── next.config.js         # Next.js configuration
└── package.json           # Project dependencies
```

## Usage

1. **Sign In**: Use your Google account to authenticate
2. **Search Cases**: Enter a case name to search your Google Drive folders
3. **View Case Details**: Click on a case to see its files and notes
4. **Add Notes**: Use the note form to add reminders or event details
5. **Manage Notes**: Edit or delete existing notes as needed

## Deployment

This application can be deployed to any hosting service that supports Next.js applications, such as:

- Vercel
- Netlify
- AWS Amplify
- Self-hosted servers

Remember to update your environment variables and OAuth redirect URIs for your production domain.

## License

[MIT](LICENSE)

## Support

For issues or questions, please open an issue in the GitHub repository.