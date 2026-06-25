"use server"
export const fetchAboutData = async () => {
  try {
    const res = await fetch(`${process.env.URL_REMOTE}/api/v1/web/properties/most-reserved`, {
      cache: 'force-cache',
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};