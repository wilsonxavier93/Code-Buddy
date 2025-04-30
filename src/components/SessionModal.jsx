import React from 'react';

function SessionModal({ formData, handleInputChange, registrarSessao, setShowModal }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Registrar Sessão de Programação</h2>

        <div className="modal-field">
          <label>Linguagem</label>
          <select name="linguagem" value={formData.linguagem} onChange={handleInputChange}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>

        <div className="modal-field">
          <label>Tempo (minutos)</label>
          <input type="number" name="tempo" value={formData.tempo} onChange={handleInputChange} min="1" max="480" />
        </div>

        <div className="modal-field">
          <label>Data</label>
          <input type="date" name="data" value={formData.data} onChange={handleInputChange} />
        </div>

        <div className="modal-actions">
          <button className="modal-button cancel" onClick={() => setShowModal(false)}>Cancelar</button>
          <button className="modal-button confirm" onClick={registrarSessao}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default SessionModal;