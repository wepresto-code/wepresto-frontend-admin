// function to format currency
export const formatCurrency = (value = 0, currency = "COP") => {
  return new Intl.NumberFormat("default", {
    style: "currency",
    currency,
  }).format(value);
};
