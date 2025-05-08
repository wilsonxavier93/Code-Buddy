import React, { useState, useEffect } from "react";
import PetStatus from "./components/PetStatus";
import PetActions from "./components/PetActions";
import SessionModal from "./components/SessionModal";

// Imagens para cada nível do pet com correspondência de cores
const IMAGENS_PET = {
  nivel1_2: [
    {img: "/img/eggs/ovo-nivel-basico-amarela.png", cor: "amarelo"},
    {img: "/img/eggs/ovo-nivel-basico-azul.png", cor: "azul"},
    {img: "/img/eggs/ovo-nivel-basico-rosa.png", cor: "rosa"},
    {img: "/img/eggs/ovo-nivel-basico-verde.png", cor: "verde"},
    {img: "/img/eggs/ovo-nivel-basico-vermelho.png", cor: "vermelho"},
  ],
  nivel3_6: [
    {img: "/img/eggs/ovo-nivel-intermediario-amarelo.png", cor: "amarelo"},
    {img: "/img/eggs/ovo-nivel-intermediario-azul.png", cor: "azul"},
    {img: "/img/eggs/ovo-nivel-intermediario-rosa.png", cor: "rosa"},
    {img: "/img/eggs/ovo-nivel-intermediario-verde.png", cor: "verde"},
    {img: "/img/eggs/ovo-nivel-intermediario-vermelho.png", cor: "vermelho"},
  ],
  nivel7_mais: [
    "/img/animais/pet-abelha.png",
    "/img/animais/pet-arara.png",
    "/img/animais/pet-arara-azul.png",
    "/img/animais/pet-ariranha.png",
    "/img/animais/pet-beija-flor.png",
    "/img/animais/pet-bicho-preguiça.png",
    "/img/animais/pet-boto-cor-de-rosa.png",
    "/img/animais/pet-cachorro-caramelo.png",
    "/img/animais/pet-capivara.png",
    "/img/animais/pet-carangueijo.png",
    "/img/animais/pet-coruja.png",
    "/img/animais/pet-garça.png",
    "/img/animais/pet-gato-laranja.png",
    "/img/animais/pet-gato-preto.png",
    "/img/animais/pet-golfinho.png",
    "/img/animais/pet-jabuti.png",
    "/img/animais/pet-jiboa.png",
    "/img/animais/pet-mico-leão-dourado.png",
    "/img/animais/pet-onça-pintada.png",
    "/img/animais/pet-papagaio-verde.png",
    "/img/animais/pet-peixe-boi.png",
    "/img/animais/pet-pica-pau-amarelo.png",
    "/img/animais/pet-tamandua-bandeira.png",
    "/img/animais/pet-tatu-bola.png",
    "/img/animais/pet-tubarão.png",
    "/img/animais/pet-tucano.png",
  ],
};

// Função para sortear uma imagem baseada no nível
const sortearImagemPet = (nivel, corAtual = null) => {
  if (nivel < 3) {
    // Nível 1-2: Sorteia um ovo básico aleatório
    const indiceAleatorio = Math.floor(Math.random() * IMAGENS_PET.nivel1_2.length);
    return {
      imagem: IMAGENS_PET.nivel1_2[indiceAleatorio].img,
      cor: IMAGENS_PET.nivel1_2[indiceAleatorio].cor
    };
  } else if (nivel < 7) {
    // Nível 3-6: Mantém a mesma cor do ovo, mas com rachadura
    if (corAtual) {
      // Procura o ovo intermediário da mesma cor
      const ovoCorrespondente = IMAGENS_PET.nivel3_6.find(ovo => ovo.cor === corAtual);
      if (ovoCorrespondente) {
        return {
          imagem: ovoCorrespondente.img,
          cor: corAtual
        };
      }
    }
    
    // Caso não tenha cor anterior ou não encontre correspondência (fallback)
    const indiceAleatorio = Math.floor(Math.random() * IMAGENS_PET.nivel3_6.length);
    return {
      imagem: IMAGENS_PET.nivel3_6[indiceAleatorio].img,
      cor: IMAGENS_PET.nivel3_6[indiceAleatorio].cor
    };
  } else {
    // Nível 7+: Sorteia um animal aleatório (não tem mais a regra de cor)
    const indiceAleatorio = Math.floor(Math.random() * IMAGENS_PET.nivel7_mais.length);
    return {
      imagem: IMAGENS_PET.nivel7_mais[indiceAleatorio],
      cor: null // Animal não tem cor associada
    };
  }
};

