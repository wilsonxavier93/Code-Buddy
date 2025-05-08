import React, { useState, useEffect } from "react";
import PetStatus from "./components/PetStatus";
import PetActions from "./components/PetActions";
import SessionModal from "./components/SessionModal";

// Estado inicial padrão do pet
const ESTADO_INICIAL_PET = {
  nome: "CodeBuddy",
  nivel: 1,
  experiencia: 0,
  experienciaParaProximoNivel: 100,
  saude: 80,
  energia: 90,
  felicidade: 70,
  ultimoLogin: null,
  linguagens: {
    python: 0,
    javascript: 0,
    html: 0,
    css: 0,
  },
  dias_seguidos: 0,
  emojiAvancado: null,
};

// Função para carregar o pet do localStorage
const carregarPetDoStorage = () => {
  try {
    const dadosSalvos = localStorage.getItem("petProgramador");
    if (!dadosSalvos) return ESTADO_INICIAL_PET;
    
    const dadosParseados = JSON.parse(dadosSalvos);
    
    // Verificações de segurança e migração de dados
    if (dadosParseados.linguagens?.emojiAvancado) {
      dadosParseados.emojiAvancado = dadosParseados.linguagens.emojiAvancado;
      delete dadosParseados.linguagens.emojiAvancado;
    }
    
    if (!dadosParseados.hasOwnProperty("emojiAvancado")) {
      dadosParseados.emojiAvancado = null;
    }
    
    // Calcula decaimentos baseados no último login
    if (dadosParseados.ultimoLogin) {
      const agora = new Date();
      const ultimoLogin = new Date(dadosParseados.ultimoLogin);
      const diffEmHoras = Math.floor((agora - ultimoLogin) / (1000 * 60 * 60));
      const decaimentos = Math.floor(diffEmHoras / 5);
      
      if (decaimentos > 0) {
        dadosParseados.saude = Math.max(0, dadosParseados.saude - decaimentos * 10);
        dadosParseados.energia = Math.max(0, dadosParseados.energia - decaimentos * 10);
        dadosParseados.felicidade = Math.max(0, dadosParseados.felicidade - decaimentos * 10);
      }
    }
    
    return dadosParseados;
  } catch (error) {
    console.error("Erro ao carregar dados do pet:", error);
    return ESTADO_INICIAL_PET;
  }
};

// Função para salvar o pet no localStorage
const salvarPetNoStorage = (petData) => {
  try {
    localStorage.setItem("petProgramador", JSON.stringify(petData));
    console.log("Pet salvo com sucesso no localStorage:", petData);
  } catch (error) {
    console.error("Erro ao salvar pet no localStorage:", error);
  }
};

