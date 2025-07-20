import React from 'react';
import { BarChart3, Zap, Globe, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGasStore } from '../store/gasStore';
import { useAuthStore } from '../store/authStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { ethPrice, isLoading, error } = useGasStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GasTracker Pro</h1>
                <p className="text-xs text-gray-400">Real-time cross-chain gas monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
              <Globe size={16} className="text-green-400" />
              <span className="text-sm text-white">ETH: ${ethPrice.toFixed(2)}</span>
            </div>

            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm">Connecting...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-400">
                <Zap size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User size={16} className="text-gray-400" />
                )}
                <span className="text-sm text-white">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};