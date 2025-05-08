import React, { useState, useEffect } from 'react';
import PetStatus from './components/PetStatus';
import PetActions from './components/PetActions';
import SessionModal from './components/SessionModal';

function App() {
  const [pet, setPet] = useState({
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
      emojiAvancado: null
    },
    dias_seguidos: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    linguagem: "python",
    tempo: 60,
    data: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('petProgramador');
    if (dadosSalvos) {
      const dadosParseados = JSON.parse(dadosSalvos);
      // Se não tem emojiAvancado salvo, adiciona null
      if (!dadosParseados.hasOwnProperty('emojiAvancado')) {
        dadosParseados.emojiAvancado = null;
      }
      setPet(dadosParseados);
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('petProgramador', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    if (pet.nivel >= 7 && pet.emojiAvancado === null) {
      const emojisAvancados = ["🦄", "🐉", "🐥", "🦁", "🐯", "🦒", "🐶", "🐇", "🦕", "🦈", "🐳", "🐙", "🦉", "🦀", "🐠", "🦦"];
      const indice = Math.floor(Math.random() * emojisAvancados.length);
      const emojiEscolhido = emojisAvancados[indice];
  
      setPet(prevPet => ({
        ...prevPet,
        emojiAvancado: emojiEscolhido
      }));
    }
  }, [pet.nivel]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'tempo' ? parseInt(value) : value
    });
  };

  const registrarSessao = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const ultimoLoginDate = pet.ultimoLogin ? new Date(pet.ultimoLogin) : null;
    let ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    ontem = ontem.toISOString().split('T')[0];

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
    linguagens[formData.linguagem] += formData.tempo;

    setPet({
      ...pet,
      experiencia: novaExperiencia,
      nivel: novoNivel,
      experienciaParaProximoNivel: novaExpParaProximo,
      saude: Math.min(100, pet.saude + 5),
      energia: Math.max(20, pet.energia - 10),
      felicidade: Math.min(100, pet.felicidade + 10),
      ultimoLogin: hoje,
      linguagens,
      dias_seguidos: diasSeguidos
    });

    setShowModal(false);
  };

  const alimentarPet = () => {
    setPet({
      ...pet,
      energia: Math.min(100, pet.energia + 20),
      saude: Math.min(100, pet.saude + 10)
    });
  };

  const brincarComPet = () => {
    setPet({
      ...pet,
      felicidade: Math.min(100, pet.felicidade + 15),
      energia: Math.max(0, pet.energia - 5)
    });
  };

  const resetarPet = () => {
    if (confirm("Tem certeza que deseja resetar seu pet para o nível 1?")) {
      setPet({
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
          css: 0
        },
        dias_seguidos: 0,
        emojiAvancado: null 
      });
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

      <PetActions 
        alimentarPet={alimentarPet} 
        brincarComPet={brincarComPet} 
        setShowModal={setShowModal}
      />

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
  <button className="reset-button" onClick={resetarPet}>
  🥚Resetar Pet
  </button>
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