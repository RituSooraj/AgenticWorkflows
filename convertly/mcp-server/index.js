#!/usr/bin/env node
// Currency MCP server (SKELETON — build this live in class).
//
// Goal: expose a `get_exchange_rate` tool backed by the free Frankfurter
// API (https://frankfurter.dev) so Claude Code can pull LIVE rates instead
// of the stale numbers in data/rates.json. No API key required.

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

const server = new Server(
  { name: 'currency-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_exchange_rate',
      description: 'Get the current real-time exchange rate between two currencies',
      inputSchema: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Source currency code, e.g. USD' },
          to: { type: 'string', description: 'Target currency code, e.g. EUR' },
        },
        required: ['from', 'to'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'get_exchange_rate') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const { from, to } = request.params.arguments;

  // TODO (live in class):
  // 1. Build the URL:
  //    https://api.frankfurter.dev/v1/latest?base=<FROM>&symbols=<TO>
  // 2. fetch() it (Node 18+ has fetch built in, no dependency needed)
  // 3. Parse the JSON response and read data.rates[<TO>]
  // 4. Return it as tool content, e.g.:
  //    return { content: [{ type: 'text', text: `1 ${from} = ${rate} ${to}` }] };

  throw new Error('Not implemented yet — see the TODO above');
});

const transport = new StdioServerTransport();
server.connect(transport);
