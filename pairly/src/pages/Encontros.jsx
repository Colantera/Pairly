
import { useState } from "react";
import { Calendar, MapPin, Clock, Plus } from "lucide-react";

function Encontros({ encontros, setEncontros }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

    const encontro = {
      ...novoEncontro,
      id: crypto.randomUUID()
    };

    setEncontros([...encontros, encontro]);

    setNovoEncontro({
      nome: "",
      data: "",
      horario: "",
      local: ""
    });

    setMostrarFormulario(false);
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
          <h3>Planejar encontro</h3>

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
            Salvar Encontro
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
            <div className="card" key={encontro.id}>
              <h3>{encontro.nome}</h3>

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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Encontros;
