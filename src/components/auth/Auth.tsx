import React from 'react';
import { Login } from './Login';

/**
 * Auth Component
 * Simple wrapper that shows the login page
 * Google OAuth handles all authentication flows
 */
export const Auth: React.FC = () => {
  return <Login />;
};