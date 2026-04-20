'use strict';
// lugares reales de Rosario, Santa Fe — reemplaza los datos genéricos anteriores
// imágenes seleccionadas por temática específica: gastronomía premium, arquitectura, Paraná, etc.
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // limpia los lugares genéricos del seeder anterior antes de insertar los de Rosario
    await queryInterface.bulkDelete('Place_Products', null, {});

    await queryInterface.bulkInsert('Place_Products', [
      {
        name: 'Monumento a la Bandera',
        description: 'Imponente monumento nacional sobre la costanera del río Paraná, en el sitio donde Manuel Belgrano izó la bandera argentina por primera vez. Vista panorámica inigualable.',
        location: 'Av. Belgrano y Buenos Aires, Rosario',
        categoryId: 2,
        image: 'https://images.unsplash.com/photo-1568379397301-6b3d34ec5868?w=800&q=80',
        average_rating: 4.9,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Costanera Central Rosario',
        description: 'El paseo ribereño más largo de Argentina. Playas urbanas sobre el Paraná, senderos para correr, food trucks y espectaculares atardeceres frente al río.',
        location: 'Av. Belgrano, Costanera, Rosario',
        categoryId: 4,
        image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
        average_rating: 4.8,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Bar El Cairo',
        description: 'El bar de Ernesto "Che" Guevara y Roberto Fontanarrosa. Ambiente porteño clásico, billar histórico y los mejores vermuts de Rosario desde 1943.',
        location: 'Santa Fe 1000, Rosario',
        categoryId: 3,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
        average_rating: 4.7,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Mercado del Patio',
        description: 'Mercado gourmet en el histórico Pasaje Juramento. Productores locales, quesos artesanales, vinos de autor y la mejor empanada rosarina.',
        location: 'Pasaje Juramento 1200, Rosario',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        average_rating: 4.6,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Parque Independencia',
        description: 'El pulmón verde de Rosario: 120 hectáreas con el Museo Histórico Provincial, el estadio Gigante de Arroyito, una laguna y rosaledas centenarias.',
        location: 'Bv. Oroño y Av. Pellegrini, Rosario',
        categoryId: 4,
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=800&q=80',
        average_rating: 4.7,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Museo Castagnino',
        description: 'El principal museo de bellas artes de la ciudad. Colección permanente con obras de Berni, Quinquela Martín y artistas europeos del siglo XIX en un palacio neoclásico.',
        location: 'Av. Pellegrini 2202, Rosario',
        categoryId: 2,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        average_rating: 4.5,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Puerto Norte — Distrito Portuario',
        description: 'El barrio más moderno de Rosario, sobre las antiguas instalaciones portuarias. Torres de vidrio, restaurantes de autor y vistas al Paraná desde las terrazas.',
        location: 'Av. de los Inmigrantes, Puerto Norte, Rosario',
        categoryId: 7,
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
        average_rating: 4.4,
        createdAt: now, updatedAt: now
      },
      {
        name: 'La Estancia Parrilla',
        description: 'El asado rosarino en su máxima expresión. Cortes premium de Angus a las brasas, chimichurri de la casa y bodega con más de 200 etiquetas argentinas.',
        location: 'San Lorenzo 1050, Rosario',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        average_rating: 4.8,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Hotel Pullman Rosario',
        description: 'El hotel de lujo más emblemático del centro. Piscina en el piso 11 con vista al Paraná, spa de clase mundial y el restaurante Brasa & Co.',
        location: 'San Luis 1955, Rosario',
        categoryId: 5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        average_rating: 4.9,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Café de la Ópera',
        description: 'Café histórico frente al teatro El Círculo. Especialidades de origen único, tostadas artesanales y el desayuno más elegante de Rosario en un ambiente art nouveau.',
        location: 'Laprida 1253, Rosario',
        categoryId: 6,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        average_rating: 4.6,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Teatro El Círculo',
        description: 'El teatro lírico más importante del interior de Argentina. Inaugurado en 1904, su arquitectura italianizante y su acústica excepcional lo hacen único en Sudamérica.',
        location: 'Laprida 1223, Rosario',
        categoryId: 8,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        average_rating: 4.8,
        createdAt: now, updatedAt: now
      },
      {
        name: 'Complejo Astronómico Municipal',
        description: 'El segundo observatorio más importante de Argentina. Noches de astronomía con el telescopio Zeiss, planetario digital y vistas del skyline rosarino desde la cúpula.',
        location: 'Av. Wheelwright 1100, Rosario',
        categoryId: 2,
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
        average_rating: 4.5,
        createdAt: now, updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Place_Products', null, {});
  }
};
