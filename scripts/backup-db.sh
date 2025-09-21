#!/bin/bash

# Database backup script for Sweet Shop Management System
# Supports both SQLite and PostgreSQL

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_TYPE="${DB_TYPE:-sqlite}"

echo "🗄️ Starting database backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

if [ "$DB_TYPE" = "postgres" ]; then
    echo "📊 Backing up PostgreSQL database..."
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL environment variable not set"
        exit 1
    fi
    
    # Extract database connection details
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
    
    # Create backup
    BACKUP_FILE="$BACKUP_DIR/sweetshop_backup_${TIMESTAMP}.sql"
    
    echo "Creating backup: $BACKUP_FILE"
    pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "✅ PostgreSQL backup created: ${BACKUP_FILE}.gz"
    
elif [ "$DB_TYPE" = "sqlite" ]; then
    echo "📊 Backing up SQLite database..."
    
    SQLITE_DB="./server/database.sqlite"
    if [ ! -f "$SQLITE_DB" ]; then
        echo "❌ SQLite database file not found: $SQLITE_DB"
        exit 1
    fi
    
    BACKUP_FILE="$BACKUP_DIR/sweetshop_backup_${TIMESTAMP}.sqlite"
    
    # Create backup using SQLite backup command
    sqlite3 "$SQLITE_DB" ".backup $BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "✅ SQLite backup created: ${BACKUP_FILE}.gz"
    
else
    echo "❌ Unsupported database type: $DB_TYPE"
    echo "Supported types: postgres, sqlite"
    exit 1
fi

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "sweetshop_backup_*.gz" -mtime +7 -delete
echo "✅ Old backups cleaned up"

# Show backup info
echo "📋 Backup Information:"
echo "   Type: $DB_TYPE"
echo "   Timestamp: $TIMESTAMP"
echo "   Location: $BACKUP_DIR"
echo "   Size: $(du -h "$BACKUP_DIR"/*"$TIMESTAMP"* | cut -f1)"

echo "🎉 Database backup completed successfully!"
