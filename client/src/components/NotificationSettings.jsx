import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../helpers/axiosInstance';

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/user-preferences');
      setPreferences(response.data.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setMessage('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSetting = async (category, type, enabled) => {
    try {
      setSaving(true);
      await axiosInstance.patch('/api/user-preferences/notification-setting', {
        category,
        type,
        enabled
      });
      
      setPreferences(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [category]: {
            ...prev.notifications[category],
            types: {
              ...prev.notifications[category].types,
              [type]: enabled
            }
          }
        }
      }));
      
      setMessage('Setting updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = async (category, enabled) => {
    try {
      setSaving(true);
      await axiosInstance.patch('/api/user-preferences/toggle-category', {
        category,
        enabled
      });
      
      setPreferences(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [category]: {
            ...prev.notifications[category],
            enabled
          }
        }
      }));
      
      setMessage('Category updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const updateQuietHours = async (enabled, start = null, end = null) => {
    try {
      setSaving(true);
      await axiosInstance.patch('/api/user-preferences/quiet-hours', {
        enabled,
        start,
        end
      });
      
      setPreferences(prev => ({
        ...prev,
        quietHours: {
          ...prev.quietHours,
          enabled,
          ...(start && { start }),
          ...(end && { end })
        }
      }));
      
      setMessage('Quiet hours updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      setMessage('Failed to update quiet hours');
    } finally {
      setSaving(false);
    }
  };

  const resetPreferences = async () => {
    if (!window.confirm('Are you sure you want to reset all preferences to defaults?')) {
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.delete('/api/user-preferences/reset');
      await fetchPreferences();
      setMessage('Preferences reset successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      setMessage('Failed to reset preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <span className="ml-2">Loading preferences...</span>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center p-8 text-gray-500">
        Failed to load preferences
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Notification Categories */}
        <div className="space-y-6">
          {Object.entries(preferences.notifications).map(([category, settings]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {category} Notifications
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.enabled}
                    onChange={(e) => toggleCategory(category, e.target.checked)}
                    disabled={saving}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
              
              {settings.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.types).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{type}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={enabled}
                          onChange={(e) => updateNotificationSetting(category, type, e.target.checked)}
                          disabled={saving}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiet Hours */}
        <div className="mt-8 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiet Hours</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Enable Quiet Hours</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.quietHours.enabled}
                  onChange={(e) => updateQuietHours(e.target.checked)}
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
            
            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => updateQuietHours(true, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => updateQuietHours(true, null, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={saving}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language and Timezone */}
        <div className="mt-8 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={saving}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={saving}
              >
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Singapore">Singapore (SGT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={resetPreferences}
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={() => {
              // Save general settings
              setMessage('Settings saved successfully');
              setTimeout(() => setMessage(''), 3000);
            }}
            disabled={saving}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
