import { getCurrencySymbol } from "../utils/formatPrice";

// Reemplaza a formatPrice() en JSX donde el precio va destacado (tarjetas,
// detalle): el código de moneda se ve chico y liviano — no con el mismo
// tamaño y peso que el monto — para que no compita visualmente con el
// número. text-[0.6em] lo escala relativo al tamaño de fuente del texto
// donde se use, así funciona igual en una tarjeta chica que en el precio
// grande del detalle sin tener que ajustarlo en cada lugar.
export default function PriceTag({ price, currency }) {
  return (
    <>
      <span className="font-semibold opacity-60 text-[0.6em] mr-0.5 align-middle">
        {getCurrencySymbol(currency)}
      </span>
      {Number(price).toLocaleString()}
    </>
  );
}
