import React, { useState, useEffect, FormEvent } from 'react';

interface Project {
  id: number;
  name: string;
}

const BrazilianCompanyReportForm: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setFetchError(null);
      try {
        // Asume que tienes un endpoint /api/projects para listar los proyectos
        const response = await fetch('/api/projects');
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
    if (!selectedProjectId) {
      alert('Por favor, seleccione un proyecto.');
      return;
    }

    // Asume que la ruta para generar el reporte es /reports/generate-brazilian-company-report
    // y que acepta 'project_id' como parámetro GET.
    // Ajusta esta URL según la configuración de tus rutas en Laravel.
    const reportUrl = `/reports/generate-brazilian-company-report?project_id=${selectedProjectId}`;
    
    // Redirige para iniciar la descarga del archivo CSV
    window.location.href = reportUrl;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Generar Reporte de Empresa Brasileña</h2>

      {fetchError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}

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