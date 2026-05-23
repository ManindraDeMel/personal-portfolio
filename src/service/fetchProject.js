import fetchSpotlight from './fetchSpotlight';
import fetchResearch from './fetchResearch';

// Resolves a slug to a normalised project record by checking both the
// spotlight and research collections. Spotlight wins on conflict because
// it carries the richer `featured.*` block. Returns null if the slug isn't
// found anywhere.
//
// Normalised shape:
//   { slug, name, year, status, role, collaborators, problem, approach,
//     outcome, stack, lang, blurb, url, paperUrl, repoUrl, liveUrl,
//     visuals, source: 'spotlight' | 'research' }
async function fetchProjectBySlug(slug) {
  if (!slug) return null;
  const [spotlights, research] = await Promise.all([
    fetchSpotlight(),
    fetchResearch(),
  ]);
  const spot = spotlights.find((s) => s.slug === slug);
  if (spot) {
    const f = spot.featured || {};
    return {
      slug: spot.slug,
      name: spot.name,
      year: spot.year,
      status: f.status || '—',
      role: f.role || '—',
      collaborators: f.collaborators || '—',
      problem: f.problem || '',
      approach: f.approach || '',
      outcome: f.outcome || '',
      stack: Array.isArray(f.stack) ? f.stack : [],
      lang: spot.lang || '—',
      blurb: spot.desc || '',
      url: spot.url || '',
      paperUrl: spot.paperUrl || '',
      repoUrl: spot.repoUrl || '',
      liveUrl: spot.liveUrl || spot.url || '',
      visuals: spot.visuals || '',
      source: 'spotlight',
    };
  }
  const r = research.find((d) => d.slug === slug);
  if (r) {
    return {
      slug: r.slug,
      name: r.name,
      year: r.year,
      status: r.status || '—',
      role: r.role || '—',
      collaborators: r.collaborators || '—',
      problem: r.problem || '',
      approach: r.approach || '',
      outcome: r.outcome || '',
      stack: Array.isArray(r.stack) ? r.stack : [],
      lang: r.lang || '',
      blurb: r.blurb || '',
      url: r.liveUrl || r.repoUrl || '',
      paperUrl: r.paperUrl || '',
      repoUrl: r.repoUrl || '',
      liveUrl: r.liveUrl || '',
      visuals: r.visuals || '',
      source: 'research',
    };
  }
  return null;
}

export default fetchProjectBySlug;
