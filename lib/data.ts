export function Data(isoString: string) {
  const d = new Date(isoString);

  const opts24: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const opts12: Intl.DateTimeFormatOptions = {
    ...opts24,
    hour12: true,
    hour: "numeric", 
  };

  const fmt24 = new Intl.DateTimeFormat("en-US", opts24);
  const fmt12 = new Intl.DateTimeFormat("en-US", opts12);

  return {
    "24h": fmt24.format(d),
    "12h": fmt12.format(d),
  };
}
