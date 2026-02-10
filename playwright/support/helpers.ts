export function generateOrderCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
  
    const randomLetters = (length) =>
      Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  
    const randomDigits = (length) =>
      Array.from({ length }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
  
    return `${randomLetters(3)}-${randomDigits(2)}${randomLetters(1)}${randomDigits(2)}${randomLetters(1)}`;
}