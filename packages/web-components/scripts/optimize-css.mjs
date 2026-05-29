#!/usr/bin/env node
/**
 * Script para optimizar CSS en componentes Stencil:
 * 1. Reemplaza global.css por component-base.css (sin reset de Tailwind)
 * 2. A los componentes con animaciones, añade animations.css
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const COMPONENTS_DIR = './src/components';

// Componentes que usan animaciones (importan applyGlobalAnimationFlag)
const ANIMATED_COMPONENTS = new Set([
  'and-tooltip',
  'and-toast',
  'and-sidebar',
  'and-modal',
  'and-dropdown',
  'and-drawer',
  'and-accordion',
  'and-accordion-trigger',
  'and-accordion-content',
  'and-tabs',
  'and-tabs-content',
]);

function processDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (entry.endsWith('.tsx')) {
      let content = readFileSync(fullPath, 'utf-8');
      const original = content;

      // Detectar si este componente usa animaciones
      const componentName = entry.replace('.tsx', '');
      const isAnimated = ANIMATED_COMPONENTS.has(componentName);

      // Reemplazar styleUrls array
      if (content.includes("styleUrls: ['../../global/global.css']")) {
        // Componente sin CSS propio
        if (isAnimated) {
          content = content.replace(
            "styleUrls: ['../../global/global.css']",
            "styleUrls: ['../../global/component-base.css', '../../global/animations.css']",
          );
        } else {
          content = content.replace(
            "styleUrls: ['../../global/global.css']",
            "styleUrl: '../../global/component-base.css'",
          );
        }
      } else if (content.includes("styleUrl: '../../global/global.css'")) {
        // Single string styleUrl
        if (isAnimated) {
          content = content.replace(
            "styleUrl: '../../global/global.css'",
            "styleUrls: ['../../global/component-base.css', '../../global/animations.css']",
          );
        } else {
          content = content.replace(
            "styleUrl: '../../global/global.css'",
            "styleUrl: '../../global/component-base.css'",
          );
        }
      } else {
        // Componente con CSS propio + global.css
        // Buscar patrones como: styleUrls: ['and-button.css', '../../global/global.css']
        const regex = /styleUrls:\s*\[(.+?)\]/;
        const match = content.match(regex);
        if (match) {
          const originalArray = match[1];
          if (originalArray.includes('../../global/global.css')) {
            // Extraer el CSS propio del componente
            const parts = originalArray.split(',').map(p => p.trim());
            const ownCss = parts.filter(p => !p.includes('../../global/global.css'));

            let newArray;
            if (isAnimated) {
              newArray = [...ownCss, "'../../global/component-base.css'", "'../../global/animations.css'"];
            } else {
              newArray = [...ownCss, "'../../global/component-base.css'"];
            }

            content = content.replace(match[0], `styleUrls: [${newArray.join(', ')}]`);
          }
        }
      }

      if (content !== original) {
        writeFileSync(fullPath, content, 'utf-8');
        console.log(`✅ ${componentName}: ${isAnimated ? '+animations' : 'base only'}`);
      }
    }
  }
}

processDir(COMPONENTS_DIR);
console.log('\nDone! Component CSS optimized.');
