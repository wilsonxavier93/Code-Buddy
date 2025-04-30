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








}

export default App;
