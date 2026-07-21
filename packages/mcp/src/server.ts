/**
 * And Web Components MCP server (core).
 *
 * Builds an `McpServer` exposing the component catalog, per-framework usage
 * examples, install info, theme info, resources and prompts. Transport-agnostic
 * — `stdio.ts` wires it to stdin/stdout; the same factory can be mounted behind
 * an HTTP transport later without changing any tool logic.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  catalog,
  componentTags,
  getComponent,
  listComponents,
  projectInfo,
  themeInfo,
  topLevelComponents,
} from './catalog';
import { buildUsage, FRAMEWORKS, FRAMEWORK_INFO } from './frameworks';
import type { Component, Framework } from './types';

const componentEnum = z
  .string()
  .describe(`Component tag, e.g. "and-button". Valid tags: ${componentTags.join(', ')}`)
  .refine(val => componentTags.includes(val), {
    message: `Unknown component. Valid tags: ${componentTags.join(', ')}`,
  });

const frameworkEnum = z
  .enum(FRAMEWORKS as [Framework, ...Framework[]])
  .describe('Target framework: html | react | vue | angular');

function subComponentsOf(tag: string): string[] {
  return catalog.filter(c => c.parent === tag).map(c => c.tag);
}

function componentSummary(component: Component) {
  return {
    tag: component.tag,
    name: component.name,
    description: component.description,
    ...(component.parent ? { parent: component.parent } : { subComponents: subComponentsOf(component.tag) }),
  };
}

function json(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function jsonError(message: string) {
  return { ...json({ error: message }), isError: true as const };
}

export function createServer(): McpServer {
  const server = new McpServer(
    { name: 'and-web-components', version: '0.1.0' },
    {
      capabilities: { tools: {}, resources: {}, prompts: {}, logging: {} },
      instructions:
        'And Web Components is a framework-agnostic UI library: Stencil web components on a ' +
        'pure-TypeScript headless core, with generated React, Vue and Angular wrappers. Use these ' +
        'tools to list components, read their exact attributes/events/slots, and generate correct, ' +
        'framework-specific usage snippets. Never invent attributes, events or selectors — call ' +
        '`get_component` when unsure.',
    },
  );

  // -- Tools ----------------------------------------------------------------

  server.registerTool(
    'list_components',
    {
      description:
        'List And Web Components. By default returns top-level components with their ' +
        'sub-components; pass includeSubcomponents=true for a flat list of every tag.',
      inputSchema: {
        includeSubcomponents: z
          .boolean()
          .optional()
          .describe('Include structural sub-components (e.g. and-card-header) as top-level rows.'),
      },
    },
    async ({ includeSubcomponents }) => {
      const source = includeSubcomponents ? listComponents() : topLevelComponents();
      return json(source.map(componentSummary));
    },
  );

  server.registerTool(
    'get_component',
    {
      description:
        'Get full metadata for a component: attributes (with types/defaults), events, public ' +
        'methods, slots and CSS parts. This is the source of truth — do not guess.',
      inputSchema: { component: componentEnum },
    },
    async ({ component }) => {
      const comp = getComponent(component);
      if (!comp) return jsonError(`Component "${component}" not found.`);
      return json({ ...comp, subComponents: subComponentsOf(comp.tag) });
    },
  );

  server.registerTool(
    'get_usage_example',
    {
      description:
        'Get a ready-to-paste usage snippet (import + template) for a component in a specific ' +
        'framework. Omit `framework` to get snippets for all four (html, react, vue, angular).',
      inputSchema: {
        component: componentEnum,
        framework: frameworkEnum.optional(),
      },
    },
    async ({ component, framework }) => {
      const comp = getComponent(component);
      if (!comp) return jsonError(`Component "${component}" not found.`);
      const frameworks = framework ? [framework] : FRAMEWORKS;
      return json({
        component: comp.tag,
        examples: frameworks.map(fw => buildUsage(comp, fw)),
      });
    },
  );

  server.registerTool(
    'get_install_info',
    {
      description:
        'Get install and registration instructions for a framework (which @andersseen/* package ' +
        'to add and how to wire it up). Omit `framework` to get all of them.',
      inputSchema: { framework: frameworkEnum.optional() },
    },
    async ({ framework }) => {
      const frameworks = framework ? [framework] : FRAMEWORKS;
      return json(
        frameworks.map(fw => ({
          framework: fw,
          label: FRAMEWORK_INFO[fw].label,
          package: FRAMEWORK_INFO[fw].pkg,
          steps: FRAMEWORK_INFO[fw].install,
        })),
      );
    },
  );

  server.registerTool(
    'get_theme_info',
    {
      description: 'Get available color palettes, style presets and dark-mode setup for And Web Components.',
    },
    async () => json(themeInfo),
  );

  server.registerTool(
    'get_project_info',
    {
      description: 'Get an overview of the And Web Components project: packages, docs, and naming conventions.',
    },
    async () => json(projectInfo),
  );

  // -- Resources ------------------------------------------------------------

  server.registerResource(
    'component',
    new ResourceTemplate('component://{tag}', {
      list: async () => ({
        resources: catalog.map(c => ({
          uri: `component://${c.tag}`,
          name: c.name,
          mimeType: 'application/json',
          description: c.description,
        })),
      }),
    }),
    { mimeType: 'application/json', description: 'Metadata for a single component.' },
    async uri => {
      const tag = uri.hostname;
      const comp = getComponent(tag);
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify(comp ?? { error: `Component "${tag}" not found.` }, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    'theme',
    'theme://info',
    { mimeType: 'application/json', description: 'Theme colors, styles and dark-mode setup.' },
    async uri => ({
      contents: [{ uri: uri.toString(), mimeType: 'application/json', text: JSON.stringify(themeInfo, null, 2) }],
    }),
  );

  server.registerResource(
    'project',
    'project://info',
    { mimeType: 'application/json', description: 'Project overview and package list.' },
    async uri => ({
      contents: [
        {
          uri: uri.toString(),
          mimeType: 'application/json',
          text: JSON.stringify(projectInfo, null, 2),
        },
      ],
    }),
  );

  // -- Prompts --------------------------------------------------------------

  server.registerPrompt(
    'generate-component',
    {
      description: 'Generate a correct, framework-specific usage example for a component.',
      argsSchema: {
        component: componentEnum,
        framework: frameworkEnum.optional(),
        context: z.string().optional().describe('Extra context about what the component should do.'),
      },
    },
    async ({ component, framework, context }) => {
      const comp = getComponent(component);
      const fw: Framework = framework ?? 'html';
      const example = comp ? buildUsage(comp, fw) : undefined;
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `You are helping a developer use the And Web Components library (${FRAMEWORK_INFO[fw].label}).`,
                '',
                `Generate a complete, production-ready example using the "${component}" component.`,
                '',
                'Component metadata (source of truth — do not invent attributes or events):',
                JSON.stringify(comp, null, 2),
                '',
                example ? `Import + starter snippet:\n${JSON.stringify(example, null, 2)}` : '',
                '',
                'Requirements:',
                `- Target framework: ${FRAMEWORK_INFO[fw].label} (${FRAMEWORK_INFO[fw].pkg}).`,
                '- Use only the attributes, events, slots and methods listed above.',
                `- Use the correct selector/name for this framework (${fw === 'react' ? comp?.name : comp?.tag}).`,
                '- Wire the primary event if one exists.',
                context ? `\nAdditional context: ${context}` : '',
              ]
                .filter(Boolean)
                .join('\n'),
            },
          },
        ],
      };
    },
  );

  server.registerPrompt(
    'troubleshooting',
    {
      description: 'Diagnose a common And Web Components problem.',
      argsSchema: { issue: z.string().describe('Description of the issue or error message.') },
    },
    async ({ issue }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'A developer is having an issue with And Web Components.',
              '',
              `Issue:\n${issue}`,
              '',
              'Diagnose step by step. Checklist:',
              '1. Registration — for plain HTML, were `defineAllCustomElements()` (from `@andersseen/web-components`) and `registerAllIcons()` (from `@andersseen/icon`) called at startup? For React/Vue/Angular, is the component imported from the matching `@andersseen/*-components` package?',
              '2. Selector/name — HTML/Vue/Angular use the `and-*` tag; React uses the `And*` component. Angular components are standalone and must be added to `imports`.',
              '3. Attributes/events — verify against the real metadata (call `get_component`); do not assume names.',
              '4. Styles — is `@andersseen/web-components/style.css` imported once?',
              '5. Theming — color via `and-color`, style preset via `and-theme`, dark mode via `and-mode` on `<html>`.',
              '',
              'If you need exact attributes or events, call the `get_component` tool before proposing a fix.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  return server;
}
