const React = require('react');

function createLucideIcon(name) {
  const LucideIcon = ({ size = 24, color, style, ...props }) =>
    React.createElement(
      'svg',
      { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, style, ...props },
      React.createElement('title', null, name),
    );
  LucideIcon.displayName = `Lucide${name}`;
  return LucideIcon;
}

// Export icon components for new API (direct imports)
const icons = {
  X: createLucideIcon('X'),
  MapPin: createLucideIcon('MapPin'),
  ChevronRight: createLucideIcon('ChevronRight'),
  Droplets: createLucideIcon('Droplets'),
  Wind: createLucideIcon('Wind'),
  Gauge: createLucideIcon('Gauge'),
  Umbrella: createLucideIcon('Umbrella'),
  Eye: createLucideIcon('Eye'),
  Cloud: createLucideIcon('Cloud'),
  Thermometer: createLucideIcon('Thermometer'),
  Sun: createLucideIcon('Sun'),
};

module.exports = {
  createLucideIcon,
  ...icons,
};