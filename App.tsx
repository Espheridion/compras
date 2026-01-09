
import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS, BRANCHES, BRANCH_PREFIXES } from './constants';
import { InventoryItem, OrderItem, CategoryType, Branch, Product } from './types';
import InventoryCard from './components/InventoryCard';

// Extendemos el tipo Product para manejar el estado mutable localmente
interface ProductState extends Product {
  stock: number;
  quantity: number;
}

const App: React.FC = () => {
  // --- ESTADO: Configuración ---
  const [selectedBranch, setSelectedBranch] = useState<Branch>(() => {
    const savedBranchId = localStorage.getItem('hendaya_selected_branch_id');
    return BRANCHES.find(b => b.id === savedBranchId) || BRANCHES[0];
  });

  // Estado para la instalación PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Detectar evento de instalación (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Evento de instalación capturado');
    };

    // Detectar si ya está instalada (Standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Instalación automática soportada
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Mostrar modal con instrucciones manuales
      setShowInstallModal(true);
    }
  };

  // Función para cargar y fusionar datos
  const loadBranchData = (branchId: string): ProductState[] => {
    const invJson = localStorage.getItem(`${branchId}_inventory`);
    const ordJson = localStorage.getItem(`${branchId}_current_order`);
    
    const inventory: InventoryItem[] = invJson ? JSON.parse(invJson) : [];
    const order: OrderItem[] = ordJson ? JSON.parse(ordJson) : [];

    return PRODUCTS.map(p => {
      const invItem = inventory.find(i => i.productId === p.id);
      const ordItem = order.find(o => o.productId === p.id);
      return {
        ...p,
        stock: invItem ? invItem.stock : 0,
        quantity: ordItem ? ordItem.quantity : 0
      };
    });
  };

  // --- ESTADO: Datos Mutables ---
  const [productsData, setProductsData] = useState<ProductState[]>(() => loadBranchData(selectedBranch.id));

  // --- ESTADO: UI ---
  const [activeTab, setActiveTab] = useState<CategoryType>('OFICINA');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // --- CAMBIO DE SUCURSAL ---
  const handleBranchSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranchId = e.target.value;
    const newBranch = BRANCHES.find(b => b.id === newBranchId);
    if (!newBranch) return;

    localStorage.setItem('hendaya_selected_branch_id', newBranchId);
    setSelectedBranch(newBranch);
    setProductsData(loadBranchData(newBranchId));
    setSearchTerm('');
    setActiveTab('OFICINA');
    setNotification({ msg: `Cambiado a sucursal ${newBranch.name}`, type: 'info' });
  };

  // --- PERSISTENCIA AUTOMÁTICA ---
  useEffect(() => {
    const invToSave: InventoryItem[] = productsData.map(p => ({ productId: p.id, stock: p.stock }));
    const ordToSave: OrderItem[] = productsData.filter(p => p.quantity > 0).map(p => ({ productId: p.id, quantity: p.quantity }));
    
    localStorage.setItem(`${selectedBranch.id}_inventory`, JSON.stringify(invToSave));
    localStorage.setItem(`${selectedBranch.id}_current_order`, JSON.stringify(ordToSave));
  }, [productsData, selectedBranch.id]);

  // Limpiar notificaciones
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --- LÓGICA DE NEGOCIO ---
  const handleStockChange = (id: string, newStock: number) => {
    setProductsData(prev => prev.map(p => 
      p.id === id ? { ...p, stock: Math.max(0, newStock) } : p
    ));
  };

  const handleOrderChange = (id: string, newQuantity: number) => {
    setProductsData(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, isNaN(newQuantity) ? 0 : newQuantity) } : p
    ));
  };

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesTab = p.category === activeTab;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [productsData, activeTab, searchTerm]);

  const itemsInOrder = useMemo(() => productsData.filter(p => p.quantity > 0), [productsData]);

  // --- GENERAR PEDIDO ---
  const generatePurchaseOrder = () => {
    if (itemsInOrder.length === 0) {
      alert('No hay productos en el carro para crear un pedido.');
      return;
    }

    const counterKey = `po_sequence_${selectedBranch.id}`;
    const currentSeq = parseInt(localStorage.getItem(counterKey) || '0', 10);
    const nextSeq = currentSeq + 1;
    
    const prefix = BRANCH_PREFIXES[selectedBranch.id] || 'GEN';
    const folio = `${prefix}-${nextSeq.toString().padStart(4, '0')}`;

    let text = `ORDEN DE COMPRA N° ${folio}\n`;
    text += `SUCURSAL: ${selectedBranch.name.toUpperCase()}\n`;
    text += `FECHA EMISIÓN: ${new Date().toLocaleString()}\n`;
    text += `=================================================\n\n`;
    text += `DETALLE DE PRODUCTOS:\n`;
    text += `(Formato: Nombre ...................... Stock Actual | A Pedir)\n\n`;
    
    itemsInOrder.forEach(item => {
      text += `[ ] ${item.name.padEnd(35, '.')} STOCK: ${item.stock.toString().padEnd(4)} | CANT: ${item.quantity}\n`;
    });
    
    text += `\n=================================================\n`;
    text += `TOTAL ÍTEMS A PEDIR: ${itemsInOrder.reduce((acc, i) => acc + i.quantity, 0)}\n`;
    
    const fileName = `OC_${folio}_${selectedBranch.name.replace(/\s/g, '')}.txt`;
    downloadFile(text, fileName, 'text/plain');

    localStorage.setItem(counterKey, nextSeq.toString());
    setNotification({ msg: `Pedido ${folio} generado correctamente`, type: 'success' });
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100">
      
      {/* Modal de Instrucciones de Instalación */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInstallModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-blue-900">Instalar Aplicación</h3>
              <button onClick={() => setShowInstallModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <p className="font-medium">Tu navegador no soporta instalación automática. Sigue estos pasos:</p>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-1">
                  <span>📱</span> iPhone / iPad (Safari)
                </h4>
                <p>Presiona el botón <strong>Compartir</strong> (cuadrado con flecha) y selecciona <strong>"Agregar al inicio"</strong>.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <span>💻</span> Chrome / Edge (PC)
                </h4>
                <p>Busca el ícono de <strong>Instalar</strong> <span className="inline-block border rounded px-1 text-xs">⬇️</span> en la barra de direcciones.</p>
              </div>

               <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <h4 className="font-bold text-green-800 mb-1 flex items-center gap-1">
                  <span>🤖</span> Android (Chrome)
                </h4>
                <p>Presiona los <strong>3 puntos</strong> arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong>.</p>
              </div>
            </div>
            <button onClick={() => setShowInstallModal(false)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl animate-bounce border flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-600 text-white border-green-400' : 'bg-blue-600 text-white border-blue-400'
        }`}>
          <span>{notification.type === 'success' ? '💾' : 'ℹ️'}</span>
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm transition-all">
        {/* Barra Superior */}
        <div className="bg-blue-900 text-white py-2">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-200 uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span>Sucursal Activa:</span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Botón de instalación PWA: Siempre Visible */}
                {!isInstalled && (
                  <button 
                    onClick={handleInstallClick}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-md cursor-pointer ${
                      deferredPrompt 
                        ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                    }`}
                  >
                    <span>{deferredPrompt ? '📲' : '⬇️'}</span> 
                    {deferredPrompt ? 'INSTALAR APP' : 'INSTALAR'}
                  </button>
                )}

                <div className="relative group">
                  <select 
                    value={selectedBranch.id}
                    onChange={handleBranchSwitch}
                    className="appearance-none bg-blue-800 hover:bg-blue-700 text-white font-bold text-sm py-1.5 pl-4 pr-10 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 transition-colors uppercase tracking-wide shadow-inner"
                  >
                    {BRANCHES.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-1.5 rounded-lg text-blue-900 border border-gray-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-900 leading-none">HENDAYA <span className="text-blue-600 font-normal">| {selectedBranch.name}</span></h1>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={generatePurchaseOrder}
                disabled={itemsInOrder.length === 0}
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
                  itemsInOrder.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                <span>📄</span>
                CREAR PEDIDO
                {itemsInOrder.length > 0 && (
                   <span className="bg-blue-800 px-2 py-0.5 rounded text-[10px]">{itemsInOrder.length} ítems</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Buscador y Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <div className="flex bg-gray-100 p-0.5 rounded-lg w-full md:w-auto overflow-x-auto border border-gray-200">
              {(['OFICINA', 'ASEO', 'COCINA', 'PAPELERIA'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-[9px] font-black rounded-md whitespace-nowrap transition-all uppercase tracking-wider ${
                    activeTab === tab 
                    ? 'bg-white text-blue-700 shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative flex-1 w-full">
              <input 
                type="text"
                placeholder={`Buscar producto en ${selectedBranch.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <span className="absolute left-3 top-2 text-gray-400 text-xs">🔍</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredProducts.map(product => (
            <InventoryCard
              key={product.id}
              product={product}
              stock={product.stock}
              onStockChange={handleStockChange}
              orderQuantity={product.quantity}
              onOrderChange={handleOrderChange}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span>SISTEMA HENDAYA: {selectedBranch.name}</span>
          <span>STOCK BAJO: {productsData.filter(i => i.stock < 5).length}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
