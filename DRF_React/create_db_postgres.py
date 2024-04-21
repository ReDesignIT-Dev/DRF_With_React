""" Script to create table on postgres as well as the user. Requires minimal settings for postgres """
import psycopg2
from psycopg2 import sql
from os import getenv
from dotenv import load_dotenv

load_dotenv()


def create_database(db_name, username, password):
    try:
        # Connect to the default PostgreSQL database (e.g., 'postgres')
        conn = psycopg2.connect(
            dbname="postgres",
            user=getenv('ADMIN_POSTGRESQL'),
            password=getenv('ADMIN_POSTGRESQL_PASSWORD'),
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cursor = conn.cursor()

        # Create a new database
        cursor.execute(sql.SQL("CREATE DATABASE {} ENCODING 'UTF8'").format(
            sql.Identifier(db_name)
        ))
        print("Database '{}' created successfully.".format(db_name))

        # Create a new user and grant privileges
        cursor.execute(sql.SQL("CREATE USER {} WITH PASSWORD %s").format(
            sql.Identifier(username)
        ), (password,))
        print("User '{}' created successfully.".format(username))

        # Set client encoding, default transaction isolation, and timezone for the user
        cursor.execute(sql.SQL("ALTER ROLE {} SET client_encoding TO 'utf8'").format(
            sql.Identifier(username)
        ))
        cursor.execute(sql.SQL("ALTER ROLE {} SET default_transaction_isolation TO 'read committed'").format(
            sql.Identifier(username)
        ))
        cursor.execute(sql.SQL("ALTER ROLE {} SET timezone TO 'UTC'").format(
            sql.Identifier(username)
        ))
        print("Client encoding, default transaction isolation, and timezone set for user '{}'.".format(username))

        cursor.execute(sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
            sql.Identifier(db_name),
            sql.Identifier(username)
        ))
        print("Privileges granted to user '{}' on database '{}'.".format(username, db_name))

        cursor.execute(sql.SQL("ALTER DATABASE {} OWNER TO {}").format(
            sql.Identifier(db_name),
            sql.Identifier(username)
        ))
        print("Ownership to the db '{}' given to '{}'.".format(db_name, username))

    except psycopg2.Error as e:
        print("Error: ", e)
    finally:
        # Close communication with the PostgreSQL database server
        if conn is not None:
            cursor.close()
            conn.close()


db_name = getenv('DJANGO_DB')
username = getenv('DJANGO_DB_USER')
password = getenv('DJANGO_DB_PASSWORD')

project_name = 'DRF_React'

db_dev_test_name = 'localtestdb_' + project_name
db_dev_test_username = 'testuser_' + project_name
db_dev_test_password = 'TestPassword_' + project_name

# create_database(db_name, username, password)  # comment out if need just dev db
create_database(db_dev_test_name, db_dev_test_username, db_dev_test_password)  # comment out if need prod db
