#!/bin/bash

# Make PostgreSQL accept connections without password
sudo sed -i 's/peer/trust/g' /etc/postgresql/12/main/pg_hba.conf
sudo sed -i 's/md5/trust/g' /etc/postgresql/12/main/pg_hba.conf

bash ~/.postgres-setup/setup-env.sh

# Restart PostgreSQL
sudo /etc/init.d/postgresql restart

# Create database if it doesn't exist
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw lec_eval_portal; then
    psql -U postgres -c "CREATE DATABASE lec_eval_portal;"
    psql -U postgres -c "CREATE USER lec_eval_user WITH PASSWORD 'password123';"
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE lec_eval_portal TO lec_eval_user;"
fi

# Re-enable password for application
echo "host lec_eval_portal lec_eval_user 127.0.0.1/32 md5" | sudo tee -a /etc/postgresql/12/main/pg_hba.conf
sudo /etc/init.d/postgresql restart
