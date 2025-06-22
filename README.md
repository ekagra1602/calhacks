# EpicVideo3D

A React web application for generating cinematic videos using the Veo 3 API and proceeding to 3D rendering.

## Features

- **Text Prompt Input**: Enter video descriptions via textarea or upload text files
- **Veo 3 API Integration**: Generate 8-second cinematic videos using veo-3.0-generate-preview
- **Real-time Loading**: Beautiful spinner animations during video generation
- **Video Preview**: In-browser MP4 video player with controls
- **Regeneration**: Edit prompts and regenerate videos
- **3D Processing**: Proceed to 3D rendering with finalized videos
- **Modern UI**: Clean, responsive design with gradient backgrounds

## Project Structure

```
epicvideo3d/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── App.css        # Application styles
│   │   ├── index.tsx      # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── tsconfig.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── package.json
│   └── .env               # Environment variables
├── package.json           # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Veo 3 API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd epicvideo3d
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

5. **Environment Configuration**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env` with your API credentials:
   ```
   PORT=5000
   VEO3_API_KEY=your_actual_veo3_api_key
   VEO3_API_URL=https://api.veo3.com/v1/generate-preview
   ```

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## API Endpoints

### Backend Routes

- `POST /api/generate-video` - Generate video from text prompt
- `GET /api/video-status/:jobId` - Check video generation status
- `POST /api/proceed-to-3d` - Initiate 3D rendering process
- `GET /api/health` - Health check endpoint

## Usage Flow

1. **Enter Prompt**: Type a video description or upload a text file
2. **Generate**: Click "Generate Video" to call Veo 3 API
3. **Wait**: Loading spinner shows while video is being generated
4. **Preview**: Generated MP4 video appears in the player
5. **Edit/Regenerate**: Modify prompt and regenerate if needed
6. **Proceed**: Click "Proceed to 3D" to send video for 3D processing

## Technology Stack

### Frontend
- React 18 with TypeScript
- Modern CSS with gradients and animations
- Responsive design for mobile/desktop
- File upload handling

### Backend
- Node.js with Express
- Axios for API calls
- CORS enabled
- Environment variable configuration
- Error handling and logging

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `VEO3_API_KEY` | Veo 3 API authentication key | Required |
| `VEO3_API_URL` | Veo 3 API endpoint | `https://api.veo3.com/v1/generate-preview` |

##Deployment

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server:**
   ```bash
   cd server
   npm start
   ```

3. **Configure environment variables** for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
