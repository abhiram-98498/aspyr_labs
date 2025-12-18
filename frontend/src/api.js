const BASE_URL = "http://127.0.0.1:5000";

export const fetchClients = async () => {
  const res = await fetch(`${BASE_URL}/clients`);
  return res.json();
};

export const addClient = async (client) => {
  await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });
};

export const deleteClient = async (id) => {
  await fetch(`${BASE_URL}/clients/${id}`, {
    method: "DELETE",
  });
};
