const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Generate video endpoint - now handles both text and image
app.post('/api/generate-video', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Prepare the request payload
    const veoPayload = {
      prompt: prompt,
      duration: 8,
      style: 'cinematic'
    };

    // If image is provided, we need to handle it
    let imageData = null;
    if (imageFile) {
      try {
        // Read the image file and convert to base64
        const imageBuffer = fs.readFileSync(imageFile.path);
        imageData = imageBuffer.toString('base64');
        
        // Add image to payload
        veoPayload.image = {
          data: imageData,
          mime_type: imageFile.mimetype
        };
        
        // Clean up uploaded file
        fs.unlinkSync(imageFile.path);
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        if (imageFile.path && fs.existsSync(imageFile.path)) {
          fs.unlinkSync(imageFile.path);
        }
      }
    }

    console.log('Sending request to Veo 3 API with:', {
      prompt: prompt,
      hasImage: !!imageData,
      imageSize: imageData ? imageData.length : 0
    });

    // Call Veo 3 API
    const response = await axios.post(
      process.env.VEO3_API_URL || 'https://api.veo3.com/v1/generate-preview',
      veoPayload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VEO3_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout for video generation
      }
    );

    res.json({
      success: true,
      videoUrl: response.data.video_url,
      jobId: response.data.job_id,
      message: imageData ? 'Video generated with image reference' : 'Video generated from text prompt'
    });

  } catch (error) {
    // Clean up uploaded file in case of error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Error generating video:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate video',
      message: error.response?.data?.message || error.message
    });
  }
});

// Check video status endpoint
app.get('/api/video-status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const response = await axios.get(
      `${process.env.VEO3_API_URL?.replace('/generate-preview', '')}/status/${jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VEO3_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error checking video status:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to check video status',
      message: error.response?.data?.message || error.message
    });
  }
});

// Proceed to 3D endpoint
app.post('/api/proceed-to-3d', async (req, res) => {
  try {
    const { videoUrl, prompt } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // Here you would integrate with your 3D rendering service
    // For now, we'll just return a success response
    console.log('Proceeding to 3D with video:', videoUrl);
    console.log('Original prompt:', prompt);

    res.json({
      success: true,
      message: '3D rendering process initiated',
      videoUrl: videoUrl,
      renderingId: `3d_${Date.now()}`
    });

  } catch (error) {
    console.error('Error proceeding to 3D:', error.message);
    res.status(500).json({
      error: 'Failed to proceed to 3D rendering',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('Image upload support enabled');
}); 