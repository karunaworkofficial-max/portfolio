import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProfileContext } from '../../context/ProfileContext';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const { profile } = useContext(ProfileContext);
  
  const siteName = profile?.displayName || profile?.name || 'Graphic Designer';
  const defaultDesc = profile?.shortBio || 'Award-winning graphic design portfolio.';
  const defaultImage = profile?.photo?.url || '/default-og.jpg';
  
  const seoTitle = title ? `${title} | ${siteName}` : `${siteName} - Graphic Designer Portfolio`;
  const seoDesc = description || defaultDesc;
  const seoImage = image || defaultImage;
  const seoUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={seoImage} />
      
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
};

export default SEO;
