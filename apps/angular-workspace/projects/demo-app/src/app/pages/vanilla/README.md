# Vanilla Demo - Guía de Uso

## 🎯 Propósito

Esta sección está diseñada para probar y desarrollar componentes vanilla en
tiempo real. Los componentes vanilla son Web Components puros que:

- ✅ No usan runtime de Stencil
- ✅ Son ~83% más ligeros
- ✅ Usan APIs nativas del navegador
- ✅ Son 100% debuggeables

## 🚀 Cómo Usar

### 1. Acceder a la Demo

```
http://localhost:4200/#/vanilla
```

O navegar a través del menú: **Vanilla** en la barra de navegación superior.

### 2. Probar Componentes

La página incluye:

- **Variants**: Todas las variantes disponibles
- **Sizes**: Diferentes tamaños
- **States**: Estados (normal, disabled, loading)
- **Interactive Test**: Controles para modificar props en tiempo real
- **Code Example**: Código HTML generado dinámicamente

### 3. Ver Eventos

En la sección "Interactive Test":

1. Cambia las propiedades (variant, size, etc.)
2. Haz click en el botón
3. Verás el contador de clicks aumentar
4. El código se actualiza automáticamente

## 🛠️ Desarrollo

### Agregar un Nuevo Componente

#### Paso 1: Crear el Componente Vanilla

```bash
cd packages/vanilla-components

# Crear estructura
mkdir -p src/components/nuevo-componente
touch src/components/nuevo-componente/nuevo-componente.ts
```

#### Paso 2: Implementar el Componente

```typescript
// src/components/nuevo-componente/nuevo-componente.ts
import { Component, Prop } from '../../decorators';

@Component({
  tag: 'and-nuevo-componente',
  shadow: true,
  styles: `
    :host {
      display: block;
    }
    /* tus estilos */
  `,
})
export class AndNuevoComponente extends HTMLElement {
  @Prop() propiedad: string = 'default';

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadowRoot.innerHTML = `
      <div>${this.propiedad}</div>
    `;
  }
}
```

#### Paso 3: Exportar

```typescript
// src/index.ts
export { AndNuevoComponente } from './components/nuevo-componente/nuevo-componente';
```

#### Paso 4: Build

```bash
pnpm build
```

#### Paso 5: Agregar a la Demo

Editar:
`apps/angular-workspace/projects/demo-app/src/app/pages/vanilla/vanilla-demo.component.ts`

```typescript
// Agregar nueva sección
<app-demo-section title="Nuevo Componente" id="nuevo-componente">
  <app-demo-panel title="Ejemplo">
    <and-nuevo-componente propiedad="valor">
      Contenido
    </and-nuevo-componente>
  </app-demo-panel>
</app-demo-section>
```

#### Paso 6: Actualizar Navegación

Editar:
`apps/angular-workspace/projects/demo-app/src/app/layout/navigation.data.ts`

```typescript
export const VANILLA_ITEMS: SidebarItem[] = [
  { id: 'button', label: 'Button', icon: 'circle-dot' },
  { id: 'nuevo-componente', label: 'Nuevo Componente', icon: 'star' },
  { id: 'development', label: 'Development Guide', icon: 'code' },
];
```

### Flujo de Desarrollo Rápido

```bash
# Terminal 1: Vanilla components en modo watch
cd packages/vanilla-components
pnpm dev

# Terminal 2: Demo app
cd apps/angular-workspace
pnpm start

# Ahora los cambios se reflejan automáticamente!
```

## 📊 Comparativa en Vivo

La demo incluye una tabla comparativa:

| Característica | Stencil          | Vanilla       |
| -------------- | ---------------- | ------------- |
| Runtime        | ~50KB            | 0KB           |
| Bundle         | ~90KB            | ~15KB         |
| Build          | Stencil Compiler | Vite          |
| Debug          | Compilado        | Fuente exacta |

## 🐛 Debugging

### Inspeccionar Elementos

1. Abrir DevTools
2. Buscar el componente: `<and-button>`
3. Ver el Shadow DOM: `#shadow-root (open)`
4. El código es el original, no compilado!

### Ver Eventos

```javascript
// En consola
document
  .querySelector('and-button')
  .addEventListener('andButtonClick', console.log);
```

### Ver Props

```javascript
// Acceder a propiedades
document.querySelector('and-button').variant;
// "primary"
```

## 📝 Checklist para Nuevos Componentes

- [ ] Componente creado en `packages/vanilla-components/src/components/`
- [ ] Exportado en `packages/vanilla-components/src/index.ts`
- [ ] Build exitoso (`pnpm build`)
- [ ] Demo actualizada con ejemplo
- [ ] Navegación actualizada
- [ ] Props documentadas
- [ ] Eventos documentados
- [ ] Estados (disabled, loading) implementados
- [ ] Accesibilidad (ARIA) implementada
- [ ] Estilos con CSS Custom Properties

## 🎨 Estilos

### CSS Custom Properties (Variables)

Los componentes usan variables CSS para theming:

```css
and-button {
  --color-primary: #6366f1;
  --radius-md: 0.5rem;
}
```

### Shadow DOM Parts

```css
and-button::part(base) {
  text-transform: uppercase;
}
```

## 🆚 Diferencias Clave

### Stencil vs Vanilla

```html
<!-- Stencil: Mismo API -->
<and-button variant="primary">Click</and-button>

<!-- Vanilla: IDÉNTICO API -->
<and-button variant="primary">Click</and-button>
```

**La única diferencia**: Vanilla es ~83% más ligero!

## 🔗 Recursos

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements v1](https://developers.google.com/web/fundamentals/web-components/customelements)
- [Shadow DOM v1](https://developers.google.com/web/fundamentals/web-components/shadowdom)

---

**Nota**: Esta demo está optimizada para desarrollo. Los componentes se recargan
automáticamente cuando haces cambios en `packages/vanilla-components`.
