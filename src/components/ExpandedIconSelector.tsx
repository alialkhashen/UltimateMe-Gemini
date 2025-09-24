
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Icons from 'lucide-react';

interface ExpandedIconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

const ExpandedIconSelector = ({ selectedIcon, onIconSelect }: ExpandedIconSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState('general');

  // Get all available Lucide icons
  const availableIcons = Object.keys(Icons).filter(iconName => {
    const icon = Icons[iconName as keyof typeof Icons];
    return typeof icon === 'function' && iconName !== 'createLucideIcon' && iconName !== 'Icon';
  });

  // Categorize icons with exactly 50 icons each
  const iconCategories = {
    general: ['Home', 'User', 'Star', 'Heart', 'Settings', 'Search', 'Plus', 'Check', 'X', 'Calendar', 'Clock', 'Mail', 'Phone', 'Camera', 'Music', 'Play', 'Pause', 'Download', 'Upload', 'Share', 'Edit', 'Delete', 'Save', 'Copy', 'Cut', 'Paste', 'Undo', 'Redo', 'Refresh', 'Menu', 'Grid', 'List', 'Filter', 'Sort', 'ZoomIn', 'ZoomOut', 'Eye', 'EyeOff', 'Lock', 'Unlock', 'Shield', 'Key', 'Bell', 'BellOff',  'Volume2', 'VolumeX', 'Bookmark', 'BookmarkPlus', 'Flag', 'Tag'],
    business: ['Briefcase', 'Building', 'CreditCard', 'DollarSign', 'PieChart', 'BarChart', 'TrendingUp', 'TrendingDown', 'Target', 'Award', 'Trophy', 'Handshake', 'Users', 'UserPlus', 'UserMinus', 'Globe', 'Laptop', 'Monitor', 'Printer', 'FileText', 'Folder', 'Archive', 'Database', 'Server', 'HardDrive', 'Cpu', 'MemoryStick', 'Wifi', 'Signal', 'Bluetooth', 'Network', 'Router', 'Cable', 'Plug', 'Battery', 'Power', 'Zap', 'Activity', 'BarChart2', 'BarChart3', 'LineChart', 'Calculator', 'Receipt', 'ShoppingCart', 'ShoppingBag', 'Store', 'Package', 'Truck', 'Warehouse', 'Factory'],
    media: ['Camera', 'Video', 'Image', 'Film', 'Music', 'Headphones', 'Speaker', 'Volume2', 'VolumeX', 'Play', 'Pause', 'Square', 'SkipBack', 'SkipForward', 'FastForward', 'Rewind', 'Repeat', 'Repeat1', 'Shuffle', 'Radio', 'Disc', 'Disc2', 'Disc3', 'Youtube', 'Instagram', 'Facebook', 'Twitter', 'Linkedin', 'Github', 'Music2', 'Music3', 'Music4', 'Mic2', 'MicVocal', 'AudioLines', 'AudioWaveform', 'Waveform', 'PlayCircle', 'PauseCircle', 'StopCircle', 'Clapperboard', 'FilmStrip', 'Projector', 'Theater', 'Tv', 'Tv2', 'MonitorSpeaker', 'Gamepad', 'Gamepad2'],
    tools: ['Settings', 'Settings2', 'Wrench', 'Hammer', 'Screwdriver', 'Paintbrush', 'Paintbrush2', 'PaintBucket', 'Scissors', 'Ruler', 'Calculator', 'Clipboard', 'ClipboardCopy', 'ClipboardPaste', 'Copy', 'Cut', 'Paste', 'Trash', 'Trash2', 'Edit', 'Edit2', 'Edit3', 'Save', 'Download', 'Upload', 'RefreshCw', 'RefreshCcw', 'RotateCcw', 'RotateCw', 'Undo', 'Redo', 'Gauge', 'ScanLine', 'Scan', 'QrCode', 'Barcode', 'Fingerprint', 'Construction', 'HardHat', 'Pickaxe', 'Drill', 'Saw', 'Spanner', 'Anvil', 'Axe', 'Shovel', 'PackageOpen', 'Box', 'Container', 'Boxes'],
    nature: ['Sun', 'Moon', 'Star', 'Stars', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning', 'CloudDrizzle', 'Snowflake', 'Zap', 'Flame', 'Droplets', 'Wind', 'Tornado', 'Rainbow', 'Umbrella', 'Tree', 'TreePine', 'TreeDeciduous', 'Leaf', 'Flower', 'Flower2', 'Seedling', 'Sprout', 'Bug', 'Fish', 'Bird', 'Rabbit', 'Cat', 'Dog', 'Turtle', 'Squirrel', 'Whale', 'Octopus', 'Shell', 'Feather', 'Paw', 'Bone', 'Egg', 'Worm', 'Snail', 'Butterfly', 'Spider', 'Ant', 'Bee', 'Ladybug', 'Mushroom', 'Cherry']
  };

  const categoryLabels = {
    general: '⭐',
    business: '💼',
    media: '🎵',
    tools: '🔧',
    nature: '🌿'
  };

  const getIconsForCategory = (category: string) => {
    const categoryIcons = iconCategories[category as keyof typeof iconCategories] || [];
    return categoryIcons.filter(iconName => availableIcons.includes(iconName));
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<any>;
    if (!IconComponent) return null;
    
    return (
      <Button
        key={iconName}
        variant={selectedIcon === iconName ? "default" : "outline"}
        size="sm"
        className="w-12 h-12 p-2"
        onClick={() => onIconSelect(iconName)}
        title={iconName}
      >
        <IconComponent className="w-5 h-5" />
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(categoryLabels).map(([category, emoji]) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            className="h-8 px-2"
            onClick={() => setActiveCategory(category)}
          >
            <span className="text-base mr-1">{emoji}</span>
            <span className="text-xs capitalize">{category}</span>
          </Button>
        ))}
      </div>
      
      {/* Icons grid */}
      <ScrollArea className="h-64">
        <div className="grid grid-cols-6 gap-2 p-2">
          {getIconsForCategory(activeCategory).map(renderIcon)}
        </div>
      </ScrollArea>
      
      <p className="text-xs text-gray-500">
        {getIconsForCategory(activeCategory).length} icons in {activeCategory} category
      </p>
    </div>
  );
};

export default ExpandedIconSelector;
