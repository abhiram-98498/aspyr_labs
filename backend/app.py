from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Party Management Backend is running"}), 200


@app.route("/clients", methods=["GET"])
def get_clients():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, first_name, last_name, phone, ssn, gender, age
            FROM clients
            ORDER BY id
        """)

        rows = cur.fetchall()

        cur.close()
        conn.close()

        clients = []
        for r in rows:
            clients.append({
                "id": r["id"],
                "f": r["first_name"],
                "l": r["last_name"],
                "phone": r["phone"],
                "ssn": r["ssn"],
                "g": r["gender"],
                "a": r["age"]
            })

        return jsonify(clients), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/clients", methods=["POST"])
def add_client():
    try:
        data = request.get_json()

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO clients (first_name, last_name, phone, ssn, gender, age)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["f"],
            data["l"],
            data["phone"],
            data["ssn"],
            data["g"],
            data["a"]
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Client added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/clients/<int:client_id>", methods=["DELETE"])
def delete_client(client_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM clients WHERE id = %s", (client_id,))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "Client deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
