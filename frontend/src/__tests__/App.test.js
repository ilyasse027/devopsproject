import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import for jest-dom
import App from '../app';  // Adjusted path to App.js

test('renders the button to fetch message', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Get Message/i);
  expect(buttonElement).toBeInTheDocument();
});
