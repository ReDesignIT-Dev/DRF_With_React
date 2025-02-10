export function getIdFromSlug(slug: string): number | null {
    const idMatch = slug.match(/(\d+)$/); // Matches the last group of digits in the slug
    return idMatch ? parseInt(idMatch[1], 10) : null;
  }
  
