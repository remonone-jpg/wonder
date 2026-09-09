/**
 * Resolves a public-folder path against the deployment base.
 *
 * Vite rewrites asset URLs it can see in imports, but these are built as
 * strings at runtime — a body's texture named in `planets.ts`, a figure named
 * after its deep-dive category — so it never sees them. Served from a project
 * page under `/wonder/`, a leading slash points at the domain root and every
 * texture and image comes back 404.
 */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
