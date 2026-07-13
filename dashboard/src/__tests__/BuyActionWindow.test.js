import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyActionWindow from '../components/BuyActionWindow';

test('renders buy inputs', () => {
  render(<BuyActionWindow uid="TST" />);
  expect(screen.getByDisplayValue(/1|TST|/i) || screen.getByLabelText(/Qty/i)).toBeTruthy();
});
