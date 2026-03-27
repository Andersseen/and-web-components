# @andersseen/mcp-server

Servidor MCP (Model Context Protocol) para las librerías de @andersseen. Permite
que agentes de IA (Claude, GPT, Cursor, etc.) accedan a información sobre tus
componentes web, headless components, iconos, animaciones y layouts.

## 🚀 Deploy en Cloudflare Workers (Gratis)

### 1. Instalar dependencias

```bash
cd packages/mcp-server
npm install
```

### 2. Login en Cloudflare

```bash
npx wrangler login
```

### 3. Deploy

```bash
npm run deploy
```

Obtendrás una URL como:

```
https://andersseen-mcp.tu-usuario.workers.dev
```

## 📡 Endpoints

### Health Check

```bash
curl https://andersseen-mcp.tu-usuario.workers.dev/health
```

### Información del Servidor

```bash
curl https://andersseen-mcp.tu-usuario.workers.dev/info
```

### MCP Protocol

```bash
curl -X POST https://andersseen-mcp.tu-usuario.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

## 🛠️ Herramientas Disponibles

### Headless Components

- `headless_list_components` - Lista todos los componentes headless
- `headless_get_component` - Obtiene información de un componente
- `headless_generate_code` - Genera código de uso

### Web Components

- `webcomponents_list` - Lista todos los componentes web
- `webcomponents_get_info` - Obtiene información de un componente
- `webcomponents_generate_html` - Genera código HTML
- `webcomponents_installation_guide` - Guía de instalación

### Icon Library

- `icon_list` - Lista todos los iconos
- `icon_search` - Busca iconos
- `icon_get_usage` - Obtiene código de uso

### Motion

- `motion_list_animations` - Lista animaciones disponibles
- `motion_generate_code` - Genera código de animación

### Layout

- `layout_list_patterns` - Lista patrones de layout
- `layout_generate_code` - Genera código CSS/HTML

## 🔌 Configuración en Agentes de IA

### Claude Desktop

Edita `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "andersseen": {
      "url": "https://andersseen-mcp.tu-usuario.workers.dev/mcp"
    }
  }
}
```

### Cursor

Crea `.cursor/mcp.json` en tu proyecto:

```json
{
  "mcpServers": {
    "andersseen": {
      "url": "https://andersseen-mcp.tu-usuario.workers.dev/mcp"
    }
  }
}
```

### VS Code (con extensión MCP)

```json
{
  "mcp.servers": {
    "andersseen": {
      "url": "https://andersseen-mcp.tu-usuario.workers.dev/mcp"
    }
  }
}
```

## 💡 Ejemplos de Uso

Una vez configurado, los agentes de IA pueden:

```
Usuario: "Necesito un botón con icono"

Agente: Llama a webcomponents_list() → Encuentra and-button
        Llama a icon_search("button") → Encuentra iconos relacionados
        Llama a webcomponents_generate_html("and-button", {...})

        Responde con el código completo:
        <and-button variant="primary">
          <and-icon name="check" size="16"></and-icon>
          Confirmar
        </and-button>
```

```
Usuario: "Cómo uso el componente modal?"

Agente: Llama a headless_get_component("modal")
        Obtiene: descripción, props, métodos, state

        Responde con documentación y ejemplo de código
```

## 🏗️ Desarrollo Local

```bash
# Modo desarrollo con hot reload
npm run dev

# El worker estará en http://localhost:8787
```

## 📦 Estructura del Proyecto

```
packages/mcp-server/
├── src/
│   ├── index.ts              # Entry point del Worker
│   ├── server.ts             # Lógica del servidor MCP
│   └── tools/
│       ├── headless.ts       # Tools para headless-components
│       ├── webcomponents.ts  # Tools para web-components
│       ├── icons.ts          # Tools para icon-library
│       ├── motion.ts         # Tools para motion-core
│       └── layout.ts         # Tools para layout-core
├── wrangler.toml             # Configuración de Cloudflare
├── tsconfig.json             # Configuración TypeScript
└── package.json
```

## 🔒 Límites de Cloudflare Workers (Gratis)

- 100,000 requests/día
- 10ms CPU time por request
- 128MB memory
- Perfecto para un MCP server!

## 📄 Licencia

MIT
