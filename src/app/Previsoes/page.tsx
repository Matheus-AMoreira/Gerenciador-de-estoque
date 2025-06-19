'use client'

import { useState, useEffect } from 'react';

interface DataItem {
  ano: number;
  mes: number;
  quantidade: number;
}

interface DataResponse {
  categoria: string;
  dados: DataItem[];
}

export default function Predictions() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [predictions, setPredictions] = useState<DataResponse[]>([]);
  const [historicalData, setHistoricalData] = useState<DataResponse[]>([]);
  const [showHistorical, setShowHistorical] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  // Função para buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PY_BACKEND}/api/categorias`);
      if (!response.ok) {
        throw new Error('Erro ao buscar categorias');
      }
      const data = await response.json();
      setCategories(['Todas', ...data.categorias]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Função para buscar previsões
  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    setUpdateStatus(null);
    try {
      const url = selectedCategory === 'Todas'
        ? `${process.env.NEXT_PUBLIC_PY_BACKEND}/api/previsoes`
        : `${process.env.NEXT_PUBLIC_PY_BACKEND}/api/previsoes?categoria=${selectedCategory}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404 && selectedCategory !== 'Todas') {
          const updateSuccess = await handleUpdatePredictions();
          if (!updateSuccess) {
            throw new Error('Não foi possível gerar previsões para a categoria selecionada');
          }
        } else {
          throw new Error(`Erro ao buscar previsões para ${selectedCategory}`);
        }
      } else {
        const data = await response.json();
        setPredictions(Array.isArray(data) ? data : [data]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar dados históricos
  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedCategory === 'Todas') {
        const promises = categories
          .filter((cat) => cat !== 'Todas')
          .map((cat) =>
            fetch(`${process.env.NEXT_PUBLIC_PY_BACKEND}/api/products_por_categoria?categoria=${cat}`).then((res) => {
              if (!res.ok) throw new Error(`Erro ao buscar histórico para ${cat}`);
              return res.json();
            })
          );
        const results = await Promise.all(promises);
        setHistoricalData(results);
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PY_BACKEND}/api/products_por_categoria?categoria=${selectedCategory}`
        );
        if (!response.ok) {
          throw new Error(`Erro ao buscar histórico para ${selectedCategory}`);
        }
        const data = await response.json();
        setHistoricalData([data]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar previsões
  const handleUpdatePredictions = async () => {
    if (selectedCategory === 'Todas') {
      setUpdateStatus('Selecione uma categoria específica para atualizar previsões.');
      return false;
    }
    setUpdateStatus(null);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PY_BACKEND}/api/atualizar_previsoes?categoria=${selectedCategory}`,
        { method: 'POST' }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Não foi possível atualizar previsões para ${selectedCategory}`);
      }
      const data = await response.json();
      // Transformar 'previsoes' em 'dados' para corresponder ao formato esperado
      if (!data.categoria || !data.previsoes) {
        throw new Error('Resposta inválida da API ao atualizar previsões');
      }
      const formattedData = {
        categoria: data.categoria,
        dados: data.previsoes.map((item: any) => ({
          ano: item.ano,
          mes: item.mes,
          quantidade: item.quantidade,
        })),
      };
      setUpdateStatus(`Previsões atualizadas com sucesso para ${selectedCategory}!`);
      setPredictions([formattedData]);
      return true;
    } catch (err: any) {
      setUpdateStatus(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar categorias na montagem do componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Buscar previsões e dados históricos quando necessário
  useEffect(() => {
    if (categories.length > 0) {
      fetchPredictions();
      if (showHistorical) {
        fetchHistoricalData();
      }
    }
  }, [selectedCategory, categories, showHistorical]);

  // Combinar previsões e dados históricos para exibição
  const combinedData = [
    ...predictions.map((item) => ({
      ...item,
      dados: item.dados.map((d) => ({ ...d, tipo: 'Previsão' })),
    })),
    ...(showHistorical
      ? historicalData.map((item) => ({
          ...item,
          dados: item.dados.map((d) => ({ ...d, tipo: 'Histórico' })),
        }))
      : []),
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-screen mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previsões por Categoria</h2>

        {/* Feedback de erro */}
        {error && (
          <div className="p-4 mb-4 rounded bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {/* Feedback de atualização */}
        {updateStatus && (
          <div className={`p-4 mb-4 rounded ${updateStatus.includes('Erro') || updateStatus.includes('Não') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {updateStatus}
          </div>
        )}

        {/* Dropdown, botão de atualização e toggle */}
        <div className="mb-4 flex items-center space-x-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Selecionar Categoria
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdatePredictions}
            disabled={selectedCategory === 'Todas' || loading}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition"
          >
            Atualizar Previsões
          </button>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="showHistorical"
              checked={showHistorical}
              onChange={(e) => setShowHistorical(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showHistorical" className="ml-2 text-sm text-gray-700">
              Mostrar dados históricos
            </label>
          </div>
        </div>

        {/* Tabela de dados */}
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : combinedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mês
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {combinedData
                  .filter((item) => item && item.dados)
                  .flatMap((item) =>
                    item.dados.map((data, index) => ({
                      key: `${item.categoria}-${data.tipo}-${index}`,
                      categoria: item.categoria,
                      tipo: data.tipo,
                      ano: data.ano,
                      mes: data.mes,
                      quantidade: data.quantidade,
                    }))
                  )
                  .sort((a, b) => {
                    if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria);
                    if (a.ano !== b.ano) return a.ano - b.ano;
                    if (a.mes !== b.mes) return a.mes - b.mes;
                    return a.tipo.localeCompare(b.tipo);
                  })
                  .map((row) => (
                    <tr key={row.key}>
                      <td className="px-6 py-4 whitespace-nowrap">{row.categoria}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.ano}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.mes}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.quantidade}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Nenhum dado encontrado.</p>
        )}
      </div>
    </div>
  );
}