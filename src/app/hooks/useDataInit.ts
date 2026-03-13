import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useDataInit() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initData() {
      try {
        // Check if workspaces exist
        const workspaces = await api.getWorkspaces();
        
        if (!workspaces || workspaces.length === 0) {
          // Seed initial data
          await api.seedData();
          console.log('Initial data seeded successfully');
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  return { initialized, loading };
}
