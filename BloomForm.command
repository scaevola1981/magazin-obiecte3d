#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

echo "🚀 Pornesc BLOOMFORM..."

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Serverul este deja pornit."
else
    echo "⏳ Pornesc serverul de dezvoltare..."
    # Start npm run dev in a new Terminal window so you can see it running
    osascript -e 'tell application "Terminal" to do script "cd \"'"$(pwd)"'\" && npm run dev"'
    
    # Wait a few seconds for the server to initialize
    sleep 5
fi

# Open the browser or PWA
echo "🌐 Deschid aplicația..."
open "http://localhost:3000"

exit 0
