import { useEffect, useState } from 'react';
import { Derby, StatusFilter, DateFilter } from '../utils/types';
import { filterDerbysByDate, filterDerbysByStatus } from '../utils/derbyHelpers';

export const useDerbys = () => {
    const [derbys, setDerbys] = useState<Derby[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");

    const fetchDerbys = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/derbys?skip=${(page - 1) * pageSize}&take=${pageSize}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des derbys');
            }
            const data = await response.json();

            let filteredDerbys = data.derbys;
            filteredDerbys = filterDerbysByStatus(filteredDerbys, statusFilter);
            filteredDerbys = filterDerbysByDate(filteredDerbys, dateFilter);

            setDerbys(filteredDerbys);
            setTotal(data.total);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDerbys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter, dateFilter]);

    const resetFilters = () => {
        setStatusFilter("ALL");
        setDateFilter("ALL");
        setPage(1);
    };

    return {
        derbys,
        loading,
        error,
        page,
        setPage,
        pageSize,
        total,
        statusFilter,
        setStatusFilter,
        dateFilter,
        setDateFilter,
        resetFilters,
        refetch: fetchDerbys
    };
};