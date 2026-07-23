# Security Policy

## Supported versions

Only the latest published version of each `@andersseen/*` package receives
security fixes. Packages are versioned independently — check
[npm](https://www.npmjs.com/org/andersseen) for the current release.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately through GitHub's
[private vulnerability reporting](https://github.com/Andersseen/and-web-components/security/advisories/new),
which notifies the maintainers without disclosing details publicly.

Useful things to include:

- Which package and version is affected
- What an attacker can achieve
- Steps or a minimal reproduction
- Whether it needs a specific browser, framework or build setup

You can expect an initial response within a few days. If the report is
confirmed, we'll agree a disclosure timeline with you and credit you in the
advisory unless you'd rather stay anonymous.

## Scope

In scope: anything shipped in a published `@andersseen/*` package — XSS through
component props or slots, prototype pollution, DOM clobbering in
`@andersseen/behaviors`, sandbox escapes in `@andersseen/mcp`.

Out of scope: vulnerabilities in the demo, docs and landing apps under `apps/`
(not published, not intended for production use), and issues that only affect
unsupported or end-of-life browsers.
