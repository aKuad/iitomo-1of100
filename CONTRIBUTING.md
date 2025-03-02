# CONTRIBUTING

There are development conventions in this repository.

Main purpose is organizing and reminding conventions for me ([aKuad](https://github.com/aKuad)).

## Workflow conventions

1 issue, 1 branch, 1 PR

Follow this workflow:

1. Create an issue (what describe required work)
2. Create a branch and start working on it
3. Sometimes push the working branch
4. Create a pull request for the working branch merge to `main`
5. Confirm the pull request

Prohibited:

- Create branches or PRs without any issues
- Directly commit to `main` branch

## Branch naming, GitHub issue/PR tag and issue template

### Branch name format

`<target>/<action>/<desc>`

For `<desc>`, put words for describe the work. Multiple words join with `-`. (e.g. `feature/add/work-desc-here`)

### GitHub issue/PR tag

A branch must be linked to an issue and PR. The issue and PR must be have related tags.

Tags conventions also indicate below.

### Target word and issue template

> [!NOTE]
>
> Issue template selection and edit target is related.

| Target word | GitHub tag   | Issue template | Description                           |
| ----------- | ------------ | -------------- | ------------------------------------- |
| `feature`   | `tg/feature` | Feature add    | Code editing                          |
| `doc`       | `tg/doc`     | Documentation  | Document editing                      |
| `infra`     | `tg/infra`   | Infrastructure | Repository infrastructure maintaining |
| `misc`      | `tg/misc`    | Miscellaneous  | Other of them                         |

Feature fix `fix/*` Feature fix - something need modification

### Action word

| Action word | GitHub tag | Action       |
| ----------- | ---------- | ------------ |
| `add`       | `act/add`  | Addition     |
| `mod`       | `act/mod`  | Modification |
| `fix`       | `act/fix`  | Fix          |
| `del`       | `act/del`  | Deletion     |

## Coding conventions

> [!IMPORTANT]
>
> For test code, there are some different conventions. ~~See: [src/tests/README.md](src/tests/README.md)~~ Work in progress.

### Source files location

| Location      | Items                                      |
| ------------- | ------------------------------------------ |
| `src/modules` | TS modules for server side                 |
| `src/pages`   | HTML pages of client UI                    |
| `src/static`  | JS modules for client & server side        |
| `src/tests`   | Test code of modules in `modules`/`static` |

### Files naming

| Item                        | Convention (also `.ts` is) |
| --------------------------- | -------------------------- |
| Class definition module     | `UpperCamelCase.js`        |
| Functions definition module | `snake_case.js`            |

### Language .ts or .js

For server side code, use language TypeScript `.ts`.

TypeScript can runs on server side, not on client side. Then `.ts` indicates only for server side code.

### Functions and variables (etc.) naming

Follow [RFC 430](https://github.com/rust-lang/rfcs/blob/master/text/0430-finalizing-naming-conventions.md).

But in JavaScript, constant variables can be written in lower_snake_case. Because there are many constant variables in JavaScript (const object members won't be protected from writing), then many UPPER CHARACTERS in the code is bad looks.

## Messages syntax conventions

### Commit message

| Syntax       | Description                   |
| ------------ | ----------------------------- |
| `Add: <mes>` | Made something new            |
| `Mod: <mes>` | Something needed modification |
| `Fix: <mes>` | Something was wrong           |
| `Del: <mes>` | Something been unnecessary    |

Put a short description and reasons of commit into `<mes>`. Reasons are better.

### Commit sign-off

Put sign-off into each commit message.

e.g.

```txt
commit message here

Signed-off-by: aKuad <53811809+aKuad@users.noreply.github.com>
```

On git CLI, you can put sign-off easily with `-s` option.

```sh
git commit -s -m "commit message here"
```

### Pull request title

To create a pull request, 1 related issue requires. (1 issue, 1 branch, 1 PR)

```txt
related issue title (#issue_id)
```

e.g.

```txt
Module creation for core feature (#1)
```

### Merge commit message

```txt
related issue title (Issue #issue_id, PR #pr_id)
```

e.g.

```txt
Module creation for core feature (Issue #1, PR #2)
```
