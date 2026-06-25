import { getAllProperties } from '@/service/hotel';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const properties = await getAllProperties()

  const propertyPaths = properties?.data?.map((property: { id: number, slug: string, type: string }) => ({
    url: `${baseUrl}/${property?.type.toLowerCase()}/${property?.slug}`,
    lastModified,
    priority: 0.8,
    changeFrequency: 'monthly',
  }))


  const routePaths = [
    {
      url: `${baseUrl}`,
      lastModified,
      priority: 1.0,
      changeFrequency: 'yearly',
    },
    {
      url: `${baseUrl}/help/articles/privacy-policy`,
      lastModified,
      priority: 0.9,
      changeFrequency: 'yearly',
    },
    {
      url: `${baseUrl}/help/articles/terms-and-conditions`,
      lastModified,
      priority: 0.9,
      changeFrequency: 'yearly',
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified,
      priority: 0.9,
      changeFrequency: 'yearly',
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified,
      priority: 0.9,
      changeFrequency: 'yearly',
    },
  ];

  return [...routePaths, ...propertyPaths]
}
