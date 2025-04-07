const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const localtunnel = require('localtunnel'); // Import LocalTunnel

// Initialize Express
const app = express();
const PORT = 3000;
const ALLOWED_IP = 'YOUR.IP.ADDRESS.HERE'; // Replace with your actual IP

// Set up LocalTunnel dynamically
let tunnelUrl = ''; // To store the LocalTunnel URL

// IP filtering middleware
app.use((req, res, next) => {
  const clientIp = req.ip.replace('::ffff:', ''); // Normalize IPv4 format
  // Check if the IP is allowed (both IPv4 and IPv6 formats)
  if (clientIp !== ALLOWED_IP && clientIp !== '127.0.0.1' && clientIp !== '::1') {
    console.log(`Blocked request from IP: ${clientIp}`); // Log the blocked IP
    return res.status(403).send('Forbidden');
  }
  next();
});

// IP filtering middleware (for logging purposes)
app.use((req, res, next) => {
  const clientIp = req.ip.replace('::ffff:', ''); // Normalize IPv4 format (in case it's IPv6)
  console.log(`Incoming request from IP: ${clientIp}`); // Log the client IP
  next();
});

// View engine setup
app.set('view engine', 'ejs');

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upload Image/Video</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f7fc;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          flex-direction: column;
        }

        h1 {
          text-align: center;
          font-size: 2rem;
          color: #333;
          margin-bottom: 20px;
        }

        form {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        label {
          font-size: 1rem;
          color: #333;
          display: block;
          margin-bottom: 8px;
        }

        input[type="text"],
        textarea,
        input[type="file"] {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          margin-bottom: 16px;
          box-sizing: border-box;
        }

        input[type="text"]:focus,
        textarea:focus,
        input[type="file"]:focus {
          border-color: #007bff;
          outline: none;
        }

        button {
          width: 100%;
          padding: 12px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        button:active {
          background-color: #3e8e41;
        }

        .form-group {
          margin-bottom: 15px;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        input[type="file"] {
          padding: 12px 10px;
          font-size: 1rem;
        }

        /* Button container style */
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          width: 100%;
        }

        .button-container a {
          text-decoration: none;
          width: 100%;
        }

        .button-container button {
          width: 100%;
          max-width: 400px;
        }

        /* Responsiveness */
        @media (max-width: 600px) {
          h1 {
            font-size: 1.5rem;
          }
          form {
            width: 90%;
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div>
        <h1>Upload Image/Video</h1>
        <form action="/upload" method="POST" enctype="multipart/form-data">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" placeholder="Enter a title" required />
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" placeholder="Enter a description" required></textarea>
          </div>
          <div class="form-group">
            <label for="color">Embed Color (Hex):</label>
            <input type="text" id="color" name="color" placeholder="#00aa00" required />
          </div>
          <div class="form-group">
            <input type="file" name="media" required />
          </div>
          <button type="submit">Upload</button>
          <!-- Button to view uploads, centered below the form -->
          <div class="button-container">
          <a href="/uploads">
            <button type="button">View All Uploads</button>
          </a>
        </div>
        </form>


      </div>
    </body>
    </html>
  `);
});


// Handle uploads with metadata
app.post('/upload', upload.single('media'), (req, res) => {
  const { title, description, imageUrl, color } = req.body; // Get metadata from form
  const fileId = req.file.filename; // Unique filename for the uploaded file

  // Prepare metadata object
  const metadata = {
    fileId: fileId,
    title: title,
    description: description,
    color: color, // Embed color from form
    imageUrl: imageUrl || null, // Default to null if no image URL is provided
  };

  // Save the metadata as a JSON file with the same UUID as the uploaded file
  const metadataFilePath = path.join('uploads', `${fileId}.json`);

  fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving metadata');
    }

    // Respond to the user with the file URL and metadata
    res.send(`
      <h1>File uploaded successfully!</h1>
      <p>File ID: ${fileId}</p>
      <p><a href="${tunnelUrl}/uploads/${fileId}" target="_blank">View File</a></p>
      <p>Title: ${metadata.title}</p>
      <p>Description: ${metadata.description}</p>
      <p>Color: ${metadata.color}</p>
      <p>Share this link in Discord: ${tunnelUrl}/view/${fileId}</p>
    `);
  });
});

// Serve the preview page for images/videos
app.get('/view/:file', (req, res) => {
  const file = req.params.file;
  const fileUrl = `${tunnelUrl}/uploads/${file}`; // Ensure this URL is publicly accessible via your tunnel
  const metadataFilePath = path.join('uploads', `${file}.json`); // Path to the metadata JSON file

  // Check if the file exists
  if (!fs.existsSync(`uploads/${file}`)) {
    return res.status(404).send('File not found');
  }

  // Read the metadata from the JSON file
  fs.readFile(metadataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading metadata');
    }

    const metadata = JSON.parse(data);

    const ext = path.extname(file).toLowerCase();

    // Check if the file is an image or video
    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);

    // Render preview with Open Graph tags for image/video
    res.render('preview', {
      fileUrl, // URL for Open Graph
      isImage,
      isVideo,
      title: metadata.title || 'Custom Upload', // Use metadata title if available
      description: metadata.description || 'Check out this uploaded media!', // Use metadata description if available
      imageUrl: metadata.imageUrl || '', // Use metadata image URL for Open Graph image
      color: '#000000', // Default color
    });
  });
});

// View all uploaded files
app.get('/uploads', (req, res) => {
  // Get list of files in the 'uploads' directory
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads directory');
    }
    // Create a list of file names and links
    const fileLinks = files.map(file => {
      return {
        fileName: file,
        fileUrl: `${tunnelUrl}/uploads/${file}`
      };
    });

    // Render the list of uploaded files
    res.render('uploads', { fileLinks });
  });
});

// Set up LocalTunnel to dynamically expose the server
localtunnel(PORT).then(tunnel => {
  tunnelUrl = tunnel.url; // Get the public URL of the tunnel
  console.log(`Your app is publicly accessible at: ${tunnelUrl}`);
}).catch(err => {
  console.error('Error setting up LocalTunnel:', err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
