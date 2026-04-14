// Script para cargar productos de ejemplo en la base de datos
// Uso: node seed.js (dentro de la carpeta server/, con .env configurado)

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const productos = [
  {
    name: 'Shampoo pH Neutro 1L',
    description: 'Shampoo de alta espuma, pH neutro, ideal para no dañar la cera del auto.',
    category: 'shampoo',
    price: 3500,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80',
  },
  {
    name: 'Shampoo Citrus Desengrasante 500ml',
    description: 'Fórmula con extracto de limón para eliminar grasa y barro.',
    category: 'shampoo',
    price: 2800,
    stock: 15,
    imageUrl: '',
  },
  {
    name: 'Prelavado Snow Foam 1L',
    description: 'Espuma activa para prelavado sin contacto. Suaviza la suciedad antes del lavado.',
    category: 'prelavado',
    price: 4200,
    stock: 12,
    imageUrl: '',
  },
  {
    name: 'Prelavado Power Degreaser 500ml',
    description: 'Desengrasante concentrado para llantas y bajos del vehículo.',
    category: 'prelavado',
    price: 3100,
    stock: 0,
    imageUrl: '',
  },
  {
    name: 'Cera Carnauba Paste 200g',
    description: 'Cera de carnauba pura para máxima protección y brillo espejo.',
    category: 'cera',
    price: 7800,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    name: 'Sealant Sintético 6 meses',
    description: 'Sellante sintético de larga duración, resistente a lluvias y lavados.',
    category: 'cera',
    price: 9500,
    stock: 5,
    imageUrl: '',
  },
  {
    name: 'Pulidora Orbital Doble Acción 15mm',
    description: 'Pulidora profesional DA con orbita de 15mm, ideal para principiantes y pros.',
    category: 'pulidora',
    price: 85000,
    stock: 3,
    imageUrl: '',
  },
  {
    name: 'Pulidora Rotativa 1200W',
    description: 'Pulidora rotativa de alta potencia para correcciones profundas.',
    category: 'pulidora',
    price: 120000,
    stock: 2,
    imageUrl: '',
  },
  {
    name: 'Aspiradora Wet & Dry 20L',
    description: 'Aspiradora para sólidos y líquidos, perfecta para interior de vehículos.',
    category: 'aspiradora',
    price: 45000,
    stock: 4,
    imageUrl: '',
  },
  {
    name: 'Microfibra Plush 600GSM x5',
    description: 'Pack de 5 paños de microfibra ultra suaves de 600 GSM para secado y abrillantado.',
    category: 'microfibra',
    price: 5500,
    stock: 25,
    imageUrl: '',
  },
  {
    name: 'Barra de Arcilla Detailing Clay 200g',
    description: 'Arcilla decontaminante para removar adherencias del barniz de forma segura.',
    category: 'barro',
    price: 3800,
    stock: 10,
    imageUrl: '',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados');

    const inserted = await Product.insertMany(productos);
    console.log(`✅ ${inserted.length} productos insertados correctamente`);
  } catch (err) {
    console.error('❌ Error al hacer seed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

seed();
