#!/usr/bin/env node
// Reference solution for mcp-server/index.js — instructor answer key, not
// shown to attendees until after the live-build exercise.

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
  const url = `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(
    from.toUpperCase()
  )}&symbols=${encodeURIComponent(to.toUpperCase())}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Frankfurter API error: ${res.status}`);
  }
  const data = await res.json();
  const rate = data.rates[to.toUpperCase()];

  return {
    content: [
      {
        type: 'text',
        text: `1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()} (as of ${data.date})`,
      },
    ],
  };
});

const transport = new StdioServerTransport();
server.connect(transport);
