#!/bin/sh
set -e

# Wait for Postgres to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -c '\q'; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing command"

# Create User if not exists
PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -tc "SELECT 1 FROM pg_roles WHERE rolname = '$APP_USER'" | grep -q 1 || \
PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -c "CREATE USER $APP_USER WITH PASSWORD '$APP_PASSWORD';"

# Create Database if not exists
PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -tc "SELECT 1 FROM pg_database WHERE datname = '$APP_DB'" | grep -q 1 || \
PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -c "CREATE DATABASE $APP_DB OWNER $APP_USER;"

# Grant privileges
PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "postgres" -c "GRANT ALL PRIVILEGES ON DATABASE $APP_DB TO $APP_USER;"

echo "Database initialization completed"
