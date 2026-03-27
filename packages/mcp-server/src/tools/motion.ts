/**
 * Motion Core Tools
 * Herramientas MCP para @andersseen/motion
 */

export const motionTools = [
  {
    name: 'motion_list_animations',
    description: 'Lista todas las animaciones disponibles',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'motion_generate_code',
    description: 'Genera código para una animación',
    inputSchema: {
      type: 'object' as const,
      properties: {
        animation: {
          type: 'string' as const,
          description: 'Nombre de la animación (ej: fade-in, slide-up)',
        },
        duration: {
          type: 'number' as const,
          description: 'Duración en ms (default: 300)',
        },
      },
      required: ['animation'],
    },
  },
];

const animations = [
  { name: 'fade-in', description: 'Fade in opacity', css: 'opacity: 0 to 1' },
  { name: 'fade-out', description: 'Fade out opacity', css: 'opacity: 1 to 0' },
  { name: 'slide-up', description: 'Slide from bottom', css: 'transform: translateY(20px) to translateY(0)' },
  { name: 'slide-down', description: 'Slide from top', css: 'transform: translateY(-20px) to translateY(0)' },
  { name: 'slide-left', description: 'Slide from right', css: 'transform: translateX(20px) to translateX(0)' },
  { name: 'slide-right', description: 'Slide from left', css: 'transform: translateX(-20px) to translateX(0)' },
  { name: 'scale-in', description: 'Scale up from 0.95', css: 'transform: scale(0.95) to scale(1)' },
  { name: 'scale-out', description: 'Scale down to 0.95', css: 'transform: scale(1) to scale(0.95)' },
  { name: 'spin', description: 'Rotate 360 degrees', css: 'transform: rotate(0deg) to rotate(360deg)' },
  { name: 'pulse', description: 'Pulse scale effect', css: 'scale oscillation' },
  { name: 'bounce', description: 'Bounce effect', css: 'translateY bounce' },
];

export function handleMotionTool(name: string, args: any): any {
  switch (name) {
    case 'motion_list_animations':
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(animations, null, 2),
          },
        ],
      };

    case 'motion_generate_code':
      const anim = animations.find(a => a.name === args.animation);
      if (!anim) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Animación "${args.animation}" no encontrada.`,
            },
          ],
        };
      }

      const duration = args.duration || 300;

      return {
        content: [
          {
            type: 'text' as const,
            text: `## Animación: ${anim.name}
${anim.description}

### Uso con atributos HTML
\`\`\`html
<div motion="${anim.name}" motion-duration="${duration}">
  Content
</div>
\`\`\`

### CSS personalizado
\`\`\`css
@keyframes ${anim.name.replace(/-/g, '_')} {
  from {
    ${anim.css.split(' to ')[0]}
  }
  to {
    ${anim.css.split(' to ')[1] || anim.css.split(' to ')[0]}
  }
}

.my-element {
  animation: ${anim.name.replace(/-/g, '_')} ${duration}ms ease-out forwards;
}
\`\`\`

### JavaScript
\`\`\`ts
import { animate } from '@andersseen/motion';

animate(element, '${anim.name}', {
  duration: ${duration},
  easing: 'ease-out'
});
\`\`\``,
          },
        ],
      };

    default:
      throw new Error(`Unknown motion tool: ${name}`);
  }
}
