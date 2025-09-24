
import { useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ColorPanelProps {
  selectedColor: string | undefined;
  onColorChange: (color: string | undefined) => void;
  title: string;
  children: React.ReactNode;
  defaultColor?: string;
}

const ColorPanel = ({ selectedColor, onColorChange, title, children, defaultColor }: ColorPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(selectedColor || '#000000');

  const solidColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB6BD9', '#3742FA', '#2F3542', '#57606F', '#FFA502', '#FF6348', '#70A1FF', '#5352ED',
    '#FF3838', '#FF9500', '#FFDD59', '#32FF7E', '#18DCFF', '#7D5FFF', '#EE5A6F', '#60A3BC',
    '#EA8685', '#D63031', '#74B9FF', '#0984E3', '#00B894', '#6C5CE7', '#A29BFE', '#FD79A8'
  ];

  const gradientColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
    'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
    'linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)',
    'linear-gradient(135deg, #ffd3a5 0%, #fd9853 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    'linear-gradient(135deg, #667db6 0%, #0082c8 100%, #0082c8 100%, #667db6 100%)',
    'linear-gradient(135deg, #f85032 0%, #e73827 100%)',
    'linear-gradient(135deg, #fce38a 0%, #f38181 100%)',
    'linear-gradient(135deg, #eea2a2 0%, #bbc1bf 50%, #57c6e1 100%)',
    'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)'
  ];

  const handleCustomColor = (hex: string) => {
    setCustomHex(hex);
    if (hex.length === 7 && hex.startsWith('#')) {
      onColorChange(hex);
    }
  };

  const applyColor = (color: string) => {
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="solid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="solid" className="text-xs sm:text-sm">Solid</TabsTrigger>
            <TabsTrigger value="gradient" className="text-xs sm:text-sm">Gradient</TabsTrigger>
            <TabsTrigger value="custom" className="text-xs sm:text-sm">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solid" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Solid Colors</Label>
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {solidColors.map(color => (
                  <button
                    key={color}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedColor === color 
                        ? 'border-blue-500 shadow-lg scale-110' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => applyColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gradient" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gradient Colors</Label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {gradientColors.map((gradient, index) => (
                  <button
                    key={index}
                    className={`w-12 h-8 sm:w-14 sm:h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedColor === gradient 
                        ? 'border-blue-500 shadow-lg scale-105' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ background: gradient }}
                    onClick={() => applyColor(gradient)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customHex}
                  onChange={(e) => handleCustomColor(e.target.value)}
                  className="w-16 h-10 p-1 rounded-lg"
                />
                <Input
                  type="text"
                  value={customHex}
                  onChange={(e) => handleCustomColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <Button onClick={() => applyColor(customHex)} className="w-full">
                Apply Custom Color
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onColorChange(undefined)}
            className="flex items-center gap-2 text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
            {selectedColor || defaultColor || 'Default'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorPanel;
