import slugify from 'slugify';

function createSlug(string, id) {
  return `${slugify(string, { lower: true })}-${id}`;
}

export default createSlug;
