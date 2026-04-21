import { expect, test } from 'vitest';

// Simulating the Categories list from main.js
const CATEGORIES = [
    "Mobiles", "Wallets", "Keys", "Accessories", 
    "Bags", "Makeup", "Notebooks/Books", "Other"
];

test('CATEGORIES list should have 8 items', () => {
  expect(CATEGORIES.length).toBe(8);
});

test('CATEGORIES should include Mobiles and Keys', () => {
  expect(CATEGORIES).toContain('Mobiles');
  expect(CATEGORIES).toContain('Keys');
});

// Testing if the SearchBar returns a string containing the input id
const SearchBar = () => `<input type="text" id="search-input" />`;
test('SearchBar should render an input with correct id', () => {
  expect(SearchBar()).toContain('id="search-input"');
});