'use client'

import { useState, useEffect } from 'react';

// Interfaces atualizadas para os dados
interface DataItem {
  ano: number;
  mes: number;
  quantidade: number;
}

// A resposta agora pode conter 'categoria' ou 'name'
interface DataResponse {
  categoria?: string;
  name?: string;
  dados: DataItem[];
}

type FilterType = 'category' | 'name';

export default function Predictions() {
  // --- Estados do Componente ---
  const [filterType, setFilterType] = useState<FilterType>('category'); // Novo estado: 'category' ou 'name'
  const [categories, setCategories] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('Todos');
  
  const [predictions, setPredictions] = useState<DataResponse[]>([]);
  const [historicalData, setHistoricalData] = useState<DataResponse[]>([]);
  
  const [showHistorical, setShowHistorical] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  // --- Funções de Busca de Dados (Atualizadas) ---

  // Busca tanto categorias quanto nomes na montagem inicial
  const fetchFilterOptions = async () => {
    try {
      const [catResponse, nameResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_PY_BACKEND}/api/categories`),
        fetch(`${process.env.NEXT_PUBLIC_PY_BACKEND}/api/names`),
      ]);
      if (!catResponse.ok || !nameResponse.ok) {
        throw new Error('Erro ao buscar opções de filtro');
      }
      const catData = await catResponse.json();
      const nameData = await nameResponse.json();
      
      setCategories(['Todos', ...catData.categorias]);
      setNames(['Todos', ...nameData.names]);

    } catch (err: any) {
      setError(err.message);
    }
  };

  // Busca previsões com base no filtro selecionado
  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    setUpdateStatus(null);
    try {
      if (selectedValue === 'Todos') {
        // Para "Todos", busca todas as previsões
        const response = await fetch(`${process.env.NEXT_PUBLIC_PY_BACKEND}/api/predictions`);
        if (response.ok) {
            const data = await response.json();
            setPredictions(Array.isArray(data) ? data : []);
        } else {
            setPredictions([]);
        }
        return;
      }
      
      const url = `${process.env.NEXT_PUBLIC_PY_BACKEND}/api/predictions?${filterType}=${selectedValue}`;
      const response = await fetch(url);
      
      if (response.status === 404) {
        // Se não encontrar, tenta gerar novas previsões
        await handleUpdatePredictions();
      } else if (response.ok) {
        const data = await response.json();
        setPredictions(Array.isArray(data) ? data : [data]);
      } else {
        throw new Error(`Erro ao buscar previsões para ${selectedValue}`);
      }
    } catch (err: any) {
      setError(err.message);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // Busca dados históricos
  const fetchHistoricalData = async () => {
    if (selectedValue === 'Todos') {
        setHistoricalData([]);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_PY_BACKEND}/api/products?${filterType}=${selectedValue}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico para ${selectedValue}`);
      }
      const data = await response.json();
      setHistoricalData([data]);
    } catch (err: any) {
      setError(err.message);
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza as previsões
  const handleUpdatePredictions = async () => {
    if (selectedValue === 'Todos') {
      setUpdateStatus('Selecione um item específico para atualizar as previsões.');
      return false;
    }
    setLoading(true);
    setUpdateStatus(`Atualizando previsões para ${selectedValue}...`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PY_BACKEND}/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [filterType]: selectedValue }), // Envia no corpo da requisição
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Não foi possível atualizar previsões para ${selectedValue}`);
      }

      setUpdateStatus(`Previsões atualizadas com sucesso para ${selectedValue}!`);
      // Atualiza o estado de previsões com a resposta da API
      const newPredictionData = {
        [filterType]: data[filterType],
        dados: data.previsoes
      };
      setPredictions(prev => {
        // Remove a previsão antiga (se existir) e adiciona a nova
        const otherPredictions = prev.filter(p => p[filterType] !== selectedValue);
        return [...otherPredictions, newPredictionData];
      });
      return true;

    } catch (err: any) {
      setUpdateStatus(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Efeitos do Componente ---

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchPredictions();
    if (showHistorical) {
      fetchHistoricalData();
    } else {
      setHistoricalData([]);
    }
  }, [selectedValue, filterType, showHistorical]);

  // Handler para trocar o tipo de filtro
  const handleFilterTypeChange = (type: FilterType) => {
    setFilterType(type);
    setSelectedValue('Todos'); // Reseta a seleção ao trocar o tipo
  };

  // --- Lógica de Renderização ---

  const currentOptions = filterType === 'category' ? categories : names;

  // Função para unificar dados históricos e de previsão para a tabela
  const formatDataForTable = (data: DataResponse[], type: 'Previsão' | 'Histórico') => {
    return data.flatMap(item => 
      item.dados.map(d => ({
        key: `${item.categoria || item.name}-${type}-${d.ano}-${d.mes}`,
        identifier: item.categoria || item.name || 'N/A',
        type,
        ...d
      }))
    );
  };
  
  const combinedData = [
    ...formatDataForTable(predictions, 'Previsão'),
    ...(showHistorical ? formatDataForTable(historicalData, 'Histórico') : [])
  ].sort((a, b) => {
    if (a.identifier !== b.identifier) return a.identifier.localeCompare(b.identifier);
    if (a.ano !== b.ano) return a.ano - b.ano;
    return a.mes - b.mes;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-screen mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previsões de Demanda</h2>

        {/* --- Feedbacks --- */}
        {error && <div className="p-4 mb-4 rounded bg-red-100 text-red-700">{error}</div>}
        {updateStatus && <div className={`p-4 mb-4 rounded ${updateStatus.includes('Erro') || updateStatus.includes('Não') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{updateStatus}</div>}

        {/* --- Controles de Filtro --- */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Filtrar por</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <button onClick={() => handleFilterTypeChange('category')} className={`px-4 py-2 rounded-l-md border ${filterType === 'category' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}>Categoria</button>
              <button onClick={() => handleFilterTypeChange('name')} className={`px-4 py-2 rounded-r-md border-t border-b border-r ${filterType === 'name' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}>Nome do Produto</button>
            </div>
          </div>
          
          <div>
            <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700">
              Selecionar {filterType === 'category' ? 'Categoria' : 'Nome'}
            </label>
            <select
              id="filterValue"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="mt-1 block w-full min-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {currentOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpdatePredictions}
            disabled={selectedValue === 'Todos' || loading}
            className="self-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {loading ? 'Atualizando...' : 'Atualizar Previsões'}
          </button>

          <div className="self-end flex items-center">
            <input type="checkbox" id="showHistorical" checked={showHistorical} onChange={(e) => setShowHistorical(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="showHistorical" className="ml-2 text-sm text-gray-700">Mostrar dados históricos</label>
          </div>
        </div>

        {/* --- Tabela de Dados --- */}
        {loading && selectedValue !== 'Todos' ? (
          <p className="text-gray-500">Carregando...</p>
        ) : combinedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {filterType === 'category' ? 'Categoria' : 'Nome do Produto'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {combinedData.map((row) => (
                  <tr key={row.key}>
                    <td className="px-6 py-4 whitespace-nowrap">{row.identifier}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.type === 'Previsão' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.ano}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.mes}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">{selectedValue === 'Todos' ? 'Selecione um item para ver os dados.' : 'Nenhum dado encontrado.'}</p>
        )}
      </div>
    </div>
  );
}
