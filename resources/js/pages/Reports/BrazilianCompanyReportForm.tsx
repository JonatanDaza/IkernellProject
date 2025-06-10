import React, { useState, FormEvent } from 'react';

interface Project {
  id: number;
  name: string;
}

interface Props {
  projects: Project[];
}

const REPORT_URL = '/reports/generate-brazilian-company-report';

const BrazilianCompanyReportForm: React.FC<Props> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  return (
    <form
      method="GET"
      action={REPORT_URL}
    >
      <h2>Generar Reporte de Empresa Brasileña</h2>
      <div>
        <label htmlFor="project_id" style={{ marginRight: '10px' }}>Seleccionar Proyecto:</label>
        <select
          id="project_id"
          name="project_id"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          required
        >
          <option value="" disabled>
            {projects.length === 0 ? 'No hay proyectos disponibles' : 'Seleccione un proyecto'}
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} (ID: {project.id})
            </option>
          ))}
        </select>
      </div>
      {projects.length === 0 && (
        <p>No hay proyectos para mostrar. Asegúrese de que existan proyectos en el sistema.</p>
      )}
      <button type="submit" disabled={!selectedProjectId} style={{ marginTop: '15px' }}>
        Generar Reporte
      </button>
    </form>
  );
};

export default BrazilianCompanyReportForm;