"""
A minimal MCP client, used only to test your server manually. This is
essentially what the Inspector does internally -- connect, list available
tools, call one, print the result.

Run this in a SEPARATE terminal from the one running the server (the
server must already be running via `python -m mcp_server.server` first).

Usage:
    python mcp_server/test_client.py
"""
import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

SERVER_URL = "http://127.0.0.1:8001/mcp"


async def main():
    async with streamablehttp_client(SERVER_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = await session.list_tools()
            print("Available tools:")
            for t in tools.tools:
                print(f"  - {t.name}: {t.description[:80]}...")

            print("\nCalling search_contracts...")
            result = await session.call_tool(
                "search_contracts", {"query": "payment terms"}
            )
            print(result.content[0].text)


if __name__ == "__main__":
    asyncio.run(main())