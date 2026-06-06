/** Product URL helpers — safe for client components (no SEO / env deps). */

export function productSlug(name: string, id: number | string): string {
  return `${name.replace(/ /g, "-")}.${id}`;
}

export function productPath(
  product: Pick<{ name: string }, "name"> & { id: number | string },
): string {
  return `/products/${productSlug(product.name, product.id)}`;
}
