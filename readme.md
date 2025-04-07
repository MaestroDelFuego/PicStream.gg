# PicStream

**PicStream** is a web application that allows users to upload images and videos, generate unique URLs for each file, and share them easily. It also supports adding metadata to each file, including a customizable title, description, and an embed color (specified as a hex code). Once uploaded, users receive a preview of their uploaded media along with the provided metadata, which can be used for easy sharing on social media or other platforms.

The app provides a simple and efficient way to upload and share media without requiring any backend configuration, making it perfect for developers, content creators, or anyone who needs to quickly upload and distribute media.

---

## Features

- **File Upload**: Upload images or videos with a simple user interface.
- **Metadata Support**: Users can specify a title, description, and a customizable embed color for the media file.
- **Unique URLs**: Every uploaded file gets a unique URL, which can be used for sharing, embedding, or previewing.
- **File Preview**: Once uploaded, the media is previewable directly in the browser with embedded metadata.
- **LocalTunnel Integration**: Provides a temporary public URL to the uploaded files for easy sharing and access from anywhere.
- **Security via IP Filtering**: Restricts access to specific IP addresses (configurable) to ensure only authorized users can upload files.

---

## Prerequisites

Before using or deploying **PicStream**, ensure that you have the following software installed:

### Required Tools:

- **Node.js**: A JavaScript runtime required for running the backend server.
  - Download Node.js from [here](https://nodejs.org/).
- **npm**: Comes bundled with Node.js and is used for managing dependencies.
  - Verify installation by running:
    ```bash
    node -v
    npm -v
    ```
  
- **LocalTunnel**: Used to expose your local server to the public internet, which is automatically handled in the app when you run it.
  - This is used to create a temporary public URL for accessing the uploaded media.

---

## Installation

Follow these steps to get **PicStream** up and running on your local machine.

1. **Clone the repository**:
   
   Open a terminal and run the following command to clone the project:
   
   ```bash
   git clone https://github.com/YOUR_USERNAME/PicStream.git
   cd PicStream
   ```

2. **Install dependencies**:

   Use npm to install the required dependencies:
   
   ```bash
   npm install
   ```

3. **Configure your server**:

   - Open the   `Server.js` file and locate the line containing `ALLOWED_IP`. Replace `'YOUR.IP.ADDRESS.HERE'` with your own IP address (for security purposes).
   
   - The IP filtering feature is optional but recommended if you want to limit access to the app to certain IPs only.
   
   ```js
   const ALLOWED_IP = 'YOUR.IP.ADDRESS.HERE'; // Replace with your actual IP
    ```

4. **Start the server**:

   After configuring your server, start the application by running:

   ```bash
   npm start
   ```

5. **Access the app**:

   Once the server is running, open your web browser and navigate to the URL given in the command line.

You can use this URL to access the application from any device and share it with others.

---

## Usage

### Upload Media

1. Open the app in your browser.
2. On the homepage, you will find a form to upload your image or video.
- **Title**: Enter a title for your media.
- **Description**: Add a brief description.
- **Embed Color**: Specify a hex color code for customizing the embed preview (e.g., `#00aa00`).
- **Select File**: Choose the image or video file you want to upload.

3. Once you've filled out the form, click the **Upload** button.
4. After uploading, you will receive a unique URL for your file, which can be used to view, share, or embed the media.

### View Media

1. After the file is uploaded, you'll be provided with a link to view your media file.
2. The file can be viewed in your browser. The app will show:
- The media preview (image or video).
- The title, description, and embed color associated with the file.

### View All Uploads

You can also visit the `/uploads` page to view a list of all the files you've uploaded. This page will display the file name and the URL that points to each uploaded file.

---

## Security Considerations

By default, **PicStream** uses IP filtering to restrict file uploads to a specific IP address. This is an optional feature and can be modified or disabled in the code. For production usage, consider implementing the following additional security measures:

- **Authentication**: Add user authentication (e.g., using OAuth, JWT, or another method) to secure file uploads.
- **File Validation**: Implement validation for uploaded files to ensure they are safe and of the correct type (image or video).
- **Storage**: For long-term deployment, consider using a cloud-based storage service (like AWS S3, Google Cloud Storage, etc.) instead of local storage.
- **HTTPS**: Use HTTPS to ensure secure communication between users and the server.

---

## Contributing

We welcome contributions to **PicStream**! If you have any ideas for improvements or new features, feel free to fork the repository and submit a pull request.

To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to your branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- **Node.js**: JavaScript runtime used to build and run the server.
- **Express**: Web framework for Node.js.
- **Multer**: Middleware for handling file uploads.
- **LocalTunnel**: Service used to expose the local server to the public internet.
- **UUID**: Used for generating unique filenames for uploaded files.

---

Thank you for using **PicStream**!
