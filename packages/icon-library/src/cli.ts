#!/usr/bin/env node
/**
 * `and-icons` CLI — the build-time-scanner loading strategy's entrypoint
 * (`pnpm exec and-icons scan` / `npx and-icons scan`). Thin argv/config glue
 * over `buildIconsCss()` (build.ts); all the real logic (walking files,
 * validating names, generating CSS) lives there and in scanner.ts/
 * generate-css.ts.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { buildIconsCss, UnknownIconsError } from './build';
import type { AndIconsConfig } from './scanner';

const DEFAULT_CONFIG_FILE = 'and-icons.config.mjs';

const printUsage = (): void => {
  console.info(
    [
      '@andersseen/icon',
      '',
      'Usage:',
      '  and-icons scan [--out <file>] [--config <file>]',
      '',
      '  --out <file>     Output CSS file (default: config outFile, or ./and-icons.generated.css)',
      '  --config <file>  Config file (default: ./and-icons.config.mjs if present)',
      '',
      'Config file (and-icons.config.mjs):',
      '  export default { safelist: [...], include: [...], exclude: [...], outFile: "..." };',
    ].join('\n'),
  );
};

const loadConfig = async (configPath: string, explicit: boolean): Promise<AndIconsConfig> => {
  const resolved = path.resolve(process.cwd(), configPath);
  if (!existsSync(resolved)) {
    if (explicit) {
      throw new Error(`Config file not found: ${configPath}`);
    }
    return {};
  }
  const mod = (await import(pathToFileURL(resolved).href)) as { default?: AndIconsConfig };
  return mod.default ?? {};
};

const main = async (): Promise<number> => {
  const [command, ...rest] = process.argv.slice(2);

  if (command === '--help' || command === '-h') {
    printUsage();
    return 0;
  }
  if (command !== 'scan') {
    printUsage();
    return 1;
  }

  const { values } = parseArgs({
    args: rest,
    options: {
      out: { type: 'string' },
      config: { type: 'string' },
    },
    strict: true,
  });

  const config = await loadConfig(values.config ?? DEFAULT_CONFIG_FILE, values.config !== undefined);

  try {
    const result = buildIconsCss({
      safelist: config.safelist,
      include: config.include,
      exclude: config.exclude,
      outFile: values.out ?? config.outFile,
    });

    console.info(
      [
        '@andersseen/icon',
        '',
        `Scanned ${result.filesScanned} file${result.filesScanned === 1 ? '' : 's'}`,
        `Found ${result.icons.length} icon${result.icons.length === 1 ? '' : 's'}`,
        `Generated ${path.relative(process.cwd(), result.outFile)}`,
      ].join('\n'),
    );
    return 0;
  } catch (error) {
    if (error instanceof UnknownIconsError) {
      for (const { name, file } of error.unknown) {
        console.error(`Unknown icon "${name}"\n  ${file}`);
      }
      return 1;
    }
    throw error;
  }
};

main()
  .then(code => process.exit(code))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
