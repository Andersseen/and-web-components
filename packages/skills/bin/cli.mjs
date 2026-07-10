#!/usr/bin/env node
// @andersseen/skills — install focused AI agent skills into a consumer project.
//
// Two modes, mirroring the two things a dev actually wants:
//   install  → copies the skill into ./.claude/skills/<name>/ (agent picks it up)
//   download → copies the skill into ./andersseen-skills/<name>/ (review first)
//
// Zero runtime dependencies: Node built-ins only, so `npx @andersseen/skills`
// works offline once the package is fetched.

import { readdir, readFile, mkdir, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = resolve(HERE, '..', 'skills');
const INSTALL_DIR = resolve(process.cwd(), '.claude', 'skills');
const DOWNLOAD_DIR = resolve(process.cwd(), 'andersseen-skills');

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};
const paint = (color, s) => (process.stdout.isTTY ? `${c[color]}${s}${c.reset}` : s);

/** Read every skill folder that has a SKILL.md, with its description. */
async function discoverSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!existsSync(skillMd)) continue;
    const raw = await readFile(skillMd, 'utf8');
    skills.push({
      name: entry.name,
      alias: entry.name.replace(/^andersseen-/, ''),
      description: frontmatterDescription(raw),
      dir: join(SKILLS_DIR, entry.name),
      orchestrator: entry.name === 'andersseen',
    });
  }
  // Orchestrator first, then alphabetical.
  return skills.sort((a, b) => Number(b.orchestrator) - Number(a.orchestrator) || a.name.localeCompare(b.name));
}

function frontmatterDescription(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return '';
  const body = match[1];
  const line = /description:\s*(?:'([^']*)'|"([^"]*)"|(.*))/.exec(body);
  if (!line) return '';
  return (line[1] ?? line[2] ?? line[3] ?? '').replace(/\s+/g, ' ').trim();
}

/** Resolve user tokens (folder name, alias, or "all") to skill objects. */
function resolveSelection(tokens, skills) {
  const wanted = new Set();
  const unknown = [];
  for (const tokenRaw of tokens) {
    const token = tokenRaw.toLowerCase();
    if (token === 'all' || token === '*') {
      skills.forEach(s => wanted.add(s.name));
      continue;
    }
    const hit = skills.find(s => s.name === token || s.alias === token);
    if (hit) wanted.add(hit.name);
    else unknown.push(tokenRaw);
  }
  return { selected: skills.filter(s => wanted.has(s.name)), unknown };
}

async function place(skill, mode, force) {
  const root = mode === 'download' ? DOWNLOAD_DIR : INSTALL_DIR;
  const target = join(root, skill.name);
  if (existsSync(target) && !force) {
    console.log(
      `  ${paint('yellow', '•')} ${skill.name} ${paint('dim', 'already exists (skipped — pass --force to overwrite)')}`,
    );
    return 'skipped';
  }
  await mkdir(root, { recursive: true });
  await cp(skill.dir, target, { recursive: true, force: true });
  const shown = mode === 'download' ? join('andersseen-skills', skill.name) : join('.claude', 'skills', skill.name);
  console.log(`  ${paint('green', '✓')} ${skill.name} ${paint('dim', '→ ' + shown)}`);
  return 'written';
}

function printSkillList(skills) {
  const pad = Math.max(...skills.map(s => s.name.length));
  for (const s of skills) {
    const tag = s.orchestrator ? paint('cyan', ' [orchestrator]') : '';
    console.log(`  ${paint('bold', s.name.padEnd(pad))}${tag}`);
    if (s.description) {
      const short = s.description.length > 96 ? s.description.slice(0, 93) + '…' : s.description;
      console.log(`  ${paint('dim', ' '.repeat(pad) + '  ' + short)}`);
    }
  }
}

function help() {
  console.log(`
${paint('bold', '@andersseen/skills')} — install AI agent skills for the Andersseen ecosystem

${paint('bold', 'Usage')}
  npx @andersseen/skills                      ${paint('dim', 'interactive picker (choose skills + install/download)')}
  npx @andersseen/skills list                 ${paint('dim', 'list available skills')}
  npx @andersseen/skills add <name...>        ${paint('dim', 'install into ./.claude/skills/')}
  npx @andersseen/skills add --all            ${paint('dim', 'install every skill')}
  npx @andersseen/skills add <name> --download ${paint('dim', 'download into ./andersseen-skills/ (review first)')}

${paint('bold', 'Options')}
  -d, --download        Download only — do not activate in .claude/skills
  -a, --all             Select every skill
  -f, --force           Overwrite an existing skill folder
  -h, --help            Show this help

${paint('bold', 'Names')} accept the folder name or its short alias, e.g.
  andersseen-web-components  ${paint('dim', '≡')}  web-components
  andersseen                 ${paint('dim', '≡')}  orchestrator ("andersseen" routes to the right skill)

${paint('bold', 'Examples')}
  npx @andersseen/skills add andersseen web-components icon
  pnpm dlx @andersseen/skills add --all
  yarn dlx @andersseen/skills add layout --download
`);
}

