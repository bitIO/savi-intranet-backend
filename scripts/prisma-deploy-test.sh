#!/bin/sh

DB="postgresql://test:test@localhost:5433/test"

# E2E
DATABASE_URL="$DB?schema=auth" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=holiday" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=user" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=user-holidays" prisma migrate deploy > /dev/null

# ACCEPTANCE
DATABASE_URL="$DB?schema=acceptance-user" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=acceptance-approve" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=acceptance-admin" prisma migrate deploy > /dev/null