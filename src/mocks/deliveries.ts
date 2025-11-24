import type { Delivery } from '../types/api';

export const mockDeliveries: Delivery[] = [
  { ruta_id: 'ruta-001', vehiculo_id: 'VEH-001', estado: 'borrador', total_pedidos: 5, distancia_total_km: 15.5, duracion_total_minutos: 65, fecha_creacion: '2024-11-20T10:00:00Z', creado_por: 1 },
  { ruta_id: 'ruta-002', vehiculo_id: 'VEH-002', estado: 'en_curso', total_pedidos: 3, distancia_total_km: 22.3, duracion_total_minutos: 85, fecha_creacion: '2024-11-20T11:00:00Z', creado_por: 1 },
  { ruta_id: 'ruta-003', vehiculo_id: 'VEH-001', estado: 'completada', total_pedidos: 8, distancia_total_km: 45.2, duracion_total_minutos: 180, fecha_creacion: '2024-11-19T09:00:00Z', creado_por: 2 },
  { ruta_id: 'ruta-004', vehiculo_id: 'VEH-003', estado: 'borrador', total_pedidos: 4, distancia_total_km: 12.8, duracion_total_minutos: 50, fecha_creacion: '2024-11-20T14:00:00Z', creado_por: 1 },
  { ruta_id: 'ruta-005', vehiculo_id: 'VEH-002', estado: 'en_curso', total_pedidos: 6, distancia_total_km: 30.1, duracion_total_minutos: 120, fecha_creacion: '2024-11-20T08:00:00Z', creado_por: 2 },
  { ruta_id: 'ruta-006', vehiculo_id: 'VEH-004', estado: 'completada', total_pedidos: 7, distancia_total_km: 38.5, duracion_total_minutos: 150, fecha_creacion: '2024-11-19T13:00:00Z', creado_por: 1 },
  { ruta_id: 'ruta-007', vehiculo_id: 'VEH-001', estado: 'borrador', total_pedidos: 2, distancia_total_km: 8.9, duracion_total_minutos: 35, fecha_creacion: '2024-11-20T15:00:00Z', creado_por: 2 },
  { ruta_id: 'ruta-008', vehiculo_id: 'VEH-003', estado: 'en_curso', total_pedidos: 5, distancia_total_km: 25.6, duracion_total_minutos: 100, fecha_creacion: '2024-11-20T10:30:00Z', creado_por: 1 },
  { ruta_id: 'ruta-009', vehiculo_id: 'VEH-002', estado: 'completada', total_pedidos: 9, distancia_total_km: 52.3, duracion_total_minutos: 200, fecha_creacion: '2024-11-18T08:00:00Z', creado_por: 2 },
  { ruta_id: 'ruta-010', vehiculo_id: 'VEH-004', estado: 'borrador', total_pedidos: 3, distancia_total_km: 18.7, duracion_total_minutos: 75, fecha_creacion: '2024-11-20T12:00:00Z', creado_por: 1 },
];
