import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import axios from 'axios';

import App from '../../App';

jest.mock('axios');

const movieHeading = process.env.FAIL_TEST ? 'WRONG_HEADING' : 'Movie List';

test('renders Movie List heading', async () => {
  axios.get.mockResolvedValue({ data: { movies: [{ id: '1', title: 'A Test Movie' }] } });
  render(<App />);
  const linkElement = screen.getByText(movieHeading);
  expect(linkElement).toBeInTheDocument();
  expect(await screen.findByText('A Test Movie')).toBeInTheDocument();
});

test('loads details when a movie is selected', async () => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/movies')) {
      return Promise.resolve({ data: { movies: [{ id: '123', title: 'Top Gun: Maverick' }] } });
    }
    return Promise.resolve({ data: { movie: { title: 'Top Gun: Maverick', description: 'Fighter planes' } } });
  });

  render(<App />);
  fireEvent.click(await screen.findByText('Top Gun: Maverick'));

  expect(await screen.findByRole('heading', { name: 'Top Gun: Maverick' })).toBeInTheDocument();
  expect(await screen.findByText('Fighter planes')).toBeInTheDocument();
});
