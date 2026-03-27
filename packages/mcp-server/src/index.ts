// @ts-nocheck
// Este archivo usa tipos de Cloudflare Workers que se resuelven en tiempo de ejecución

import { handleListTools, handleCallTool, getServerInfo } from './server';

/**
 * Cloudflare Worker - MCP Server para @andersseen libraries
 *
 * Endpoints:
 * - GET /health - Health check
 * - GET /info - Información del servidor
 * - POST /mcp - Endpoint MCP principal
 */

export interface Env {
  // Variables de entorno si se necesitan
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Manejar preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Health check
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    // Información del servidor
    if (url.pathname === '/info' && request.method === 'GET') {
      return new Response(JSON.stringify(getServerInfo()), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Endpoint MCP principal
    if (url.pathname === '/mcp' && request.method === 'POST') {
      try {
        const body = (await request.json()) as any;

        // Validar que es una solicitud MCP válida
        if (!body.method) {
          return new Response(
            JSON.stringify({
              jsonrpc: '2.0',
              error: {
                code: -32600,
                message: 'Invalid Request: method is required',
              },
              id: body.id || null,
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            },
          );
        }

        let result: any;

        // Manejar métodos MCP
        switch (body.method) {
          case 'initialize':
            result = {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {},
              },
              serverInfo: {
                name: '@andersseen/mcp-server',
                version: '0.1.0',
              },
            };
            break;

          case 'tools/list':
            result = await handleListTools();
            break;

          case 'tools/call':
            if (!body.params?.name) {
              throw new Error('Tool name is required');
            }
            result = await handleCallTool(body.params.name, body.params.arguments || {});
            break;

          default:
            return new Response(
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  code: -32601,
                  message: 'Method not found: ' + body.method,
                },
                id: body.id || null,
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                  ...corsHeaders,
                },
              },
            );
        }

        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            result,
            id: body.id || null,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          },
        );
      } catch (error) {
        console.error('Error handling MCP request:', error);

        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: error instanceof Error ? error.message : 'Internal error',
            },
            id: null,
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          },
        );
      }
    }

    // Ruta no encontrada
    return new Response(
      JSON.stringify({
        error: 'Not Found',
        message: 'Endpoint not found. Available endpoints: /health, /info, /mcp',
        availableEndpoints: [
          { path: '/health', method: 'GET', description: 'Health check' },
          { path: '/info', method: 'GET', description: 'Server information' },
          { path: '/mcp', method: 'POST', description: 'MCP protocol endpoint' },
        ],
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  },
};
