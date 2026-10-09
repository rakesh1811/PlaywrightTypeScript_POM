/**
 * Random test data (no extra library needed).
 */
const firstNames = ['Rakesh', 'Arjun', 'Priya', 'Sneha', 'Rahul', 'Anita', 'Vikram', 'Kavya'];
const lastNames  = ['Behera', 'Sharma', 'Patel', 'Nair', 'Reddy', 'Das', 'Iyer', 'Khan'];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

/** 6-digit number as text, e.g. "483920" (always 100000 - 999999) */
export function randomZip(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function randomCustomer() {
  return {
    firstName: pick(firstNames),
    lastName: pick(lastNames),
    zip: randomZip(),
  };
}