function App() {
  // Inicializar o estado do pet com os dados do localStorage
  const [pet, setPet] = useState(() => carregarPetDoStorage());

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    linguagem: "python",
    tempo: 60,
    data: new Date().toISOString().split("T")[0],
  });

  // Verificar o localStorage ao montar o componente
  useEffect(() => {
    const petStorageAtual = localStorage.getItem("petProgramador");
    console.log("Carregando do localStorage:", petStorageAtual);
    
    // Se não existir dados no localStorage mas existir no estado, salve-os
    if (!petStorageAtual && pet) {
      console.log("Dados ausentes no localStorage. Salvando estado atual.");
      salvarPetNoStorage(pet);
    }
  }, []);
  
  // Salvar no localStorage sempre que o pet mudar
  useEffect(() => {
    console.log("Pet atualizado, salvando:", pet);
    salvarPetNoStorage(pet);
  }, [pet]);

  // Atualiza o emoji quando o nível chegar a 7
  useEffect(() => {
    if (pet.nivel >= 7 && pet.emojiAvancado === null) {
      const emojisAvancados = ["🦄", "🐉", "🚀", "🧙‍♂️"];
      const indice = Math.floor(Math.random() * emojisAvancados.length);
      const emojiEscolhido = emojisAvancados[indice];

      setPet((prevPet) => ({
        ...prevPet,
        emojiAvancado: emojiEscolhido,
      }));
    }
  }, [pet.nivel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "tempo" ? parseInt(value) : value,
    });
  };

  const registrarSessao = () => {
    const hoje = new Date().toISOString().split("T")[0];
    const ultimoLoginDate = pet.ultimoLogin ? new Date(pet.ultimoLogin) : null;
    let ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    ontem = ontem.toISOString().split("T")[0];

    let diasSeguidos = pet.dias_seguidos;
    if (!ultimoLoginDate) {
      diasSeguidos = 1;
    } else if (pet.ultimoLogin === ontem) {
      diasSeguidos += 1;
    } else if (pet.ultimoLogin !== hoje) {
      diasSeguidos = 1;
    }

    const novaExperiencia = pet.experiencia + formData.tempo * 0.5;
    let novoNivel = pet.nivel;
    let novaExpParaProximo = pet.experienciaParaProximoNivel;

    if (novaExperiencia >= pet.experienciaParaProximoNivel) {
      novoNivel += 1;
      novaExpParaProximo = pet.experienciaParaProximoNivel * 1.5;
    }

    const linguagens = { ...pet.linguagens };
    linguagens[formData.linguagem] = (linguagens[formData.linguagem] || 0) + formData.tempo;

    const novoPet = {
      ...pet,
      experiencia: novaExperiencia,
      nivel: novoNivel,
      experienciaParaProximoNivel: novaExpParaProximo,
      saude: Math.min(100, pet.saude + 5),
      energia: Math.max(20, pet.energia - 10),
      felicidade: Math.min(100, pet.felicidade + 10),
      ultimoLogin: hoje,
      linguagens,
      dias_seguidos: diasSeguidos,
      emojiAvancado: pet.emojiAvancado,
    };

    // Atualiza o estado
    setPet(novoPet);
    
    // Salva explicitamente no localStorage para garantir persistência
    salvarPetNoStorage(novoPet);
    
    console.log("Sessão registrada com sucesso:", novoPet);
    setShowModal(false);
  };

  const alimentarPet = () => {
    const petAtualizado = {
      ...pet,
      energia: Math.min(100, pet.energia + 20),
      saude: Math.min(100, pet.saude + 10),
    };
    setPet(petAtualizado);
    salvarPetNoStorage(petAtualizado); // Salva explicitamente
  };

  const brincarComPet = () => {
    const petAtualizado = {
      ...pet,
      felicidade: Math.min(100, pet.felicidade + 15),
      energia: Math.max(0, pet.energia - 5),
    };
    setPet(petAtualizado);
    salvarPetNoStorage(petAtualizado); // Salva explicitamente
  };

  const resetarPet = () => {
    if (window.confirm("Tem certeza que deseja resetar seu pet para o nível 1?")) {
      // Limpar localStorage completamente primeiro
      localStorage.removeItem("petProgramador");
      // Resetar para o estado inicial
      setPet({...ESTADO_INICIAL_PET});
      // Confirmar o reset no console
      console.log("Pet resetado para o estado inicial");
    }
  };

  return (
    <div className="container">
      <div className="pet-icon">
        {pet.nivel < 3 && "🥚"}
        {pet.nivel >= 3 && pet.nivel < 7 && "🦠"}
        {pet.nivel >= 7 && pet.emojiAvancado}
      </div>

      <h1 className="title">{pet.nome} - Nível {pet.nivel}</h1>

      <PetStatus pet={pet} />
      <PetActions alimentarPet={alimentarPet} brincarComPet={brincarComPet} setShowModal={setShowModal} />

      <div className="stats">
        <h2>Estatísticas de Programação</h2>
        <div className="languages">
          <div className="language-card">Python: {pet.linguagens.python} minutos</div>
          <div className="language-card">JavaScript: {pet.linguagens.javascript} minutos</div>
          <div className="language-card">HTML: {pet.linguagens.html} minutos</div>
          <div className="language-card">CSS: {pet.linguagens.css} minutos</div>
        </div>
      </div>

      <div className="footer">
        Dias seguidos programando: <strong>{pet.dias_seguidos}</strong><br />
        Último login: {pet.ultimoLogin || "Nunca"}
      </div>

      <div className="reset-container">
        <button className="reset-button" onClick={resetarPet}>Resetar Pet</button>
      </div>

      {showModal && (
        <SessionModal
          formData={formData}
          handleInputChange={handleInputChange}
          registrarSessao={registrarSessao}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default App;