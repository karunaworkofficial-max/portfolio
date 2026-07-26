// Cloudinary URL transformations for responsive images
export const getOptimizedUrl = (url, width) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Insert f_auto,q_auto,w_${width} into the URL for automatic format selection and compression
  // Typical URL: https://res.cloudinary.com/cloudname/image/upload/v1234/publicid.jpg
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  return `${parts[0]}/upload/f_auto,q_auto,w_${width},c_limit/${parts[1]}`;
};

export const generateSrcSet = (url, widths = [320, 640, 768, 1024, 1280, 1536, 1920]) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  return widths.map(w => `${getOptimizedUrl(url, w)} ${w}w`).join(', ');
};
