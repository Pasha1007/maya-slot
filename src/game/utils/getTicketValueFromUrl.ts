export const getTicketValueFromUrl = (url: string): string | null => {
  const searchParams = new URLSearchParams(new URL(url).search);

  return searchParams.get("ticket");
};
