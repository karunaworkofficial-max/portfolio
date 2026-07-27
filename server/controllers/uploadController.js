const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('cloudinary').v2;

exports.uploadImage = asyncHandler(async (req, res) => {
  const { image } = req.body; // expecting base64 string
  if (!image) { res.status(400); throw new Error('No image provided'); }
  
  const result = await cloudinary.uploader.upload(image, {
    quality: 'auto',
    fetch_format: 'auto',
    width: 2000,
    crop: 'limit'
  });
  
  res.json({
    success: true,
    data: { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height },
    message: 'Image uploaded successfully'
  });
});
exports.uploadVideo = asyncHandler(async (req, res) => {
  const { video } = req.body; // expecting base64 string
  if (!video) { res.status(400); throw new Error('No video provided'); }
  
  const result = await cloudinary.uploader.upload(video, {
    resource_type: 'video',
    quality: 'auto',
    fetch_format: 'auto'
  });
  
  res.json({
    success: true,
    data: { url: result.secure_url, publicId: result.public_id },
    message: 'Video uploaded successfully'
  });
});

exports.uploadFile = asyncHandler(async (req, res) => {
  const { file } = req.body; // expecting base64 string
  if (!file) { res.status(400); throw new Error('No file provided'); }

  // Extract base64 part
  const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const buffer = Buffer.from(matches[2], 'base64');

  const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: `resume_${Date.now()}.pdf` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
  };

  const result = await uploadToCloudinary(buffer);

  res.json({
    success: true,
    data: { url: result.secure_url, publicId: result.public_id },
    message: 'File uploaded successfully'
  });
});

exports.uploadImages = asyncHandler(async (req, res) => {
  const { images } = req.body; // array of base64 strings
  if (!images || !images.length) { res.status(400); throw new Error('No images provided'); }
  
  const uploadPromises = images.map(img => 
    cloudinary.uploader.upload(img, {
      quality: 'auto',
      fetch_format: 'auto',
      width: 2000,
      crop: 'limit'
    })
  );
  const results = await Promise.all(uploadPromises);
  const data = results.map(r => ({ url: r.secure_url, publicId: r.public_id, width: r.width, height: r.height }));
  
  res.json({ success: true, data, message: 'Images uploaded successfully' });
});

exports.deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) { res.status(400); throw new Error('No publicId provided'); }
  
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, data: {}, message: 'Image deleted successfully' });
});