// Função para extrair a cor de uma imagem de ovo
const extrairCorDaImagem = (caminhoImagem) => {
  // Procurar em todos os ovos de nível 1-2
  for (const ovo of IMAGENS_PET.nivel1_2) {
    if (ovo.img === caminhoImagem) {
      return ovo.cor;
    }
  }
  
  // Procurar em todos os ovos de nível 3-6
  for (const ovo of IMAGENS_PET.nivel3_6) {
    if (ovo.img === caminhoImagem) {
      return ovo.cor;
    }
  }
  
  return null; // Retorna null se não for um ovo ou não encontrar
};

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
  imagemPet: "/imagens/nivel1_1.png", // Imagem padrão inicial
  corOvo: null, // Nova propriedade para rastrear a cor do ovo
};

// Função para carregar o pet do localStorage
const carregarPetDoStorage = () => {
  try {
    const dadosSalvos = localStorage.getItem("petProgramador");
    if (!dadosSalvos) {
      // Se não houver dados, inicializa com uma imagem aleatória de nível 1
      const imagemInicial = sortearImagemPet(1);
      const petInicial = {
        ...ESTADO_INICIAL_PET,
        imagemPet: imagemInicial.imagem,
        corOvo: imagemInicial.cor
      };
      return petInicial;
    }
    
    const dadosParseados = JSON.parse(dadosSalvos);
    
    // Verificações de segurança e migração de dados
    
    // Migração do emojiAvancado antigo para o novo sistema de imagens
    if (dadosParseados.linguagens?.emojiAvancado) {
      delete dadosParseados.linguagens.emojiAvancado;
    }
    
    // Se não tiver imagemPet, adiciona uma
    if (!dadosParseados.hasOwnProperty("imagemPet")) {
      const imagemSorteada = sortearImagemPet(dadosParseados.nivel);
      dadosParseados.imagemPet = imagemSorteada.imagem;
      dadosParseados.corOvo = imagemSorteada.cor;
    }
    
    // Se não tiver corOvo mas tiver uma imagem de ovo, extrai a cor
    if (!dadosParseados.hasOwnProperty("corOvo") && dadosParseados.nivel < 7) {
      dadosParseados.corOvo = extrairCorDaImagem(dadosParseados.imagemPet);
    }
    
    // Remove emojiAvancado antigo se existir
    if (dadosParseados.hasOwnProperty("emojiAvancado")) {
      delete dadosParseados.emojiAvancado;
    }
    
    // Calcula decaimentos baseados no último login
    if (dadosParseados.ultimoLogin) {
      const agora = new Date();
      const ultimoLogin = new Date(dadosParseados.ultimoLogin);
      const diffEmHoras = Math.floor((agora - ultimoLogin) / (1000 * 60 * 60));
      const decaimentos = Math.floor(diffEmHoras / 5);
      
      if (decaimentos > 0) {
        dadosParseados.saude = Math.max(0, dadosParseados.saude - decaimentos * 15);
        dadosParseados.energia = Math.max(0, dadosParseados.energia - decaimentos * 15);
        dadosParseados.felicidade = Math.max(0, dadosParseados.felicidade - decaimentos * 20);
      }
    }
    
    return dadosParseados;
  } catch (error) {
    console.error("Erro ao carregar dados do pet:", error);
    // Em caso de erro, retorna o estado inicial com uma imagem aleatória
    const imagemInicial = sortearImagemPet(1);
    const petInicial = {
      ...ESTADO_INICIAL_PET,
      imagemPet: imagemInicial.imagem,
      corOvo: imagemInicial.cor
    };
    return petInicial;
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

  // Atualiza a imagem do pet quando o nível muda
  useEffect(() => {
    // Verifica se o nível mudou para uma categoria diferente
    const nivelAnteriorCategoria = 
      pet.nivel <= 2 ? 'nivel1_2' : 
      pet.nivel <= 6 ? 'nivel3_6' : 'nivel7_mais';
    
    // Determina a categoria atual baseada no nível atual do pet
    const nivelAtualCategoria = 
      pet.nivel <= 2 ? 'nivel1_2' : 
      pet.nivel <= 6 ? 'nivel3_6' : 'nivel7_mais';
    
    // Se mudou de categoria, sorteia nova imagem considerando a cor atual
    if (nivelAnteriorCategoria !== nivelAtualCategoria) {
      const imagemSorteada = sortearImagemPet(pet.nivel, pet.corOvo);
      
      setPet(prevPet => {
        const petAtualizado = {
          ...prevPet,
          imagemPet: imagemSorteada.imagem,
          corOvo: imagemSorteada.cor // Atualiza a cor se necessário
        };
        
        // Salva no localStorage
        salvarPetNoStorage(petAtualizado);
        return petAtualizado;
      });
      
      console.log(`Pet evoluiu para nível ${pet.nivel}! Nova imagem: ${imagemSorteada.imagem}, cor: ${imagemSorteada.cor}`);
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

    // Determina se deve sortear uma nova imagem com base na mudança de categoria
    let novaImagem = pet.imagemPet;
    let novaCor = pet.corOvo;
    
    const nivelAnteriorCategoria = 
      pet.nivel <= 2 ? 'nivel1_2' : 
      pet.nivel <= 6 ? 'nivel3_6' : 'nivel7_mais';
    
    const novoNivelCategoria = 
      novoNivel <= 2 ? 'nivel1_2' : 
      novoNivel <= 6 ? 'nivel3_6' : 'nivel7_mais';
    
    if (nivelAnteriorCategoria !== novoNivelCategoria) {
      const imagemSorteada = sortearImagemPet(novoNivel, pet.corOvo);
      novaImagem = imagemSorteada.imagem;
      novaCor = imagemSorteada.cor;
      console.log(`Pet evoluiu para o nível ${novoNivel} - Nova imagem: ${novaImagem}, cor: ${novaCor}`);
    }

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
      imagemPet: novaImagem,
      corOvo: novaCor,
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
      energia: Math.max(0, pet.energia - 10),
    };
    setPet(petAtualizado);
    salvarPetNoStorage(petAtualizado); // Salva explicitamente
  };

  const resetarPet = () => {
    if (window.confirm("Tem certeza que deseja resetar seu pet para o nível 1?")) {
      // Limpar localStorage completamente primeiro
      localStorage.removeItem("petProgramador");
      
      // Sortear uma imagem de nível 1
      const imagemInicial = sortearImagemPet(1);
      
      // Resetar para o estado inicial com a nova imagem
      const petInicial = {
        ...ESTADO_INICIAL_PET,
        imagemPet: imagemInicial.imagem,
        corOvo: imagemInicial.cor
      };
      
      setPet(petInicial);
      
      // Salvar no localStorage
      salvarPetNoStorage(petInicial);
      
      // Confirmar o reset no console
      console.log("Pet resetado para o estado inicial com a imagem:", imagemInicial);
    }
  };

  // Função para mudar manualmente a imagem do pet
  const trocarImagemPet = () => {
    let imagemSorteada;
    
    if (pet.nivel < 7) {
      // Se for um ovo (nível 1-6), sorteia mantendo a mesma categoria mas pode mudar a cor
      imagemSorteada = pet.nivel <= 2 
        ? sortearImagemPet(1) // Ovo básico (nível 1-2)
        : sortearImagemPet(3); // Ovo com rachadura (nível 3-6)
    } else {
      // Se for um animal (nível 7+), sorteia qualquer animal
      imagemSorteada = sortearImagemPet(7);
    }
    
    const petAtualizado = {
      ...pet,
      imagemPet: imagemSorteada.imagem,
      corOvo: imagemSorteada.cor
    };
    
    setPet(petAtualizado);
    salvarPetNoStorage(petAtualizado);
    console.log("Imagem do pet trocada para:", imagemSorteada.imagem, "Cor:", imagemSorteada.cor);
  };

  return (
    <div className="container">
      <div className="pet-icon">
        <img 
          src={pet.imagemPet} 
          alt={`Pet nível ${pet.nivel}`} 
          style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
          onClick={trocarImagemPet} 
          title="Clique para mudar a aparência do pet"
        />
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