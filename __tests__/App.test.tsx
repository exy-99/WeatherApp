/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});

test('renders the app tree', async () => {
  const holder: { tree?: ReactTestRenderer.ReactTestRenderer } = {};
  await ReactTestRenderer.act(async () => {
    holder.tree = ReactTestRenderer.create(<App />);
  });
  expect(holder.tree?.toJSON()).toBeTruthy();
});