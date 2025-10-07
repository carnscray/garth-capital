// src/lib/contentful.js
import { createClient } from 'contentful';

const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

export default client;

// Normalise for BlogCard (title, slug, imageUrl, imageAlt, authorName, authorSlug, authorImg, summary, published)
export async function getAllBlogs(limit = 100, skip = 0) {
  const response = await client.getEntries({
    content_type: 'triviaBlog',
    order: '-fields.blogPublished',
    include: 2,          // pull linked author + assets
    limit,
    skip,
  });

  return response.items
    .filter((item) => item?.fields?.blogSlug && item?.fields?.blogTitle)
    .map((item) => {
      const {
        blogTitle,
        blogSlug,
        blogHero,
        blogAuthor,
        blogSummary,
        blogPublished,
      } = item.fields;

      const imageUrl =
        blogHero?.fields?.file?.url ? `https:${blogHero.fields.file.url}` : null;

      const authorEntry = blogAuthor?.[0];
      const authorName = authorEntry?.fields?.authorName || 'Unknown';
      const authorSlug = authorEntry?.fields?.authorSlug || '';
      const authorImg =
        authorEntry?.fields?.authorImgprofile?.fields?.file?.url
          ? `https:${authorEntry.fields.authorImgprofile.fields.file.url}`
          : null;

      return {
        title: blogTitle,
        slug: blogSlug,
        imageUrl,
        imageAlt: item.fields.blogImageAltText || blogHero?.fields?.title || blogTitle,
        authorName,
        authorSlug,
        authorImg,
        summary: blogSummary || '',
        published: blogPublished || null, // raw date; BlogCard formats it
      };
    });
}

export async function getBlogBySlug(slug) {
  const response = await client.getEntries({
    content_type: 'triviaBlog',
    'fields.blogSlug': slug,
    include: 2,
    limit: 1,
  });

  return response.items[0];
}

export async function getAllContributors() {
  const response = await client.getEntries({
    content_type: 'triviaBlogContributor',
    order: '-fields.authorName',
  });
  return response.items;
}

export async function getContributorBySlug(slug) {
  const response = await client.getEntries({
    content_type: 'triviaBlogContributor',
    'fields.authorSlug': slug,
    limit: 1,
  });
  return response.items[0];
}
