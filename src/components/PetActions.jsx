import React from 'react';

function PetActions({ alimentarPet, brincarComPet, setShowModal }) {
  return (
    <div className="actions">
      <button className="action-button blue" onClick={() => setShowModal(true)}>
        💻 Registrar Coding
      </button>
      <button className="action-button green" onClick={alimentarPet}>
        🍔 Alimentar
      </button>
      <button className="action-button pink" onClick={brincarComPet}>
        💚 Brincar
      </button>
    </div>
  );
}

export default PetActions;