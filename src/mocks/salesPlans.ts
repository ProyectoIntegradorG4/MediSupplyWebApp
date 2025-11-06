import type { SalesPlan } from '../types/api';

export const mockSalesPlans: SalesPlan[] = [
  { id: 123, nombre: 'Plan 1', periodo: '2021-1', estado: 'Completado', cantidad: 10000 },
  { id: 234, nombre: 'Plan 2', periodo: '2021-2', estado: 'Completado', cantidad: 9000 },
  { id: 345, nombre: 'Plan 3', periodo: '2021-3', estado: 'Completado', cantidad: 12000 },
  { id: 456, nombre: 'Plan 4', periodo: '2024-3', estado: 'Completado', cantidad: 18000 },
  { id: 567, nombre: 'Plan 5', periodo: '2023-3', estado: 'Completado', cantidad: 12000 },
  { id: 678, nombre: 'Plan 6', periodo: '2023-3', estado: 'Completado', cantidad: 14000 },
  { id: 789, nombre: 'Plan 7', periodo: '2024-1', estado: 'En Curso', cantidad: 8500 },
  { id: 890, nombre: 'Plan 8', periodo: '2025-3', estado: 'En Curso', cantidad: 10500 },
];
