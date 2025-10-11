import { Filter, X, Calendar, CheckCircle, Clock } from 'lucide-react';
import { StatusFilter, DateFilter } from '../utils/types';

interface DerbyFiltersProps {
    statusFilter: StatusFilter;
    dateFilter: DateFilter;
    onStatusChange: (value: StatusFilter) => void;
    onDateChange: (value: DateFilter) => void;
    onReset: () => void;
}

export const DerbyFilters = ({
    statusFilter,
    dateFilter,
    onStatusChange,
    onDateChange,
    onReset
}: DerbyFiltersProps) => {
    const hasActiveFilters = statusFilter !== "ALL" || dateFilter !== "ALL";

    return (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Filtres</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="statusFilter" className="flex items-center gap-2 text-xs font-semibold mb-2 text-gray-400">
                        <CheckCircle className="w-3 h-3" />
                        Statut du derby
                    </label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
                        className="w-full bg-gray-800/50 border border-gray-700/50 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    >
                        <option value="ALL">Tous les derbys</option>
                        <option value="PENDING">En attente</option>
                        <option value="COMPLETED">Terminés</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dateFilter" className="flex items-center gap-2 text-xs font-semibold mb-2 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        Période
                    </label>
                    <select
                        id="dateFilter"
                        value={dateFilter}
                        onChange={(e) => onDateChange(e.target.value as DateFilter)}
                        className="w-full bg-gray-800/50 border border-gray-700/50 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    >
                        <option value="ALL">Toutes les périodes</option>
                        <option value="1M">Dernier mois</option>
                        <option value="3M">3 derniers mois</option>
                        <option value="6M">6 derniers mois</option>
                    </select>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-400 font-semibold">Actifs:</span>
                    {statusFilter !== "ALL" && (
                        <span className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {statusFilter === "PENDING" ? "En attente" : "Terminés"}
                        </span>
                    )}
                    {dateFilter !== "ALL" && (
                        <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-medium">
                            <Calendar className="w-3 h-3" />
                            {dateFilter === "1M" ? "Dernier mois" : dateFilter === "3M" ? "3 mois" : "6 mois"}
                        </span>
                    )}
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 ml-auto px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 font-semibold transition-all text-xs"
                    >
                        <X className="w-3 h-3" />
                        Réinitialiser
                    </button>
                </div>
            )}
        </div>
    );
};