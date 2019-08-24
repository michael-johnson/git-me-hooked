interface Scripts {
  [index: string]: Command[]
}

interface Command {
  exec: string;
  name?: string;
  silence?: boolean;
}

interface GitMeHookedConfig {
  includes?: string[];
  scripts?: Scripts;
}
