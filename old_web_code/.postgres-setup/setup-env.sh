#!/bin/bash
echo "DATABASE_URL=postgres://lec_eval_user:password123@localhost:5432/lec_eval_portal" > /workspaces/lec-eval-portal/.env
echo "NODE_ENV=development" >> /workspaces/lec-eval-portal/.env
