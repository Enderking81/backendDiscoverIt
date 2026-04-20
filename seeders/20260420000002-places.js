'use strict';
// datos de ejemplo para poblar la tabla Place_Products en desarrollo
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Place_Products', [
      {
        name: 'Café Palermo',
        description: 'Café de especialidad con ambiente cálido y música en vivo los fines de semana.',
        location: 'Thames 1820, Palermo, Buenos Aires',
        categoryId: 6,
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
        average_rating: 4.8,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Museo Nacional de Bellas Artes',
        description: 'Colección permanente de arte argentino e internacional desde el siglo XVIII.',
        location: 'Av. del Libertador 1473, Recoleta, Buenos Aires',
        categoryId: 2,
        image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80',
        average_rating: 4.6,
        createdAt: now, updatedAt: now
      },
      {
        name: 'La Parrilla del Sur',
        description: 'Asado tradicional argentino con cortes premium y bodega curada.',
        location: 'Av. San Juan 340, San Telmo, Buenos Aires',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        average_rating: 4.9,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Parque Tres de Febrero',
        description: 'Pulmón verde de la ciudad con lago artificial, rosedal y senderos para correr.',
        location: 'Av. Infanta Isabel s/n, Palermo, Buenos Aires',
        categoryId: 4,
        image: 'https://images.unsplash.com/photo-1563293813-9f9a5fe7e7a6?w=800&q=80',
        average_rating: 4.7,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Bar Federal',
        description: 'Bar histórico de San Telmo fundado en 1864. Tragos clásicos y ambiente bohemio.',
        location: 'Carlos Calvo 599, San Telmo, Buenos Aires',
        categoryId: 3,
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
        average_rating: 4.5,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Hotel Alvear Palace',
        description: 'Hotel 5 estrellas inaugurado en 1932. Lujo clásico europeo en el corazón de Recoleta.',
        location: 'Av. Alvear 1891, Recoleta, Buenos Aires',
        categoryId: 5,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        average_rating: 4.9,
        createdAt: now, updatedAt: now
      },
      {
        name: 'El Ateneo Grand Splendid',
        description: 'Librería icónica dentro de un teatro ópera del 1919. Considerada una de las más bellas del mundo.',
        location: 'Av. Santa Fe 1860, Recoleta, Buenos Aires',
        categoryId: 7,
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
        average_rating: 4.8,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Teatro Colón',
        description: 'Uno de los teatros de ópera más importantes del mundo. Acústica perfecta y arquitectura imponente.',
        location: 'Cerrito 628, Centro, Buenos Aires',
        categoryId: 8,
        image: 'https://images.unsplash.com/photo-1568379397301-6b3d34ec5868?w=800&q=80',
        average_rating: 5.0,
        createdAt: now, updatedAt: now
      }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Place_Products', null, {});
  }
};
