import React, { useEffect, useState } from "react";
import { fetchClients, addClient, deleteClient } from "./api";

/* ================= AGE GROUPS ================= */
const ageGroups = [
  { label: "0 – 9 years", min: 0, max: 9 },
  { label: "10–30 years", min: 10, max: 30 },
  { label: "31–60 years", min: 31, max: 60 },
  { label: "61–100 years", min: 61, max: 100 },
];

export default function App() {
  const [clients, setClients] = useState([]);
  const [openGender, setOpenGender] = useState(null);
  const [openAge, setOpenAge] = useState(null);
  const [showInsert, setShowInsert] = useState(false);

  const [form, setForm] = useState({
    f: "",
    l: "",
    phone: "",
    ssn: "",
    g: "Male",
    a: ""
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await fetchClients();
    setClients(data);
  };

  /* ================= FILTER ================= */
  const filtered = clients.filter(c => {
    if (!openGender) return false;
    if (!openAge) return c.g === openGender;
    return c.g === openGender && c.a >= openAge.min && c.a <= openAge.max;
  });

  const countAge = (g, ag) =>
    clients.filter(c => c.g === g && c.a >= ag.min && c.a <= ag.max).length;

  /* ================= INSERT ================= */
  const insertClient = async () => {
    if (!form.f || !form.l || !form.phone || !form.ssn || !form.a) return;

    await addClient({ ...form, a: Number(form.a) });
    setForm({ f: "", l: "", phone: "", ssn: "", g: "Male", a: "" });
    setShowInsert(false);
    loadClients();
  };

  /* ================= DELETE ================= */
  const removeClient = async (id) => {
    await deleteClient(id);
    loadClients();
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>Aspyr Anthros</h1>
      </div>

      <div style={layout}>
        {/* SIDEBAR */}
        <div style={sidebar}>
          <h3 style={sectionTitle}>Gender & Age Groups</h3>

          {["Male", "Female"].map(g => (
            <div key={g}>
              <div
                style={genderCard}
                onClick={() => {
                  setOpenGender(g);
                  setOpenAge(null);
                }}
              >
                <span>{g}</span>
                <span style={genderCount}>
                  {clients.filter(c => c.g === g).length}
                </span>
              </div>

              {openGender === g &&
                ageGroups.map(ag => (
                  <div
                    key={ag.label}
                    style={ageRow}
                    onClick={() => setOpenAge(ag)}
                  >
                    <span>{ag.label}</span>
                    <span style={ageCount}>{countAge(g, ag)}</span>
                  </div>
                ))}
            </div>
          ))}

          <button style={toggleBtn} onClick={() => setShowInsert(!showInsert)}>
            {showInsert ? "Cancel" : "Add Client"}
          </button>

          {showInsert && (
            <div style={formBox}>
              <select value={form.g} onChange={e => setForm({ ...form, g: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input placeholder="First Name" value={form.f} onChange={e => setForm({ ...form, f: e.target.value })} />
              <input placeholder="Last Name" value={form.l} onChange={e => setForm({ ...form, l: e.target.value })} />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input placeholder="SSN" value={form.ssn} onChange={e => setForm({ ...form, ssn: e.target.value })} />
              <input type="number" placeholder="Age" value={form.a} onChange={e => setForm({ ...form, a: e.target.value })} />
              <button style={insertBtn} onClick={insertClient}>Insert</button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div style={content}>
          <h2 style={contentTitle}>
            {openGender ? `${openGender}${openAge ? " - " + openAge.label : ""}` : "Select Gender"}
          </h2>

          <table style={table}>
            <thead style={thead}>
              <tr>
                <th>#</th>
                <th>First</th>
                <th>Last</th>
                <th>Phone</th>
                <th>SSN</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={row}>
                  <td>{i + 1}</td>
                  <td>{c.f}</td>
                  <td>{c.l}</td>
                  <td>{c.phone}</td>
                  <td>{c.ssn}</td>
                  <td>{c.a}</td>
                  <td>
                    <button style={deleteBtn} onClick={() => removeClient(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={noData}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  fontFamily: "Segoe UI",
  background: "#f3e5f5",
  minHeight: "100vh"
};

const header = {
  padding: 20,
  background: "#4a148c",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const title = {
  margin: 0,
  fontSize: 28,
  fontWeight: "bold"
};

const layout = {
  display: "grid",
  gridTemplateColumns: "320px 1fr"
};

const sidebar = {
  padding: 20,
  background: "#ede7f6",
  borderRight: "2px solid #d1c4e9"
};

const sectionTitle = {
  color: "#4a148c"
};

const genderCard = {
  padding: 12,
  marginBottom: 8,
  background: "#d1c4e9",
  borderRadius: 12,
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  color: "#4a148c",
  fontWeight: "600"
};

const genderCount = {
  background: "#6a1b9a",
  color: "white",
  padding: "2px 8px",
  borderRadius: 10
};

const ageRow = {
  marginLeft: 12,
  padding: 8,
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  color: "#4a148c"
};

const ageCount = {
  background: "#e1bee7",
  padding: "2px 8px",
  borderRadius: 8
};

const toggleBtn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  background: "#6a1b9a",
  color: "white",
  border: "none",
  borderRadius: 8
};

const formBox = {
  display: "grid",
  gap: 8,
  marginTop: 12
};

const insertBtn = {
  background: "#6a1b9a",
  color: "white",
  padding: 8,
  border: "none",
  borderRadius: 6
};

const content = {
  padding: 20
};

const contentTitle = {
  color: "#4a148c",
  marginBottom: 12
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

const thead = {
  background: "#6a1b9a",
  color: "white"
};

const row = {
  borderBottom: "1px solid #e1bee7"
};

const deleteBtn = {
  background: "#6a1b9a",
  color: "white",
  border: "none",
  padding: "4px 10px",
  borderRadius: 4
};

const noData = {
  textAlign: "center",
  padding: 20,
  color: "#4a148c"
};
