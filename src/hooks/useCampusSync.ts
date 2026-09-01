'use client';

import { useEffect } from 'react';
import { firebaseConfigured } from '@/firebase/config';
import { subscribeCampusCloud } from '@/services/campusBackend';
import { useCampusStore } from '@/store/campusStore';
import { useUserStore } from '@/store/userStore';

export function useCampusSync() {
  const user = useUserStore(state => state.user);
  const loading = useUserStore(state => state.loading);

  useEffect(() => {
    void useCampusStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const store = useCampusStore.getState();
    if (loading) {
      store.setBackendState('connecting');
      return;
    }
    if (!firebaseConfigured || !user) {
      store.setBackendState('demo');
      return;
    }
    store.setBackendState('connecting');
    return subscribeCampusCloud(user.role, {
      events: items => useCampusStore.getState().mergeEvents(items),
      cases: items => useCampusStore.getState().mergeCases(items),
      posts: items => useCampusStore.getState().mergePosts(items),
      confessions: items => useCampusStore.getState().mergeConfessions(items),
      notifications: items => useCampusStore.getState().mergeNotifications(items),
      moderation: items => useCampusStore.getState().replaceModeration(items),
      rsvps: items => useCampusStore.getState().applyRsvps(items),
      live: () => useCampusStore.getState().setBackendState('live'),
      error: message => useCampusStore.getState().setBackendState('error', message),
    });
  }, [loading, user]);
}
