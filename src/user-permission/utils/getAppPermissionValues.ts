import { getAppPermissions } from './getAppPermissions';

export const getAppPermissionsValues = (appName: string) => {
  const appPermissions = getAppPermissions(appName);
  if (appPermissions) {
    return Object.values(appPermissions)
      .flat()
      .map((permission) => `${appName}_${permission}`); // we want to avoid the same user having permissions to other app.
  }

  return [];
};
