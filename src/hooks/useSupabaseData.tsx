import { useState, useEffect, useCallback } from 'react';
import { Task, Group, UserStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export function useSupabaseData(user?: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({} as UserStats);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [tasksRes, groupsRes, profileRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', user.id),
        supabase.from('groups').select('*').eq('user_id', user.id).order('display_order', { ascending: true }),
        supabase.from('profiles').select('*').eq('user_id', user.id).single()
      ]);

      if (tasksRes.error) throw tasksRes.error;
      setTasks(camelcaseKeys(tasksRes.data || []));

      if (groupsRes.error) throw groupsRes.error;
      setGroups(camelcaseKeys(groupsRes.data || []));
      
      if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;
      if (profileRes.data) {
        setUserStats(camelcaseKeys(profileRes.data) as UserStats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const updateUserStats = async (updater: (prev: UserStats) => UserStats) => {
    if (!user) return;
    const updatedStats = updater(userStats);
    setUserStats(updatedStats);
    try {
      await supabase.from('profiles').update(snakecaseKeys(updatedStats as Record<string, any>)).eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const createTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) return;
    try {
      const taskToInsert = { ...newTask, userId: user.id };
      const { data, error } = await supabase.from('tasks').insert(snakecaseKeys(taskToInsert)).select().single();
      if (error) throw error;
      setTasks(prev => [...prev, camelcaseKeys(data)]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase.from('tasks').update(snakecaseKeys(updates)).eq('id', taskId).select().single();
      if (error) throw error;
      setTasks(prev => prev.map(task => (task.id === taskId ? camelcaseKeys(data) : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  const createGroup = async (newGroup: Omit<Group, 'id'>) => {
    if (!user) return;
    try {
      const groupToInsert = { ...newGroup, userId: user.id };
      const { data, error } = await supabase.from('groups').insert(snakecaseKeys(groupToInsert)).select().single();
      if (error) throw error;
      setGroups(prev => [...prev, camelcaseKeys(data)]);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };
  
  const updateGroup = async (groupId: string, updatedGroup: Partial<Omit<Group, 'id'>>) => {
    try {
      const { data, error } = await supabase.from('groups').update(snakecaseKeys(updatedGroup)).eq('id', groupId).select().single();
      if (error) throw error;
      setGroups(prev => prev.map(group => (group.id === groupId ? camelcaseKeys(data) : group)));
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase.from('groups').delete().eq('id', groupId);
      if (error) throw error;
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };
  
  const reorderGroups = async (groupIds: string[]) => {
    try {
      const updates = groupIds.map((id, index) =>
        supabase.from('groups').update({ display_order: index }).eq('id', id)
      );
      await Promise.all(updates);
      setGroups(prev => {
        const reordered = [...prev].sort((a, b) => groupIds.indexOf(a.id) - groupIds.indexOf(b.id));
        return reordered;
      });
    } catch (error) {
      console.error('Error reordering groups:', error);
    }
  };

  // ✅ FIX: This return statement now includes all the missing functions
  return {
    tasks,
    groups,
    userStats,
    loading,
    updateTask,
    createTask,
    deleteTask,
    updateUserStats,
    createGroup,
    updateGroup,
    deleteGroup,
    reorderGroups,
    refetch: loadData,
  };
}