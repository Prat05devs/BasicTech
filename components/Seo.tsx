import React from 'react';
import { Head } from 'vite-react-ssg';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: object;
}

const DEFAULT_IMAGE = 'https://basictech.in/og-basic-tech.png';

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    {canonical && <meta property="og:url" content={canonical} />}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    {jsonLd && (
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    )}
  </Head>
);
