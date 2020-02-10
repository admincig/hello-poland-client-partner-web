export default function formatPrice(price) {
  return `${parseFloat((price / 100)).toFixed(2)} zł`;
}
