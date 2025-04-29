import React from 'react';

function PetStatus({ pet }) {
  return (
    <div className="status-container">
      <div className="status-item">
        <div className="status-label">Experiência</div>
        <div className="status-bar">
          <div
            className="status-fill blue"
            style={{ width: `${(pet.experiencia / pet.experienciaParaProximoNivel) * 100}%` }}
          ></div>
        </div>
        <div className="status-value">{Math.floor(pet.experiencia)} / {Math.floor(pet.experienciaParaProximoNivel)}</div>
      </div>

      <div className="status-item">
        <div className="status-label">Saúde</div>
        <div className="status-bar">
          <div
            className="status-fill green"
            style={{ width: `${pet.saude}%` }}
          ></div>
        </div>
        <div className="status-value">{pet.saude} / 100</div>
      </div>

      <div className="status-item">
        <div className="status-label">Energia</div>
        <div className="status-bar">
          <div
            className="status-fill yellow"
            style={{ width: `${pet.energia}%` }}
          ></div>
        </div>
        <div className="status-value">{pet.energia} / 100</div>
      </div>

      <div className="status-item">
        <div className="status-label">Felicidade</div>
        <div className="status-bar">
          <div
            className="status-fill pink"
            style={{ width: `${pet.felicidade}%` }}
          ></div>
        </div>
        <div className="status-value">{pet.felicidade} / 100</div>
      </div>
    </div>
  );
}

export default PetStatus;