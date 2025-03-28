import React, { useState, useEffect } from "react";
import { FaUser, FaUserPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "admin",
    status: "active",
  });

  useEffect(() => {
    // Carregar usuários do localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  const saveUsers = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setNewUser({
      id: Date.now(),
      name: "",
      email: "",
      role: "admin",
      status: "active",
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setNewUser({ ...user });
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      saveUsers(updatedUsers);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSaveUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Nome e email são obrigatórios!");
      return;
    }

    if (showAddModal) {
      // Adicionar novo usuário
      saveUsers([...users, newUser]);
    } else {
      // Atualizar usuário existente
      const updatedUsers = users.map((user) =>
        user.id === newUser.id ? newUser : user
      );
      saveUsers(updatedUsers);
    }

    // Fechar modais
    setShowAddModal(false);
    setShowEditModal(false);
  };

  return (
    <div className="admin-container">
      <h1 className="page-title">Administração do Sistema</h1>

      <div className="admin-actions">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <FaUserPlus /> Adicionar Usuário
        </button>
      </div>

      <div className="card">
        <h2>Usuários do Sistema</h2>

        {filteredUsers.length === 0 ? (
          <p className="no-data">Nenhum usuário encontrado.</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === "admin" ? "Administrador" : "Usuário"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                        title="Editar usuário"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Excluir usuário"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar usuário */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{showAddModal ? "Adicionar Usuário" : "Editar Usuário"}</h2>
            <form>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Função</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="admin">Administrador</option>
                  <option value="user">Usuário</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newUser.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveUser}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
