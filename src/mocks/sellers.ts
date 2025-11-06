import type { User } from '../types/api';

export const mockSellers: User[] = [
  { id: 123, nombre: 'Fernando Torres', pais: 'España', metaDeVentas: 15000, rendimiento: '50%' },
  { id: 234, nombre: 'Maximiliano Rodríguez', pais: 'Argentina', metaDeVentas: 12300, rendimiento: '10%' },
  { id: 345, nombre: 'Luis Díaz', pais: 'Colombia', metaDeVentas: 55000, rendimiento: '23%' },
  { id: 456, nombre: 'José Reina', pais: 'España', metaDeVentas: 55000, rendimiento: '59%' },
  { id: 567, nombre: 'Luis Suárez', pais: 'Uruguay', metaDeVentas: 69000, rendimiento: '33%' },
  { id: 678, nombre: 'José Enrique', pais: 'España', metaDeVentas: 87000, rendimiento: '76%' },
  { id: 789, nombre: 'Sebastián Coates', pais: 'Uruguay', metaDeVentas: 9300, rendimiento: '42%' },
  { id: 890, nombre: 'Darwin Núñez', pais: 'Uruguay', metaDeVentas: 110000, rendimiento: '80%' },
];
