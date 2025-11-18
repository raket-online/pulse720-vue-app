#!/bin/bash

# Script to generate TypeScript types from Supabase database
# Usage: ./scripts/generate-types.sh [project-ref]

set -e

PROJECT_REF=${1:-""}

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Error: Supabase project reference is required"
  echo ""
  echo "Usage: ./scripts/generate-types.sh <project-ref>"
  echo ""
  echo "To find your project ref:"
  echo "1. Go to your Supabase project dashboard"
  echo "2. Look at the URL: https://supabase.com/dashboard/project/<project-ref>"
  echo "3. Copy the project-ref from the URL"
  echo ""
  echo "Example: ./scripts/generate-types.sh abcdefghijklmnop"
  exit 1
fi

echo "🔍 Generating TypeScript types from Supabase..."
echo "Project ref: $PROJECT_REF"
echo ""

# Check if npx supabase is available
if ! command -v npx &> /dev/null; then
  echo "❌ Error: npx is not installed"
  exit 1
fi

# Generate types
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/database.generated.ts

echo "✅ Types generated successfully!"
echo "📝 File: src/types/database.generated.ts"
echo ""
echo "Next steps:"
echo "1. Review the generated types"
echo "2. Update src/lib/supabase.ts to import from src/types/database.generated.ts"
echo "3. Remove the manually defined Database interface"
