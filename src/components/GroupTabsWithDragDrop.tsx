import { useState } from 'react';
import { Plus, Edit3, Trash2, List, CheckCircle, CalendarDays, Star, Palette, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Group } from '@/types';
import ColorPanel from './ColorPanel';
import CustomAlert from './CustomAlert';

interface GroupTabsProps {
  groups: Group[];
  activeGroupId: string;
  onGroupSelect: (groupId: string) => void;
  onGroupsChange: (newGroup: Omit<Group, 'id'>) => void;
  onGroupUpdate?: (groupId: string, updatedGroup: Partial<Omit<Group, 'id'>>) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupReorder?: (groupIds: string[]) => void;
}

interface SortableGroupProps {
  group: Group;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableGroup({ group, isActive, onSelect, onEdit, onDelete }: SortableGroupProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isGradientColor = (color: string) => {
    return color.includes('gradient') || color.includes('linear-gradient');
  };

  const getGradientStyle = (color: string, isActive: boolean) => {
    if (isGradientColor(color)) {
      return {
        background: isActive ? color : 'transparent',
        backgroundClip: isActive ? 'border-box' : 'text' as any,
        WebkitBackgroundClip: isActive ? 'border-box' : 'text',
        color: isActive ? 'white' : 'transparent'
      };
    }
    return {
      background: isActive ? color : 'transparent',
      color: isActive ? 'white' : color
    };
  };

  const gradientStyle = getGradientStyle(group.color, isActive);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 flex-shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical className="w-3 h-3" />
      </div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                 <button
                   onClick={onSelect}
                   className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm whitespace-nowrap border ${
                     isActive
                       ? 'border-transparent shadow-lg'
                       : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                   }`}
                   style={gradientStyle}
                 >
                   <span
                     className={`font-medium ${
                       isGradientColor(group.color) && !isActive
                         ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                         : ''
                     }`}
                   >
                     {group.name}
                   </span>
                 </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{group.name}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
          <ContextMenuItem
            onClick={onEdit}
            className="text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Group
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onDelete}
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Group
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

const GroupTabsWithDragDrop = ({
  groups,
  activeGroupId,
  onGroupSelect,
  onGroupsChange,
  onGroupUpdate,
  onGroupDelete,
  onGroupReorder
}: GroupTabsProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#6366f1');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup = {
      name: newGroupName.trim(),
      color: newGroupColor
    };
    onGroupsChange(newGroup);
    setNewGroupName('');
    setNewGroupColor('#6366f1');
    setIsCreating(false);
  };

  const updateGroup = (updatedGroup: Group) => {
    if (onGroupUpdate) {
      onGroupUpdate(updatedGroup.id, {
        name: updatedGroup.name,
        color: updatedGroup.color,
        icon: updatedGroup.icon
      });
    }
    setEditingGroup(null);
  };

  const deleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group?.isDefault) return;
    
    setGroupToDelete(group || null);
    setShowDeleteAlert(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete && onGroupDelete) {
      onGroupDelete(groupToDelete.id);
      if (activeGroupId === groupToDelete.id) {
        // Switch to the first available custom group
        const remainingGroups = groups.filter(g => !g.isDefault && g.id !== groupToDelete.id);
        onGroupSelect(remainingGroups[0]?.id || '');
      }
    }
    setShowDeleteAlert(false);
    setGroupToDelete(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = customGroups.findIndex(group => group.id === active.id);
      const newIndex = customGroups.findIndex(group => group.id === over?.id);

      const newOrder = arrayMove(customGroups, oldIndex, newIndex);
      const newGroupIds = newOrder.map(group => group.id);
      
      if (onGroupReorder) {
        onGroupReorder(newGroupIds);
      }
    }
  };

  // Only show custom groups now
  const customGroups = groups.filter(g => !g.isDefault);

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Custom groups with drag and drop */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {customGroups.length > 0 && (
              <div className="flex-1 overflow-x-auto">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={customGroups.map(g => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      {customGroups.map(group => (
                        <SortableGroup
                          key={group.id}
                          group={group}
                          isActive={activeGroupId === group.id}
                          onSelect={() => onGroupSelect(group.id)}
                          onEdit={() => setEditingGroup(group)}
                          onDelete={() => deleteGroup(group.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  {customGroups.length === 0 && <span className="hidden sm:inline">Add Group</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Group</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {/* Create Group Dialog */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-4 max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && createGroup()}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              
              <ColorPanel
                selectedColor={newGroupColor}
                onColorChange={color => setNewGroupColor(color || '#6366f1')}
                title="Select Group Color"
                defaultColor="#6366f1"
              >
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Choose Color
                </Button>
              </ColorPanel>
              
              <Button onClick={createGroup} className="w-full" disabled={!newGroupName.trim()}>
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Group Dialog */}
        <Dialog open={editingGroup !== null} onOpenChange={open => !open && setEditingGroup(null)}>
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-4 max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Edit Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Group name"
                value={editingGroup?.name || ''}
                onChange={e =>
                  setEditingGroup(prev =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              
              {editingGroup && (
                <ColorPanel
                  selectedColor={editingGroup.color}
                  onColorChange={color =>
                    setEditingGroup(prev =>
                      prev ? { ...prev, color: color || '#6366f1' } : null
                    )
                  }
                  title="Select Group Color"
                  defaultColor="#6366f1"
                >
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Choose Color
                  </Button>
                </ColorPanel>
              )}
              
              <Button
                onClick={() => editingGroup && updateGroup(editingGroup)}
                className="w-full"
              >
                Update Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Delete Group Alert */}
        <CustomAlert
          isOpen={showDeleteAlert}
          onClose={() => {
            setShowDeleteAlert(false);
            setGroupToDelete(null);
          }}
          onConfirm={confirmDeleteGroup}
          title="Delete Group"
          message={`Are you sure you want to delete the group "${groupToDelete?.name}"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </TooltipProvider>
  );
};

export default GroupTabsWithDragDrop;