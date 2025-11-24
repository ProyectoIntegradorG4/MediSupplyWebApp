import type { SalesPlan } from '../types/api';

export const mockSalesPlans: SalesPlan[] = [
  { planId: '123', nombre: 'Plan 1', periodo: { desde: '2021-01-01', hasta: '2021-03-31' }, estado: 'Completado', territorios_count: 5, metas_count: 10000, actualizado_en: '2021-03-31T00:00:00Z' },
  { planId: '234', nombre: 'Plan 2', periodo: { desde: '2021-04-01', hasta: '2021-06-30' }, estado: 'Completado', territorios_count: 4, metas_count: 9000, actualizado_en: '2021-06-30T00:00:00Z' },
  { planId: '345', nombre: 'Plan 3', periodo: { desde: '2021-07-01', hasta: '2021-09-30' }, estado: 'Completado', territorios_count: 6, metas_count: 12000, actualizado_en: '2021-09-30T00:00:00Z' },
  { planId: '456', nombre: 'Plan 4', periodo: { desde: '2024-07-01', hasta: '2024-09-30' }, estado: 'Completado', territorios_count: 7, metas_count: 18000, actualizado_en: '2024-09-30T00:00:00Z' },
  { planId: '567', nombre: 'Plan 5', periodo: { desde: '2023-07-01', hasta: '2023-09-30' }, estado: 'Completado', territorios_count: 5, metas_count: 12000, actualizado_en: '2023-09-30T00:00:00Z' },
  { planId: '678', nombre: 'Plan 6', periodo: { desde: '2023-07-01', hasta: '2023-09-30' }, estado: 'Completado', territorios_count: 6, metas_count: 14000, actualizado_en: '2023-09-30T00:00:00Z' },
  { planId: '789', nombre: 'Plan 7', periodo: { desde: '2024-01-01', hasta: '2024-03-31' }, estado: 'En Curso', territorios_count: 4, metas_count: 8500, actualizado_en: '2024-03-31T00:00:00Z' },
  { planId: '890', nombre: 'Plan 8', periodo: { desde: '2025-07-01', hasta: '2025-09-30' }, estado: 'En Curso', territorios_count: 5, metas_count: 10500, actualizado_en: '2025-09-30T00:00:00Z' },
];
