/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// React renders `{value}°` as two adjacent text nodes (e.g. ["31", "°"]).
// Flatten the rendered tree into one continuous string so assertions like
// "31°" match regardless of how children are chunked.
function flattenText(node: unknown): string {
  if (node == null || node === false) {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flattenText).join('');
  }
  if (typeof node === 'object' && 'children' in (node as any)) {
    return flattenText((node as any).children);
  }
  return '';
}

async function renderApp() {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });
  // Second flush: drain the chained async (location -> coords effect -> weather fetch).
  await ReactTestRenderer.act(async () => {});
  return tree!;
}

test('renders current weather temperature and condition', async () => {
  const tree = await renderApp();
  const text = flattenText(tree.toJSON());
  expect(text).toContain('30°');
  expect(text).toContain('clear sky');
});

test('renders the hourly timeline with forecast hours', async () => {
  const tree = await renderApp();
  const text = flattenText(tree.toJSON());
  expect(text).toContain('NEXT 24 HOURS');
  // 31° is unique to the hourly mock ([30, 31, 29, 28]) and proves hourly cards rendered.
  expect(text).toContain('31°');
});

test('renders derived insight chips', async () => {
  const tree = await renderApp();
  const text = flattenText(tree.toJSON());
  expect(text).toContain("TODAY'S INSIGHTS");
  expect(text).toContain('Great for outdoors');
});
