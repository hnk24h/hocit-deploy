export interface StructuredDataProps {
  type: 'Website' | 'Article' | 'Person' | 'Organization';
  data: any;
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ikagi',
    description: 'Blog học lập trình từ cơ bản đến nâng cao',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ikagi.site',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/articles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  date: string;
  slug: string;
  category: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ikagi.site';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: `${siteUrl}/og-image.png`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: 'Ikagi',
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ikagi',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
    articleSection: article.category,
    inLanguage: 'vi-VN',
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generatePersonStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ikagi.site';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ikagi',
    url: siteUrl,
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/yourusername',
      // 'https://github.com/yourusername',
      // 'https://linkedin.com/in/yourusername',
    ],
    jobTitle: 'Software Developer',
    description: 'Technical blogger sharing programming knowledge',
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData;

  switch (type) {
    case 'Website':
      structuredData = generateWebsiteStructuredData();
      break;
    case 'Article':
      structuredData = generateArticleStructuredData(data);
      break;
    case 'Person':
      structuredData = generatePersonStructuredData();
      break;
    default:
      structuredData = data;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
