---
'@andersseen/headless-components': patch
---

Fix `machine.snapshot.event` on the generic `createMachine()` state-machine
util: direct access via `machine.snapshot` always returned `event: null`, even
after transitions, while a `subscribe()` callback's snapshot correctly carried
the triggering event — two different, coexisting behaviors for the same
documented field ("the event that caused the current state"). Both access paths
now agree: `event` is `null` only for the initial snapshot and otherwise always
the last event that actually caused a transition (a guard-blocked or unhandled
`send()` never overwrites it). No type changes; this only fixes the
previously-broken direct-access value to match the contract the JSDoc already
described.
