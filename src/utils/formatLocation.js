// "Sabana Larga, Santo Domingo Este" si hay sector, si no solo la ciudad.
export function formatLocation(city, sector, fallback = "República Dominicana") {
  const cityText = city || fallback;
  return sector ? `${sector}, ${cityText}` : cityText;
}
