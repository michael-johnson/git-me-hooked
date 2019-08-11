interface Scripts {
  [index: string]: Command[]
}

interface Command {
  exec: string;
}

interface GitMeHookedConfig {
  includes?: string[];
  scripts?: Scripts;
}
