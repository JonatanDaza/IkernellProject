import React, { useState, useEffect, FormEvent } from 'react';

interface Project {
  id: number;
  name: string;
}
const API_PROJECTS_URL = '/api/projects';
const API_REPORT_URL_BASE = '/reports/generate-brazilian-company-report';


const BrazilianCompanyReportForm: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setFetchError(null);
      try {
        const response = await fetch(API_PROJECTS_URL);
        if (!response.ok) {
          throw new Error(`Error al cargar proyectos: ${response.statusText}`);
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null); // Limpiar errores de envío anteriores
    if (!selectedProjectId) {
      alert('Por favor, seleccione un proyecto.');
      return;
    }

    const reportUrl = `${API_REPORT_URL_BASE}?project_id=${selectedProjectId}`;

    // Redirige para iniciar la descarga del archivo CSV
    window.location.href = reportUrl;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Generar Reporte de Empresa Brasileña</h2>

      {fetchError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

      <div>
        <label htmlFor="project_id" style={{ marginRight: '10px' }}>Seleccionar Proyecto:</label>
        <select
          id="project_id"
          name="project_id"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          required
          disabled={isLoadingProjects || projects.length === 0}
        >
          <option value="" disabled>
            {isLoadingProjects ? 'Cargando proyectos...' : (projects.length === 0 ? 'No hay proyectos disponibles' : 'Seleccione un proyecto')}
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} (ID: {project.id})
            </option>
          ))}
        </select>
      </div>

      {projects.length === 0 && !isLoadingProjects && !fetchError && (
        <p>No hay proyectos para mostrar. Asegúrese de que existan proyectos en el sistema.</p>
      )}

      <button type="submit" disabled={isLoadingProjects || !selectedProjectId} style={{ marginTop: '15px' }}>
        Generar Reporte
      </button>
    </form>
  );
};

export default BrazilianCompanyReportForm;