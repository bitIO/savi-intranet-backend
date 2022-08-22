#!/bin/sh

DB="postgresql://test:test@localhost:5433/test"

DATABASE_URL="$DB?schema=auth" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=holiday" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=user" prisma migrate deploy > /dev/null
DATABASE_URL="$DB?schema=user-holidays" prisma migrate deploy > /dev/null