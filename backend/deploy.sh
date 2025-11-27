#!/bin/bash

# Kramik Backend Deployment Script for Render
# This script helps redeploy the backend with updated CORS settings

echo "🚀 Kramik Backend Redeployment Script"
echo "====================================="

# Check if we're in the backend directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Make sure to set environment variables in Render dashboard:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - NODE_ENV=production"
    echo "   - GROQ_API_KEY (optional)"
    echo "   - GEMINI_API_KEY"
    echo "   - CLOUDINARY_CLOUD_NAME"
    echo "   - CLOUDINARY_API_KEY"
    echo "   - CLOUDINARY_API_SECRET"
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "📋 Next Steps for Render Deployment:"
echo "1. Go to https://dashboard.render.com"
echo "2. Select your Kramik backend service"
echo "3. Go to Settings > Environment"
echo "4. Update/add these environment variables:"
echo "   - NODE_ENV=production"
echo "   - MONGODB_URI=your_mongodb_atlas_connection_string"
echo "   - JWT_SECRET=your_secure_jwt_secret"
echo "   - GEMINI_API_KEY=your_gemini_api_key"
echo "   - CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name"
echo "   - CLOUDINARY_API_KEY=your_cloudinary_api_key"
echo "   - CLOUDINARY_API_SECRET=your_cloudinary_api_secret"
echo "5. Go to Manual Deploy > Deploy latest commit"
echo ""
echo "🔄 After deployment, test the API:"
echo "curl https://kramik-ai-blockchain-project.onrender.com/health"
echo ""
echo "🎉 Deployment script completed!"