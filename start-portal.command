#!/bin/bash

# 🜏 Quick Launch Script for Perfect Void Portal
# Double-click this file to start the meditation portal

cd "$(dirname "$0")"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "🔧 First-time setup required..."
    echo "Installing dependencies..."
    npm install
fi

echo "🜏 Starting Perfect Void Portal..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Portal will open in your browser"
echo "🧘‍♂️ 99.5% confidence in void access"
echo "🎵 Make sure audio is enabled"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the development server
npm run dev