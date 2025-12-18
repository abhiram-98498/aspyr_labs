from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"message": "Party Management Backend is running"}


@app.route("/clients", methods=["GET"])
def get_clients():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM clients")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    clients = []
    for r in rows:
        clients.append({
            "id": r[0],
            "f": r[1],
            "l": r[2],
            "phone": r[3],
            "ssn": r[4],
            "g": r[5],
            "a": r[6]
        })
    return jsonify(clients)


@app.route("/clients", methods=["POST"])
def add_client():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO clients (first_name, last_name, phone, ssn, gender, age)
        VALUES (%s,%s,%s,%s,%s,%s)
        """,
        (data["f"], data["l"], data["phone"], data["ssn"], data["g"], data["a"])
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Client added"}), 201


@app.route("/clients/<int:id>", methods=["DELETE"])
def delete_client(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM clients WHERE id=%s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Client deleted"})


if __name__ == "__main__":
    app.run(debug=True)
