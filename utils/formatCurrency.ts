export function formatCurrency(cents: number, currency: string = "BRL") {
  const value = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}
