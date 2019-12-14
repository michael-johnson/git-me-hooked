interface Scripts {
  [index: string]: Command[]
}

interface Command {
  exec: string;
  name?: string;
  silence?: boolean;
  config?: object;
}

interface GitMeHookedConfig {
  includes?: string[];
  scripts?: Scripts;
}
