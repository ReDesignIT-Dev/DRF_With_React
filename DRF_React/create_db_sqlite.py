import sqlite3
import os
import locale


def create_database(db_name):
    db_path = os.path.join(os.getcwd(), db_name)
    try:
        if os.path.exists(db_path):
            print(f"Database '{db_name}' already exists.")
            return

        # Set the locale for text operations (adjust 'en_US.UTF-8' as needed)
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')

        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Create the users table
        cursor.execute('''CREATE TABLE users (
                            id INTEGER PRIMARY KEY,
                            username TEXT NOT NULL COLLATE NOCASE,
                            password TEXT NOT NULL
                        )''')
        print("Table 'users' created successfully.")

        # Optional: insert a test user for demonstration
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                       ("TestUser", "password123"))
        conn.commit()

        print(f"SQLite database '{db_name}' created successfully.")

    except sqlite3.Error as e:
        print("Error: ", e)
    finally:
        # Close the connection
        if conn:
            cursor.close()
            conn.close()


new_db_name = 'db.sqlite3'

create_database(new_db_name)
