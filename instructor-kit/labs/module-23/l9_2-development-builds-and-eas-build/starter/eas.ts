// The parts of eas.json this lab reads (given: do not edit).
export interface BuildProfile {
  extends?: string;
  developmentClient?: boolean;
  distribution?: 'internal' | 'store';
  environment?: string;
  autoIncrement?: boolean;
  env?: Record<string, string>;
  ios?: { simulator?: boolean };
  android?: { buildType?: 'apk' | 'app-bundle' };
}

export interface EasJson {
  build: Record<string, BuildProfile>;
}

export function parseEasJson(text: string): EasJson {
  const data: unknown = JSON.parse(text);
  if (typeof data !== 'object' || data === null || !('build' in data) || typeof data.build !== 'object') {
    throw new Error('eas.json has no "build" section');
  }
  return data as EasJson;
}
