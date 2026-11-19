// Which installed builds take an update? (Lesson 9.3, "Runtime Versions" and "Channels, Profiles and Publishing")
export type Build = {
  name: string;
  channel: string | null; // from its build profile in eas.json (development builds have none)
  runtimeVersion: string; // the label of its native part (the fingerprint it was made with)
  canUpdate: boolean; // made with expo-updates AND an update address (Lesson 9.2's build was not)
};

export type Update = { channel: string; runtimeVersion: string; message: string };

// TODO 1: the channel is not enough. Which two other facts decide whether a build takes the update?
export function takesUpdate(build: Build, update: Update): boolean {
  return build.channel === update.channel;
}

export function whoGetsIt(builds: Build[], update: Update): string[] {
  return builds.filter((build) => takesUpdate(build, update)).map((build) => build.name);
}
