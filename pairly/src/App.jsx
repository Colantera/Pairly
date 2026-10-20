import Encontros from "./pages/Encontros";

import { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  Wallet,
  Bookmark,
  Sparkles,
  Compass,
  Clock,
  MapPin
} from "lucide-react";

import "./App.css";

function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [encontros, setEncontros] = useState(() => {
  const dadosSalvos = localStorage.getItem("pairly_encontros");

  if (dadosSalvos) {
    try {
      return JSON.parse(dadosSalvos);
    } catch {
      return [];
    }
  }

  return [];
});

useEffect(() => {
  localStorage.setItem("pairly_encontros", JSON.stringify(encontros));
}, [encontros]);


const hoje = new Date();
const dataHoje = [
  hoje.getFullYear(),
  String(hoje.getMonth() + 1).padStart(2, "0"),
  String(hoje.getDate()).padStart(2, "0")
].join("-");

const encontrosFuturos = encontros
  .filter((encontro) => encontro.data >= dataHoje)
  .sort((a, b) => {
    const dataA = `${a.data}T${a.horario || "00:00"}`;
    const dataB = `${b.data}T${b.horario || "00:00"}`;

    return dataA.localeCompare(dataB);
  });

const proximoEncontro = encontrosFuturos[0];

const proximosPlanos = encontrosFuturos.slice(1, 4);


  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Heart size={22} fill="white" />
          </div>
          <h1>Pairly</h1>
        </div>

        <nav className="menu">
          <button
            className={`menu-item ${pagina === "dashboard" ? "active" : ""}`}
            onClick={() => setPagina("dashboard")}
          >
            <Sparkles size={20} />
            Dashboard
          </button>

          <button
            className={`menu-item ${pagina === "encontros" ? "active" : ""}`}
            onClick={() => setPagina("encontros")}
          >
            <Calendar size={20} />
            Nossos Encontros
          </button>

          <button
            className={`menu-item ${pagina === "lista" ? "active" : ""}`}
            onClick={() => setPagina("lista")}
          >
            <Bookmark size={20} />
            Nossa Lista
          </button>

          <button
            className={`menu-item ${pagina === "bolso" ? "active" : ""}`}
            onClick={() => setPagina("bolso")}
          >
            <Wallet size={20} />
            Nosso Bolso
          </button>

          <button
            className={`menu-item ${pagina === "descobrir" ? "active" : ""}`}
            onClick={() => setPagina("descobrir")}
          >
            <Compass size={20} />
            Descobrir
          </button>
        </nav>
      </aside>

      <main className="content">
        {pagina === "dashboard" && (
        <>
            <div className="welcome">
            <span>✨ Bem-vindos de volta</span>
            <h2>Olá, casal!</h2>
            <p>Prontos para criar novas memórias juntos?</p>
            </div>

            <div className="cards">

            <div className="card">
                <Calendar color="#F08BA5" />
                <h3>Próximo Encontro</h3>

                {proximoEncontro ? (
                <>
                    <h4 className="nome-encontro">
                    {proximoEncontro.nome}
                    </h4>

                    <p className="info-encontro">
                      <Calendar size={16} /> 
                      {proximoEncontro.data.split("-").reverse().join("/")}
                    </p>

                    <p className="info-encontro">
                    <Clock size={16} />
                    {proximoEncontro.horario || "Horário a definir"}
                    </p>
                    
                    <p className="info-encontro">
                      <MapPin size={16} />
                      {proximoEncontro.local || "Local a definir"}
                    </p>
                </>
                ) : (
                <p>Vocês ainda não têm encontros futuros agendados.</p>
                )}
            </div>

            <div className="card">
                <Wallet color="#F08BA5" />
                <h3>Nosso Bolso</h3>
                <p>Total gasto: R$ 0,00</p>
            </div>

            <div className="card">
                <Bookmark color="#F08BA5" />
                <h3>Nossa Lista</h3>
                <p>Seus filmes e lugares favoritos aparecerão aqui.</p>
            </div>

            </div>

            <div className="proximos-planos">
            <div className="secao-titulo">
                <h3>Próximos Planos 💗</h3>
                <p>Os próximos momentos de vocês.</p>
            </div>

            {proximosPlanos.length > 0 ? (
                <div className="planos-grid">
                {proximosPlanos.map((encontro) => (
                    <div className="plano-card" key={encontro.id}>
                    <div className="plano-icone">
                        <Calendar size={20} />
                    </div>

                    <h4>{encontro.nome}</h4>

                    <p className="info-encontro">
                        <Calendar size={16} /> 
                        {proximoEncontro.data.split("-").reverse().join("/")}
                    </p>

                    <p className="info-encontro">
                        <Clock size={16} />
                        {proximoEncontro.horario || "Horário a definir"}
                    </p>

                    <p className="info-encontro">
                          <MapPin size={16} />
                          {proximoEncontro.local || "Local a definir"}
                    </p>
                    </div>
                ))}
                </div>
            ) : (
                <div className="sem-planos">
                <p>
                    Nenhum outro encontro agendado por enquanto. 💕
                </p>
                </div>
            )}
            </div>
          </>
        )}

        
        {/* Página Nossos Encontros */}
        {pagina === "encontros" && (
          <Encontros
            encontros={encontros}
            setEncontros={setEncontros}
          />
        )}

        {/* Página Nossa Lista */}
        {pagina === "lista" && (
          <div className="pagina">
            <h2>Nossa Lista</h2>
            <p>Filmes, restaurantes e lugares para conhecer.</p>

            <div className="card">
              <Bookmark color="#F08BA5" />
              <h3>Sua lista está vazia</h3>
              <p>Em breve vocês poderão salvar suas ideias aqui.</p>
            </div>
          </div>
        )}

        {pagina === "bolso" && (
          <div className="pagina">
            <h2>Nosso Bolso</h2>
            <p>Organizem os gastos dos seus encontros.</p>

            <div className="card">
              <Wallet color="#F08BA5" />
              <h3>Total gasto</h3>
              <p>R$ 0,00</p>
            </div>
          </div>
        )}

        {pagina === "descobrir" && (
          <div className="pagina">
            <h2>Descobrir</h2>
            <p>Encontrem novos lugares para conhecer juntos.</p>

            <div className="card">
              <Compass color="#F08BA5" />
              <h3>Explorar lugares</h3>
              <p>Em breve vocês poderão descobrir restaurantes e passeios.</p>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default App;
