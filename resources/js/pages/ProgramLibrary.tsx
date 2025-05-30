import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge'; // Asumiendo que tienes un componente Badge

export interface ProgramResource {
    id: string | number;
    name: string;
    type: 'Software' | 'Herramienta' | 'Licencia' | 'Librería' | 'Framework' | 'Documentación';
    version?: string;
    description: string;
    link?: string;
    tags?: string[];
    status?: 'Aprobado' | 'En Revisión' | 'Obsoleto';
    category?: string;
}

interface ProgramLibraryProps {
    resources: ProgramResource[];
    title?: string;
}

const ResourceCard: React.FC<{ resource: ProgramResource }> = ({ resource }) => {
    return (
        <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-card-foreground dark:text-gray-100">{resource.name}</h3>
                {resource.version && (
                    <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">{`v${resource.version}`}</Badge>
                )}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                <strong>Tipo:</strong> {resource.type}
            </p>
            {resource.category && (
                 <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                    <strong>Categoría:</strong> {resource.category}
                </p>
            )}
            <p className="text-sm text-foreground dark:text-gray-300 mb-3 min-h-[40px]">{resource.description}</p>
            {resource.link && (
                <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Visitar Recurso &rarr;
                </a>
            )}
            {resource.tags && resource.tags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border dark:border-gray-700">
                    {resource.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="mr-1 mb-1 text-xs dark:border-gray-600 dark:text-gray-400">{tag}</Badge>
                    ))}
                </div>
            )}
             {resource.status && (
                <div className="mt-2">
                    <Badge
                        variant={
                            resource.status === 'Aprobado' ? 'default' :
                            resource.status === 'Obsoleto' ? 'destructive' :
                            'outline'
                        }
                        className={`text-xs 
                            ${resource.status === 'Aprobado' ? 'bg-green-500 text-white dark:bg-green-600' : ''}
                            ${resource.status === 'Obsoleto' ? 'bg-red-500 text-white dark:bg-red-600' : ''}
                            ${resource.status === 'En Revisión' ? 'bg-yellow-500 text-black dark:bg-yellow-600 dark:text-gray-900' : ''}
                        `}
                    >
                        {resource.status}
                    </Badge>
                </div>
            )}
        </div>
    );
};

const ProgramLibrary: React.FC<ProgramLibraryProps> = ({ resources, title = "Biblioteca de Programas" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<ProgramResource['type'] | 'All'>('All');

    const resourceTypes = useMemo(() => {
        const types = new Set(resources.map(r => r.type));
        return ['All', ...Array.from(types)] as (ProgramResource['type'] | 'All')[];
    }, [resources]);

    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            const matchesSearchTerm =
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
            
            const matchesType = selectedType === 'All' || resource.type === selectedType;

            return matchesSearchTerm && matchesType;
        });
    }, [resources, searchTerm, selectedType]);

    return (
        <div className="p-4 md:p-6 bg-background dark:bg-gray-900 rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-foreground dark:text-gray-100 mb-6">{title}</h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="search-library" className="dark:text-gray-300">Buscar Recurso</Label>
                    <Input
                        id="search-library"
                        type="text"
                        placeholder="Buscar por nombre, descripción, tipo, tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                </div>
                <div>
                    <Label htmlFor="filter-type" className="dark:text-gray-300">Filtrar por Tipo</Label>
                    <select
                        id="filter-type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as ProgramResource['type'] | 'All')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        {resourceTypes.map(type => (
                            <option key={type} value={type}>{type === 'All' ? 'Todos los Tipos' : type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground dark:text-gray-400 py-8">
                    No se encontraron recursos que coincidan con tu búsqueda o filtro.
                </p>
            )}
        </div>
    );
};

export default ProgramLibrary;

/**
 * Nota: Para el componente Badge, podrías usar algo como:
 * // components/ui/badge.tsx
 * export function Badge({ className, variant, ...props }: BadgeProps) {
 *   return (
 *     <div className={cn(badgeVariants({ variant }), className)} {...props} />
 *   )
 * }
 * // Y definir badgeVariants con cva. Si no tienes `Badge` o `cn`, puedes usar un simple `<span>` con estilos.
 */