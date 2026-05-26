'use client';

import { createContext, Dispatch, useContext } from 'react';

export type AppPermission =
  | 'INTERNET'
  | 'ACCESS_NETWORK_STATE'
  | 'ACCESS_COARSE_LOCATION'
  | 'ACCESS_FINE_LOCATION'
  | 'CAMERA'
  | 'READ_EXTERNAL_STORAGE'
  | 'WRITE_EXTERNAL_STORAGE'
  | 'READ_MEDIA_IMAGES'
  | 'READ_MEDIA_VIDEO'
  | 'READ_MEDIA_AUDIO'
  | 'RECORD_AUDIO'
  | 'MODIFY_AUDIO_SETTINGS'
  | 'VIBRATE';

export type AppFormState = {
  projectTitle: string;
  webUrl: string;
  packageName: string;
  versionName: string;
  versionCode: string;
  dpadSupport: boolean;
  orientation: 'landscape' | 'portrait' | 'auto';
  appIcon: string | null;
  dpadScript: string;
  dpadScriptExplanation: string;
  permissions: AppPermission[];
  supportZoom: boolean;
  zoomButtons: boolean;
  sideScrollBars: boolean;
  textSelection: boolean;
  saveFormData: boolean;
  fullScreen: boolean;
  javaScriptAPIs: boolean;
  httpsOnlyContent: boolean;
  allowExternalUrls: boolean;
  confirmOnExit: boolean;
  enableGpsPrompt: boolean;
  disallowScreenshot: boolean;
  allowFileAccess: boolean;
  allowCrossOrigin: boolean;
  showToolbar: boolean;
  liveToolbarTitle: boolean;
  homeButton: boolean;
  pullToRefresh: boolean;
  deepLinking: boolean;
  popUpBlocker: boolean;
};

export const initialFormState: AppFormState = {
  projectTitle: 'My TV App',
  webUrl: '',
  packageName: 'com.site2fire.mytvapp',
  versionName: '1.0',
  versionCode: '1',
  dpadSupport: true,
  orientation: 'landscape',
  appIcon: null,
  dpadScript: '',
  dpadScriptExplanation: '',
  permissions: [
    'INTERNET',
    'ACCESS_NETWORK_STATE',
    'ACCESS_COARSE_LOCATION',
    'ACCESS_FINE_LOCATION',
    'CAMERA',
    'READ_MEDIA_IMAGES',
    'WRITE_EXTERNAL_STORAGE',
    'RECORD_AUDIO',
    'VIBRATE',
  ],
  supportZoom: true,
  zoomButtons: false,
  sideScrollBars: false,
  textSelection: true,
  saveFormData: true,
  fullScreen: false,
  javaScriptAPIs: true,
  httpsOnlyContent: false,
  allowExternalUrls: true,
  confirmOnExit: true,
  enableGpsPrompt: false,
  disallowScreenshot: false,
  allowFileAccess: false,
  allowCrossOrigin: false,
  showToolbar: false,
  liveToolbarTitle: false,
  homeButton: false,
  pullToRefresh: false,
  deepLinking: false,
  popUpBlocker: false,
};

export type AppFormAction =
  | { type: 'UPDATE_FIELD'; field: keyof AppFormState; value: any }
  | { type: 'HYDRATE_STATE'; state: AppFormState };

export const AppFormContext = createContext<{
  state: AppFormState;
  dispatch: Dispatch<AppFormAction>;
} | null>(null);

export function useAppForm() {
  const context = useContext(AppFormContext);
  if (!context) {
    throw new Error('useAppForm must be used within an AppFormProvider');
  }
  return context;
}
