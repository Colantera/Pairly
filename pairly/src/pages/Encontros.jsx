
import { useState } from "react";
import { Calendar, MapPin, Clock, Plus, Trash2, Pencil, CheckCircle2, RotateCcw } from "lucide-react";

function Encontros({ encontros, setEncontros }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [novoEncontro, setNovoEncontro] = useState({
    nome: "",
    data: "",
    horario: "",
    local: ""
  });

  function adicionarEncontro(evento) {
    evento.preventDefault();

    if (!novoEncontro.nome || !novoEncontro.data) {
      return;
    }

    if (idEditando !== null) {
      // Atualizar um encontro existente
      setEncontros((anteriores) =>
        anteriores.map((encontro) =>
          encontro.id === idEditando
            ? { ...encontro, ...novoEncontro }
            : encontro
        )
      );
    } else {
      // Cadastrar um encontro novo
      const encontro = {
        ...novoEncontro,
        id: crypto.randomUUID()
      };

      setEncontros((anteriores) => [...anteriores, encontro]);
    }

    // Limpar o formulário
    setNovoEncontro({
      nome: "",
      data: "",
      horario: "",
      local: ""
    });

    setIdEditando(null);
    setMostrarFormulario(false);
  }

  function excluirEncontro(id) {
    const confimar = window.confirm("Tem certeza de que deseja excluir este encontro?");

    if (confimar) {
      setEncontros((anterioes) =>
        anterioes.filter((encontro) => encontro.id !== id)
      );
    }
  }

  function editarEncontro(encontro) {
    setNovoEncontro({
      nome: encontro.nome,
      data: encontro.data,
      horario: encontro.horario,
      local: encontro.local
    });

    setIdEditando(encontro.id);
    setMostrarFormulario(true);
  }

  function alternarConclusao(id) {
    setEncontros((anteriores) =>
      anteriores.map((encontro) =>
        encontro.id === id
          ? { ...encontro, realizado: !encontro.realizado }
          : encontro
      )
    );
  }

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <div>
          <h2>Nossos Encontros</h2>
          <p>Planejem seus próximos momentos juntos.</p>
        </div>

        <button
          className="botao-principal"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <Plus size={18} />
          Novo Encontro
        </button>
      </div>

      {mostrarFormulario && (
        <form className="formulario" onSubmit={adicionarEncontro}>
          <h3>{idEditando !== null ? "Editar encontro" : "Planejar encontro"}</h3>

          <input
            type="text"
            placeholder="Nome do encontro"
            value={novoEncontro.nome}
            onChange={(e) =>
              setNovoEncontro({ ...novoEncontro, nome: e.target.value })
            }
            required
          />

          <input
            type="date"
            value={novoEncontro.data}
            onChange={(e) =>
              setNovoEncontro({ ...novoEncontro, data: e.target.value })
            }
            required
          />

          <input
            type="time"
            value={novoEncontro.horario}
            onChange={(e) =>
              setNovoEncontro({ ...novoEncontro, horario: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Local do encontro"
            value={novoEncontro.local}
            onChange={(e) =>
              setNovoEncontro({ ...novoEncontro, local: e.target.value })
            }
          />

          <button className="botao-principal" type="submit">
            {idEditando !== null ? "Salvar Alterações" : "Salvar Encontro"}
          </button>
        </form>
      )}

      <div className="lista-encontros">
        {encontros.length === 0 ? (
          <div className="card">
            <Calendar color="#F08BA5" />
            <h3>Nenhum encontro agendado</h3>
            <p>Clique em Novo Encontro para começar.</p>
          </div>
        ) : (
          encontros.map((encontro) => (
            <div
              className={`card card-encontro ${encontro.realizado ? "realizado" : ""}`}
              key={encontro.id}
            >
              <div className="encontro-titulo">
                <h3>{encontro.nome}</h3>

                <span
                  className={`status-encontro ${
                    encontro.realizado ? "status-realizado" : "status-pendente"
                  }`}
                >
                  {encontro.realizado ? "Realizado" : "Pendente"}
                </span>
              </div>

              <p>
                <Calendar size={16} />
                {encontro.data.split("-").reverse().join("/")}
              </p>

              <p>
                <Clock size={16} />
                {encontro.horario || "Horário a definir"}
              </p>

              <p>
                <MapPin size={16} />
                {encontro.local || "Local a definir"}
              </p>

              <div className="acoes-encontro">
                <button
                  type="button"
                  className="botao-concluir"
                  onClick={() => alternarConclusao(encontro.id)}
                >
                  {encontro.realizado ? (
                    <>
                      <RotateCcw size={18} />
                      Reabrir
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Concluir
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="botao-editar"
                  onClick={() => editarEncontro(encontro)}
                >
                  <Pencil size={18} />
                  Editar
                </button>

                <button
                  type="button"
                  className="botao-excluir"
                  onClick={() => excluirEncontro(encontro.id)}
                >
                  <Trash2 size={18} />
                  Excluir
                </button>
              </div>

              
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Encontros;
