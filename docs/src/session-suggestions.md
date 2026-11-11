# Session Suggestions

Zellij suggests other sessions that fit what the current session is working on, on the session card and in the [session manager](./session-manager-alias.md). For example, other sessions opened in the same folder, or on the same git branch, are listed first.

The order is set in the `session_suggestions` block of the [configuration file](./configuration.md). Without it, Zellij uses these rules:

```javascript
session_suggestions {
    match "directory" "git_branch"
    match "git_repo" "git_branch"
    match "directory"
    match "git_repo"
    then "recent"
}
```

## How sessions are ordered
Zellij keeps a few facts about each session (running or exited), taken from the folder of the session's focused pane. These are compared with the facts of the current session.

- `match` lists one or more facts. A session matches the rule when all of these facts are known for both sessions and are the same.
- The rules are tried in order, and the first one a session matches decides its place: sessions that match the first rule come first, then those that match the second rule, and so on.
- Within a rule, running sessions come first, then the most recently used ones.
- `then` sets the order of the sessions that match no rule:
  - `"recent"` (default) - running sessions first, then the most recently used
  - `"alphabetical"` - by name
  - `"none"` - these sessions are not suggested at all

Listing `match` rules replaces all the default rules.

## Built-in facts

| Fact | Value |
|---|---|
| `directory` | the folder |
| `git_repo` | the git repository of the folder (all worktrees of one repository count as the same repository) |
| `git_branch` | the checked-out git branch |
| `git_worktree` | the git worktree (the top folder of the checkout) |
| `hostname` | the name of the machine |

The built-in facts used by the rules are also shown as columns in the session manager.

## Custom facts
`fact` adds a fact of its own, from the output of a command:

```javascript
session_suggestions {
    fact "project" command="echo $PROJECT" column="project" at="live"
    match "project"
    match "directory"
}
```

- The first argument is the name of the fact. It cannot be one of the built-in names.
- `command` runs with `sh -c` in the folder. Its output, with spaces at the start and end removed, is the value of the fact. A command that fails, prints nothing, or takes longer than 1.5 seconds gives no value.
- `column` (optional) shows the fact as a column with this title in the session manager.
- `at` (optional) is when the command runs:
  - `"live"` (default) - again each time the folder of the focused pane changes
  - `"start"` - once, when the session starts, in the folder it started in

A fact used in a `match` rule must be built in or defined with `fact`.

## Ranking script
`script` hands the final order to a program:

```javascript
session_suggestions {
    script "~/.config/zellij/rank.sh" timeout_ms=300 hide_unlisted=false
}
```

- The first argument is the path of the program (a leading `~` is the home folder). It runs in the folder of the current session.
- `timeout_ms` (optional, default `300`) is how long, in milliseconds, Zellij waits for the program. If it takes longer, the order from the rules is shown first, and replaced by the program's order when it finishes (within 10 seconds).
- `hide_unlisted` (optional, default `false`): when true, sessions the program does not print are not suggested. When false, they follow the printed ones, in the order from the rules.

The program receives up to 100 sessions on its standard input, already in the order from the rules (running sessions first), one JSON object per line:

| Field | Value |
|---|---|
| `name` | the name of the session |
| `running` | `true` if the session is running, `false` if it exited and can be resurrected |
| `folder` | the session's folder, or `null` |
| `repo` | the session's git repository, or `null` |
| `worktree` | the session's git worktree, or `null` |
| `branch` | the session's git branch, or `null` |
| `facts` | an object with the session's other facts (eg. `hostname` and custom facts) |
| `last_used_secs_ago` | seconds since the session was last used |
| `tier` | the number of the first `match` rule the session matches, counting from `0`, or `null` |
| `target_folder` | the folder of the current session, or `null` |
| `target_repo` | the git repository of the current session, or `null` |
| `target_branch` | the git branch of the current session, or `null` |

The program prints session names, one per line, in the order they should be suggested. A name can be followed by a tab and a short label to show with that session. Unknown names and repeated names are ignored. If the program fails or prints nothing, the order from the rules is used.

For example, a script with this one command suggests running sessions only:

```sh
jq -r 'select(.running) | .name'
```

## Recording facts with a script
`record` runs a program that adds facts to the current session:

```javascript
session_suggestions {
    record "~/.config/zellij/record.sh"
}
```

The program runs in the folder of the focused pane, each time that folder changes. It receives one JSON line on its standard input:

```json
{"session": "my-session", "folder": "/home/me/projects/app"}
```

It prints facts, one per line, as `name<TAB>value` or `name=value`. These become facts of the session, and are passed to the [ranking script](#ranking-script) in its `facts` field. `match` rules can only use built-in facts and facts defined with `fact`. If the program fails or takes longer than 1.5 seconds, no facts are recorded.
