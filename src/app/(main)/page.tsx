'use client';

import { AppFormContext, initialFormState, type AppFormState, type AppFormAction } from '@/app/form-context';
import usePersistedReducer from '@/hooks/use-persisted-reducer';
import { ProjectConfigCard } from '@/components/site2fire/project-config-card';
import { AndroidSettingsCard } from '@/components/site2fire/fire-tv-settings-card';
import { AppIconCard } from '@/components/site2fire/app-icon-card';
import { BuildCard } from '@/components/site2fire/build-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExtrasCard } from '@/components/site2fire/extras-card';

function appFormReducer(state: AppFormState, action: AppFormAction): AppFormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'HYDRATE_STATE':
        return { ...state, ...action.state };
    default:
      return state;
  }
}

export default function DashboardPage() {
  const [state, dispatch, isHydrated] = usePersistedReducer(
    appFormReducer,
    initialFormState,
    'site2fire-form-state'
  );

  if (!isHydrated) {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-[450px] rounded-lg" />
                    <Skeleton className="h-[400px] rounded-lg" />
                     <div className="grid md:grid-cols-2 gap-8">
                        <Skeleton className="h-[300px] rounded-lg" />
                        <Skeleton className="h-[300px] rounded-lg" />
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <Skeleton className="h-[250px] rounded-lg" />
                </div>
            </div>
      </div>
    )
  }

  return (
    <AppFormContext.Provider value={{ state, dispatch }}>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <ProjectConfigCard />
            <ExtrasCard />
            <div className="grid sm:grid-cols-2 gap-8">
                <AndroidSettingsCard />
                <AppIconCard />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <BuildCard />
          </div>
        </div>
      </div>
    </AppFormContext.Provider>
  );
}
