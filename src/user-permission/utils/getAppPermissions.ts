import permissions from '../../../permissions.json';

type AppPermission = Record<string, string[]>;

export const getAppPermissions = (appName: string) =>
  permissions[appName] as AppPermission | undefined;
