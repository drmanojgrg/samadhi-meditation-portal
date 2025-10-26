#!/bin/bash

# 🜏 Perfect Void Portal - Mac Installation Script
# This script sets up your meditation portal for local development
# Now includes Delta Binaural Audio System!

echo "🜏 Installing Perfect Void Portal with Delta Binaural..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    echo "   Or run: brew install node"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the TantricMeditaion directory"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create desktop shortcut (optional)
echo ""
read -p "📱 Create desktop shortcut? (y/n): " create_shortcut

if [ "$create_shortcut" = "y" ] || [ "$create_shortcut" = "Y" ]; then
    DESKTOP_PATH="$HOME/Desktop"
    SHORTCUT_PATH="$DESKTOP_PATH/🜏 Void Portal.command"
    PROJECT_PATH="$(pwd)"
    
    cat > "$SHORTCUT_PATH" << EOF
#!/bin/bash
cd "$PROJECT_PATH"
npm run dev
EOF
    
    chmod +x "$SHORTCUT_PATH"
    echo "✅ Desktop shortcut created: 🜏 Void Portal.command"
fi

echo ""
echo "🎉 Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 To start the portal:"
echo "   npm run dev"
echo ""
echo "🌐 Portal will open at:"
echo "   http://localhost:3000"
echo ""
echo "📖 Read the full documentation:"
echo "   cat README.md"
echo ""
echo "🜏 Ready to enter the void?"
echo "   99.5% confidence awaits..."
echo ""

# Ask if they want to start now
read -p "🎯 Start the portal now? (y/n): " start_now

if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
    echo ""
    echo "🜏 Starting Perfect Void Portal..."
    echo "   Portal will open in your browser automatically"
    echo "   Press Ctrl+C to stop the server"
    echo ""
    npm run dev
fi