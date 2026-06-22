export function getProductStock(stock: number | undefined | null): number {
  return Math.max(0, Number(stock) || 0);
}

export function isOutOfStock(stock: number | undefined | null): boolean {
  return getProductStock(stock) < 1;
}

export function getCartStockIssue(items: Array<{
  productId: number;
  quantity: number;
  product: { name: string; stock: number };
}>): string | null {
  const totals = new Map<number, { stock: number; qty: number; name: string }>();

  for (const item of items) {
    const current = totals.get(item.productId) ?? {
      stock: getProductStock(item.product.stock),
      qty: 0,
      name: item.product.name,
    };
    current.qty += item.quantity;
    totals.set(item.productId, current);
  }

  for (const { stock, qty, name } of totals.values()) {
    if (stock < 1) {
      return `"${name}" is out of stock. Remove it to continue.`;
    }
    if (qty > stock) {
      return `Only ${stock} unit(s) of "${name}" available.`;
    }
  }

  return null;
}
