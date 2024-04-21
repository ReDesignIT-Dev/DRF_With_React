import sqlite3
import os


def create_database(db_name):
    db_path = os.path.join(os.getcwd(), db_name)
    try:
        if os.path.exists(db_path):
            print("Database '{}' already exists.".format(db_name))
            return

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute('''CREATE TABLE users (
                            id INTEGER PRIMARY KEY,
                            username TEXT NOT NULL,
                            password TEXT NOT NULL
                        )''')
        print("Table 'users' created successfully.")

        print("SQLite database '{}' created successfully.".format(db_name))

    except sqlite3.Error as e:
        print("Error: ", e)
    finally:
        if conn is not None:
            cursor.close()
            conn.close()


new_db_name = 'db.sqlite3'

create_database(new_db_name)
