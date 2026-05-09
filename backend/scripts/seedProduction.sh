#!/bin/bash

# Script to seed production database on Render.com
# This script should be run from the Render.com shell or locally with production credentials

echo "🌱 Seeding Production Database..."
echo ""
echo "⚠️  WARNING: This will clear all existing matches and settings!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

# Run the seed script
node scripts/seedDatabase.js

echo ""
echo "✅ Production database seeded successfully!"
echo ""
echo "🔍 Verify the data:"
echo "   curl https://fifa-2026-predictions-backend.onrender.com/api/matches"
echo "   curl https://fifa-2026-predictions-backend.onrender.com/api/settings"

# Made with Bob
