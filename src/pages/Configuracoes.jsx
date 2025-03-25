import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaSave,
  FaLock,
} from "react-icons/fa";
import "./Configuracoes.css";

const Configuracoes = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipo: "vendedor",
    ativo: true,
  });
  const [activeTab, setActiveTab] = useState("usuarios");

  // Carregar usuários iniciais
  useEffect(() => {
    // Dados de exemplo
    setUsuarios([
      {
        id: 1,
        nome: "Administrador",
        email: "admin@facilitaai.com",
        tipo: "admin",
        ativo: true,
        dataCriacao: "2023-05-10",
        ultimoLogin: "2023-06-23 14:30",
      },
      {
        id: 2,
        nome: "Vendedor Exemplo",
        email: "vendedor@facilitaai.com",
        tipo: "vendedor",
        ativo: true,
        dataCriacao: "2023-05-15",
        ultimoLogin: "2023-06-22 09:15",
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNovoUsuario = () => {
    setEditingUsuario(null);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      tipo: "vendedor",
      ativo: true,
    });
    setShowForm(true);
  };

  const handleEditUsuario = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      confirmarSenha: "",
      tipo: usuario.tipo,
      ativo: usuario.ativo,
    });
    setShowForm(true);
  };

  const handleDeleteUsuario = (usuarioId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsuarios(usuarios.filter((u) => u.id !== usuarioId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar senhas
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (editingUsuario) {
      // Atualizar usuário existente
      setUsuarios(
        usuarios.map((u) =>
          u.id === editingUsuario.id
            ? {
                ...u,
                nome: formData.nome,
                email: formData.email,
                tipo: formData.tipo,
                ativo: formData.ativo,
              }
            : u
        )
      );
    } else {
      // Adicionar novo usuário
      const novoUsuario = {
        id: Date.now(),
        nome: formData.nome,
        email: formData.email,
        tipo: formData.tipo,
        ativo: formData.ativo,
        dataCriacao: new Date().toISOString().split("T")[0],
        ultimoLogin: "",
      };
      setUsuarios([...usuarios, novoUsuario]);
    }

    setShowForm(false);
  };

  const formatarData = (dataString) => {
    if (!dataString) return "-";
    return dataString;
  };

  // Componente para a aba de usuários
  const TabUsuarios = () => (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Gerenciar Usuários</h2>
        <button className="btn-novo-usuario" onClick={handleNovoUsuario}>
          <FaUserPlus />
          Novo Usuário
        </button>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          className="search-input"
        />
      </div>

      <div className="usuarios-table">
        <div className="table-header">
          <div>Nome</div>
          <div>Email</div>
          <div>Função</div>
          <div>Status</div>
          <div>Data de Criação</div>
          <div>Último Login</div>
          <div>Ações</div>
        </div>

        {usuarios.length === 0 ? (
          <div className="empty-state">
            Nenhum usuário encontrado. Adicione um novo usuário clicando no
            botão acima.
          </div>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.id} className="table-row">
              <div>{usuario.nome}</div>
              <div>{usuario.email}</div>
              <div>
                <span className={`badge tipo-${usuario.tipo}`}>
                  {usuario.tipo === "admin" ? "Administrador" : "Vendedor"}
                </span>
              </div>
              <div>
                <span
                  className={`badge status-${
                    usuario.ativo ? "ativo" : "inativo"
                  }`}
                >
                  {usuario.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div>{formatarData(usuario.dataCriacao)}</div>
              <div>{formatarData(usuario.ultimoLogin) || "-"}</div>
              <div className="actions">
                <button
                  className="btn-edit"
                  title="Editar usuário"
                  onClick={() => handleEditUsuario(usuario)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  title="Excluir usuário"
                  onClick={() => handleDeleteUsuario(usuario.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Componente para a aba de permissões
  const TabPermissoes = () => (
    <div className="permissoes-container">
      <h2>Permissões do Sistema</h2>

      <div className="permissoes-info">
        <div className="role-container">
          <h3>Administrador</h3>
          <p>O administrador tem acesso completo ao sistema, incluindo:</p>
          <ul>
            <li>Gerenciar usuários e permissões</li>
            <li>Visualizar, adicionar, editar e remover todos os registros</li>
            <li>Acessar todas as funcionalidades e relatórios</li>
            <li>Configurar parâmetros do sistema</li>
          </ul>
        </div>

        <div className="role-container">
          <h3>Vendedor</h3>
          <p>O vendedor tem acesso limitado ao sistema:</p>
          <ul>
            <li>Visualizar e gerenciar Leads</li>
            <li>Criar e editar clientes (não pode excluir)</li>
            <li>Criar e gerenciar propostas</li>
            <li>Visualizar contratos relacionados aos seus clientes</li>
            <li>Visualizar agenda de compromissos</li>
            <li>Visualizar pagamentos relacionados às suas propostas</li>
          </ul>
        </div>
      </div>

      <div className="permission-matrix">
        <h3>Matriz de Permissões</h3>
        <table>
          <thead>
            <tr>
              <th>Recurso</th>
              <th>Administrador</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dashboard</td>
              <td>Total</td>
              <td>Limitado (apenas seus dados)</td>
            </tr>
            <tr>
              <td>Leads</td>
              <td>Total</td>
              <td>Criar, Editar, Visualizar</td>
            </tr>
            <tr>
              <td>Clientes</td>
              <td>Total</td>
              <td>Criar, Editar, Visualizar</td>
            </tr>
            <tr>
              <td>Propostas</td>
              <td>Total</td>
              <td>Criar, Editar, Visualizar</td>
            </tr>
            <tr>
              <td>Contratos</td>
              <td>Total</td>
              <td>Visualizar</td>
            </tr>
            <tr>
              <td>Pagamentos</td>
              <td>Total</td>
              <td>Visualizar</td>
            </tr>
            <tr>
              <td>Agenda</td>
              <td>Total</td>
              <td>Visualizar, Criar eventos</td>
            </tr>
            <tr>
              <td>Configurações</td>
              <td>Total</td>
              <td>Sem acesso</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="configuracoes-container">
      <h1>Configurações</h1>

      <div className="config-tabs">
        <button
          className={`tab-button ${activeTab === "usuarios" ? "active" : ""}`}
          onClick={() => setActiveTab("usuarios")}
        >
          <FaUser /> Usuários
        </button>
        <button
          className={`tab-button ${activeTab === "permissoes" ? "active" : ""}`}
          onClick={() => setActiveTab("permissoes")}
        >
          <FaLock /> Permissões
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "usuarios" ? <TabUsuarios /> : <TabPermissoes />}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUsuario ? "Editar Usuário" : "Novo Usuário"}</h2>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder={
                      editingUsuario
                        ? "Deixe em branco para manter a mesma"
                        : ""
                    }
                    {...(!editingUsuario ? { required: true } : {})}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarSenha">Confirmar Senha</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    placeholder={
                      editingUsuario
                        ? "Deixe em branco para manter a mesma"
                        : ""
                    }
                    {...(!editingUsuario ? { required: true } : {})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipo">Tipo de Usuário</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                  >
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                    />
                    Usuário Ativo
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  <FaSave /> {editingUsuario ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;
