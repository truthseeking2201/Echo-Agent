#!/bin/bash
# Find and replace ease-standard with curve-standard
sed -i '' 's/var(--ease-standard)/var(--curve-standard)/g' /Users/macbook/Downloads/Echo-Agent-echo-agent-demo\ 2/styles/globals.css
# Find and replace ease-spring with curve-spring
sed -i '' 's/var(--ease-spring)/var(--curve-spring)/g' /Users/macbook/Downloads/Echo-Agent-echo-agent-demo\ 2/styles/globals.css