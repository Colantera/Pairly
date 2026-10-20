import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Plus, Trash2, Pencil, CheckCircle2, RotateCcw, Heart } from "lucide-react";

function Encontros({ encontros, setEncontros }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [encontroParaExcluir, setEncontroParaExcluir] = useState(null);

  const [notificacao, setNotificacao] = useState("");
  const [saindo, setSaindo] = useState(false);
  useEffect(() => {
    if (!notificacao) return;

    const iniciarSaida = setTimeout(() => {
      setSaindo(true);
    }, 3000);

    const removerNotificacao = setTimeout(() => {
      setNotificacao("");
      setSaindo(false);
    }, 3400);

    return () => {
      clearTimeout(iniciarSaida);
      clearTimeout(removerNotificacao);
    };
  }, [notificacao]);

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
      setNotificacao("Encontro editado com sucesso!");
    } else {
      // Cadastrar um encontro novo
      const encontro = {
        ...novoEncontro,
        id: crypto.randomUUID()
      };
      
      setEncontros((anteriores) => [...anteriores, encontro]);
      setNotificacao("Encontro cadastrado com sucesso!");
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
    setEncontroParaExcluir(id);
  }

  function confirmarExclusao() {
    if (encontroParaExcluir === null) return;

    setEncontros((anteriores) =>
      anteriores.filter(
        (encontro) => encontro.id !== encontroParaExcluir
      )
    );

    setEncontroParaExcluir(null);
    setNotificacao("Encontro excluído com sucesso!");
  }

  function cancelarExclusao() {
    setEncontroParaExcluir(null);
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

  const encontrosPendentes = encontros
    .filter((encontro) => !encontro.realizado)
    .sort((a, b) => a.data.localeCompare(b.data));

  const encontrosRealizados = encontros
    .filter((encontro) => encontro.realizado)
    .sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="pagina">
      {notificacao && (
        <div className={`notificacao ${saindo ? "saindo" : ""}`}>
          <CheckCircle2 size={20} />
          <span>{notificacao}</span>

          <button
            type="button"
            onClick={() => setNotificacao("")}
            aria-label="Fechar notificação"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      {encontroParaExcluir !== null && (
        <div className="modal-overlay" onClick={cancelarExclusao}>
          <div
            className="modal-exclusao"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-exclusao"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icone">
              <Trash2 size={26} />
            </div>

            <h3 id="titulo-exclusao">Excluir encontro?</h3>

            <p>
              Tem certeza que deseja excluir este encontro? Essa ação não poderá ser desfeita.
            </p>

            <div className="modal-botoes">
              <button
                type="button"
                className="modal-cancelar"
                onClick={cancelarExclusao}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="modal-confirmar"
                onClick={confirmarExclusao}
              >
                <Trash2 size={17} />
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}


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
        <section className="secao-encontros">
          <div className="secao-encontros-titulo">
            <Calendar size={22} />
            <h3>Próximos Encontros</h3>
            <span>{encontrosPendentes.length}</span>
          </div>

          <div className="lista-encontros">
            {encontrosPendentes.length === 0 ? (
              <div className="estado-vazio">
                <Calendar size={32} />
                <h4>Nenhum encontro pendente</h4>
                <p>Que tal planejarem o próximo momento juntos?</p>
              </div>
            ) : (
              encontrosPendentes.map((encontro) => (
                <div className="card card-encontro" key={encontro.id}>
                  <div className="encontro-titulo">
                    <h3>{encontro.nome}</h3>
                    <span className="status-encontro status-pendente">
                      Pendente
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
                      className="botao-concluir"
                      onClick={() => alternarConclusao(encontro.id)}
                    >
                      <CheckCircle2 size={18} />
                      Concluir
                    </button>

                    <button
                      className="botao-editar"
                      onClick={() => editarEncontro(encontro)}
                    >
                      <Pencil size={18} />
                      Editar
                    </button>

                    <button
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
        </section>

        {/* NOSSAS MEMÓRIAS */}
        <section className="secao-encontros">
          <div className="secao-encontros-titulo">
            <Heart size={22} />
            <h3>Nossas Memórias</h3>
            <span>{encontrosRealizados.length}</span>
          </div>

          <div className="lista-encontros">
            {encontrosRealizados.length === 0 ? (
              <div className="estado-vazio">
                <Heart size={32} />
                <h4>Nenhuma memória registrada</h4>
                <p>Os encontros realizados aparecerão aqui. 💗</p>
              </div>
            ) : (
              encontrosRealizados.map((encontro) => (
                <div
                  className="card card-encontro realizado"
                  key={encontro.id}
                >
                  <div className="encontro-titulo">
                    <h3>{encontro.nome}</h3>
                    <span className="status-encontro status-realizado">
                      Realizado
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
                      className="botao-concluir"
                      onClick={() => alternarConclusao(encontro.id)}
                    >
                      <RotateCcw size={18} />
                      Reabrir
                    </button>

                    <button
                      className="botao-editar"
                      onClick={() => editarEncontro(encontro)}
                    >
                      <Pencil size={18} />
                      Editar
                    </button>

                    <button
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
        </section>
      </div>
    </div>
  );
}

export default Encontros;
