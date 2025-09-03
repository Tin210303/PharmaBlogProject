// hooks/useBlog.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import type { BlogApiParams, BlogPost } from '../types/blog';
import { blogService } from '../service/blogService';

interface UseBlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

interface UseBlogOptions {
  initialParams?: BlogApiParams;
  autoFetch?: boolean;
}

export const useBlog = (options: UseBlogOptions = {}) => {
  const { initialParams = {}, autoFetch = true } = options;
  
  const [state, setState] = useState<UseBlogState>({
    posts: [],
    loading: false,
    error: null,
    total: 0,
    totalPages: 0
  });

  // Sử dụng ref để tránh infinite loop
  const isMountedRef = useRef(true);
  const lastParamsRef = useRef<string>('');

  const fetchPosts = useCallback(async (params: BlogApiParams = {}, append = false) => {
    if (!isMountedRef.current) return;

    const currentParams = JSON.stringify({ ...initialParams, ...params });
    
    // Tránh fetch trùng lặp
    if (!append && currentParams === lastParamsRef.current && state.posts.length > 0) {
      return;
    }
    
    lastParamsRef.current = currentParams;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await blogService.getPosts({ ...initialParams, ...params });
      
      if (!isMountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        posts: append ? [...prev.posts, ...response.posts] : response.posts,
        total: response.total,
        totalPages: response.totalPages,
        loading: false
      }));
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error('useBlog fetchPosts error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      }));
    }
  }, [initialParams, state.posts.length]);

  const searchPosts = useCallback(async (query: string, page = 1, perPage = 10) => {
    if (!isMountedRef.current) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await blogService.searchPosts(query, page, perPage);
      
      if (!isMountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        posts: response.posts,
        total: response.total,
        totalPages: response.totalPages,
        loading: false
      }));
    } catch (error) {
      if (!isMountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      }));
    }
  }, []);

  const refreshPosts = useCallback(() => {
    lastParamsRef.current = ''; // Reset để force fetch
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (autoFetch) {
      fetchPosts();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    fetchPosts,
    searchPosts,
    refreshPosts
  };
};