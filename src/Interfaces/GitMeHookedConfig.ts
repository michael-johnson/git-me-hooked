interface Scripts {
  [index: string]: Command[]
}

interface Command {
  exec: string;
  convertWarningsToErrors?: boolean;
}

interface GitMeHookedConfig {
  includes?: string[];
  scripts: Scripts;
}
