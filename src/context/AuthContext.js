import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {api} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) return;

        setToken(storedToken);

        const me = await api.get('/auth/me', {
          headers: {Authorization: `Bearer ${storedToken}`},
        });

        setUser(me.data);
      } catch (e) {
        await AsyncStorage.removeItem('token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const loginWithToken = async (nextUser, nextToken) => {
    await AsyncStorage.setItem('token', nextToken);
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      loading,
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loginWithToken,
      logout,
      setUser,
    }),
    [loading, user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider />');
  }
  return ctx;
}
