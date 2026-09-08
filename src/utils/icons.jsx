import { FiBox, FiCpu, FiDroplet, FiLayers, FiPackage, FiSettings, FiTool } from 'react-icons/fi';

const ICONS = {
  FiBox,
  FiDroplet,
  FiLayers,
  FiSettings,
  FiCpu,
  FiTool,
  FiPackage,
};

export const ICON_OPTIONS = Object.keys(ICONS);

export function CategoryIcon({ name, size = 24 }) {
  const Icon = ICONS[name] || FiBox;
  return <Icon size={size} />;
}

export function bentoSpan(index, total) {
  if (total === 1) return 'col-span-1 md:col-span-3 md:row-span-1';
  if (index === 0) return 'col-span-1 md:col-span-2 md:row-span-2';
  if (index === total - 1 && total > 3) return 'col-span-1 md:col-span-2';
  return 'col-span-1';
}
