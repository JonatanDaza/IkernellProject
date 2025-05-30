import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge'; // Asumiendo que tienes un componente Badge

export interface TutorialResource {
    id: string | number;
    title: string;
    description: string;
    category?: string;
    source?: 'Interno' | 'Externo';
    link: string;
    tags?: string[];
    difficulty?: 'Principiante' | 'Intermedio' | 'Avanzado';
    status?: 'Publicado' | 'Borrador';
}

interface TutorialLibraryProps {
    resources: TutorialResource[];
    title?: string;
}

const TutorialCard: React.FC<{ resource: TutorialResource }> = ({ resource }) => {
    return (
        <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-card-foreground dark:text-gray-100">{resource.title}</h3>
                    {resource.difficulty && (
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">{resource.difficulty}</Badge>
                    )}
                </div>
                {resource.category && (
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                        <strong>Categoría:</strong> {resource.category}
                    </p>
                )}
                {resource.source && (
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
                        <strong>Fuente:</strong> {resource.source}
                    </p>
                )}
                <p className="text-sm text-foreground dark:text-gray-300 mb-3 min-h-[60px]">{resource.description}</p>
            </div>
            
            <div>
                {resource.link && (
                    <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300 block mb-3"
                    >
                        Acceder al Tutorial &rarr;
                    </a>
                )}
                {resource.tags && resource.tags.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border dark:border-gray-700">
                        {resource.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs dark:bg-gray-700 dark:text-gray-300">{tag}</Badge>
                        ))}
                    </div>
                )}
                 {resource.status && resource.status === 'Borrador' && (
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200">
                            {resource.status}
                        </Badge>
                    </div>
                )}
            </div>
        </div>
    );
};

const TutorialLibrary: React.FC<TutorialLibraryProps> = ({ resources, title = "Tutoriales de Programación" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');

    const categories = useMemo(() => {
        const cats = new Set(resources.map(r => r.category).filter(Boolean) as string[]);
        return ['All', ...Array.from(cats)];
    }, [resources]);

    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearchTerm =
                resource.title.toLowerCase().includes(lowerSearchTerm) ||
                resource.description.toLowerCase().includes(lowerSearchTerm) ||
                (resource.category && resource.category.toLowerCase().includes(lowerSearchTerm)) ||
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)));
            
            const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;

            return matchesSearchTerm && matchesCategory;
        });
    }, [resources, searchTerm, selectedCategory]);

    return (
        <div className="p-4 md:p-6 bg-background dark:bg-gray-900 rounded-xl shadow mt-8">
            <h2 className="text-2xl font-semibold text-foreground dark:text-gray-100 mb-6">{title}</h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="search-tutorials" className="dark:text-gray-300">Buscar Tutorial</Label>
                    <Input
                        id="search-tutorials"
                        type="text"
                        placeholder="Buscar por título, descripción, categoría, tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                </div>
                <div>
                    <Label htmlFor="filter-category-tutorials" className="dark:text-gray-300">Filtrar por Categoría</Label>
                    <select
                        id="filter-category-tutorials"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'Todas las Categorías' : cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <TutorialCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground dark:text-gray-400 py-8">
                    No se encontraron tutoriales que coincidan con tu búsqueda o filtro.
                </p>
            )}
        </div>
    );
};

export default TutorialLibrary;