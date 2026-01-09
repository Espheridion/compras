
import { Product, Branch } from './types';

export const BRANCHES: Branch[] = [
  { id: 'hendaya', name: 'Hendaya' },
  { id: 'las_condes', name: 'Las Condes' },
  { id: 'la_dehesa', name: 'La Dehesa' },
  { id: 'san_miguel', name: 'San Miguel' },
  { id: 'antofagasta', name: 'Antofagasta' },
];

export const BRANCH_PREFIXES: Record<string, string> = {
  'hendaya': 'HEN',
  'las_condes': 'LCO',
  'la_dehesa': 'LDE',
  'san_miguel': 'SMI',
  'antofagasta': 'ANT',
};

export const PRODUCTS: Product[] = [
  // OFICINA
  { id: 'off-1', name: 'Papel Fotocopia Carta', category: 'OFICINA' },
  { id: 'off-2', name: 'Papel Fotocopia Oficio', category: 'OFICINA' },
  { id: 'off-3', name: 'Corchetes', category: 'OFICINA' },
  { id: 'off-4', name: 'Corchetera', category: 'OFICINA' },
  { id: 'off-5', name: 'Cuadernos', category: 'OFICINA' },
  { id: 'off-6', name: 'Lápiz Pasta', category: 'OFICINA' },
  { id: 'off-7', name: 'Plumón Azul', category: 'OFICINA' },
  { id: 'off-8', name: 'Plumón Rojo', category: 'OFICINA' },
  { id: 'off-9', name: 'Plumón Verde', category: 'OFICINA' },
  { id: 'off-10', name: 'Plumón Negro', category: 'OFICINA' },
  { id: 'off-11', name: 'Destacador', category: 'OFICINA' },
  { id: 'off-12', name: 'Visores', category: 'OFICINA' },
  { id: 'off-13', name: 'Carpetas colgantes', category: 'OFICINA' },
  { id: 'off-14', name: 'Perforadora', category: 'OFICINA' },
  { id: 'off-15', name: 'Post It 76 x 76 MM', category: 'OFICINA' },
  { id: 'off-16', name: 'Cinta Adhesiva 18 MM', category: 'OFICINA' },
  { id: 'off-17', name: 'Corrector', category: 'OFICINA' },
  { id: 'off-18', name: 'Tinta huellero', category: 'OFICINA' },
  { id: 'off-19', name: 'Tampón circular', category: 'OFICINA' },
  { id: 'off-20', name: 'Tijeras', category: 'OFICINA' },
  { id: 'off-22', name: 'Clips 1 Pulgada (Grandes)', category: 'OFICINA' },
  { id: 'off-21', name: 'Clips 33 MM (PEQUEÑOS)', category: 'OFICINA' },

  // ASEO
  { id: 'ase-1', name: 'Cloro Gel', category: 'ASEO' },
  { id: 'ase-2', name: 'Cloro Líquido', category: 'ASEO' },
  { id: 'ase-3', name: 'Jabón líquido', category: 'ASEO' },
  { id: 'ase-4', name: 'Bolsas 50x70', category: 'ASEO' },
  { id: 'ase-5', name: 'Bolsas 70x90', category: 'ASEO' },
  { id: 'ase-6', name: 'Bolsas 80x110', category: 'ASEO' },
  { id: 'ase-7', name: 'Bolsas Basureros', category: 'ASEO' },
  { id: 'ase-8', name: 'Trape. Micro. con ojal colores', category: 'ASEO' },
  { id: 'ase-9', name: 'Cif', category: 'ASEO' },
  { id: 'ase-10', name: 'Limpia Vidrios', category: 'ASEO' },
  { id: 'ase-new-1', name: 'Plumero', category: 'ASEO' },
  { id: 'ase-12', name: 'Desengrasante', category: 'ASEO' },
  { id: 'ase-13', name: 'Lavaloza', category: 'ASEO' },
  { id: 'ase-14', name: 'Limpiador de piso', category: 'ASEO' },
  { id: 'ase-15', name: 'Desinfectante ambiental 360 c/c', category: 'ASEO' },
  { id: 'ase-16', name: 'Esponja', category: 'ASEO' },
  { id: 'ase-17', name: 'Traperos Húmedos x 10 Uni.', category: 'ASEO' },
  { id: 'ase-18', name: 'Guante Látex amarillos cocina', category: 'ASEO' },
  { id: 'ase-19', name: 'Guante nitrilo Talla S', category: 'ASEO' },
  { id: 'ase-20', name: 'Guantes nitrilo Talla M', category: 'ASEO' },
  { id: 'ase-new-2', name: 'Guantes nitrilo Talla L', category: 'ASEO' },
  { id: 'ase-21', name: 'Esponja Abrasiva', category: 'ASEO' },
  { id: 'ase-22', name: 'Alcohol al 70%', category: 'ASEO' },
  { id: 'ase-23', name: 'Mascarillas', category: 'ASEO' },
  { id: 'ase-24', name: 'Pilas AA', category: 'ASEO' },
  { id: 'ase-25', name: 'Pilas AAA', category: 'ASEO' },
  { id: 'ase-11', name: 'Escoba', category: 'ASEO' },
  { id: 'ase-27', name: 'Pala', category: 'ASEO' },
  { id: 'ase-28', name: 'Detergente ropa', category: 'ASEO' },
  { id: 'ase-29', name: 'Suavizante ropa', category: 'ASEO' },
  { id: 'ase-30', name: 'Neutralizador', category: 'ASEO' },
  { id: 'ase-31', name: 'Pañuelos desechables', category: 'ASEO' },
  { id: 'ase-32', name: 'Pétalos', category: 'ASEO' },

  // COCINA
  { id: 'coc-1', name: 'Café 400 grs', category: 'COCINA' },
  { id: 'coc-2', name: 'Té', category: 'COCINA' },
  { id: 'coc-3', name: 'Azúcar', category: 'COCINA' },
  { id: 'coc-4', name: 'Endulzante', category: 'COCINA' },
  { id: 'coc-5', name: 'Te de hierbas', category: 'COCINA' },

  // PAPELERIA
  { id: 'pap-1', name: 'Interfoliado', category: 'PAPELERIA' },
  { id: 'pap-2', name: 'Toalla Papel Jumbo', category: 'PAPELERIA' },
  { id: 'pap-3', name: 'Sabanillas', category: 'PAPELERIA' },
  { id: 'pap-4', name: 'Papel higiénico 50 mts', category: 'PAPELERIA' },
  { id: 'pap-5', name: 'Toallitas desmaquillantes', category: 'PAPELERIA' },
  { id: 'pap-6', name: 'Papel higiénico Jumbo (dispensador)', category: 'PAPELERIA' },
];