function ask(rl, question) {
  return new Promise(res => rl.question(question, a => res(a.trim())));
}

async function interactive(skills) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log(paint('bold', '\nAndersseen agent skills\n'));
    skills.forEach((s, i) => {
      const tag = s.orchestrator ? paint('cyan', ' [orchestrator]') : '';
      console.log(`  ${paint('bold', String(i + 1).padStart(2))}. ${s.name}${tag}`);
      if (s.description) {
        const short = s.description.length > 88 ? s.description.slice(0, 85) + '…' : s.description;
        console.log(`      ${paint('dim', short)}`);
      }
    });
    console.log(`\n  ${paint('dim', "Enter numbers (e.g. 1,3), a name, or 'all'.")}`);
    const pick = await ask(rl, paint('cyan', '\nSkills to add: '));
    let selected;
    if (/^(all|\*)$/i.test(pick.trim())) {
      selected = skills.slice();
    } else {
      const byIndex = pick
        .split(/[,\s]+/)
        .filter(Boolean)
        .map(t => (/^\d+$/.test(t) ? skills[Number(t) - 1]?.name : t))
        .filter(Boolean);
      selected = resolveSelection(byIndex, skills).selected;
    }
    if (selected.length === 0) {
      console.log(paint('yellow', '\nNothing selected. Bye.'));
      return 0;
    }

    console.log(
      `\n  ${paint('bold', '1')}. Install  ${paint('dim', '→ ./.claude/skills/  (your agent uses it immediately)')}`,
    );
    console.log(
      `  ${paint('bold', '2')}. Download ${paint('dim', '→ ./andersseen-skills/  (review before activating)')}`,
    );
    const action = await ask(rl, paint('cyan', '\nChoose 1 or 2 [1]: '));
    const mode = action.trim() === '2' || /^d/i.test(action.trim()) ? 'download' : 'install';

    console.log('');
    for (const skill of selected) await place(skill, mode, false);
    printDone(mode, selected);
    return 0;
  } finally {
    rl.close();
  }
}

function printDone(mode, selected) {
  console.log('');
  if (mode === 'install') {
    console.log(paint('green', `Installed ${selected.length} skill(s) into .claude/skills/.`));
    console.log(paint('dim', 'Restart your agent (or reload skills) to pick them up.'));
  } else {
    console.log(paint('green', `Downloaded ${selected.length} skill(s) into andersseen-skills/.`));
    console.log(paint('dim', 'Move the folders into .claude/skills/ when you are ready to activate them.'));
  }
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('-h') || argv.includes('--help')) return help();

  const skills = await discoverSkills();
  if (skills.length === 0) {
    console.error(paint('red', 'No skills bundled with this package.'));
    process.exitCode = 1;
    return;
  }

  const command = argv[0];

  if (command === 'list' || command === 'ls') {
    console.log(paint('bold', '\nAvailable skills\n'));
    printSkillList(skills);
    console.log('');
    return;
  }

  if (command === undefined) return interactive(skills);

  if (command === 'add' || command === 'install' || command === 'i') {
    const rest = argv.slice(1);
    const download = rest.includes('-d') || rest.includes('--download');
    const all = rest.includes('-a') || rest.includes('--all');
    const force = rest.includes('-f') || rest.includes('--force');
    const names = rest.filter(a => !a.startsWith('-'));
    const mode = download ? 'download' : 'install';

    let selected;
    if (all) {
      selected = skills.slice();
    } else {
      if (names.length === 0) {
        console.error(paint('red', 'Specify at least one skill name, or use --all.'));
        console.error(paint('dim', 'Run `npx @andersseen/skills list` to see the options.'));
        process.exitCode = 1;
        return;
      }
      const { selected: sel, unknown } = resolveSelection(names, skills);
      if (unknown.length) {
        console.error(paint('red', `Unknown skill(s): ${unknown.join(', ')}`));
        console.error(paint('dim', 'Run `npx @andersseen/skills list` to see the options.'));
        process.exitCode = 1;
        return;
      }
      selected = sel;
    }

    console.log('');
    for (const skill of selected) await place(skill, mode, force);
    printDone(mode, selected);
    return;
  }

  console.error(paint('red', `Unknown command: ${command}`));
  help();
  process.exitCode = 1;
}

main().catch(err => {
  console.error(paint('red', 'Error: ' + (err?.message ?? String(err))));
  process.exitCode = 1;
});
