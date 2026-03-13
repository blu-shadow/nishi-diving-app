/**
 * ╔══════════════════════════════════════════════════╗
 * ║         NISHI DIVING — DATABASE SEED             ║
 * ║  Run once:  node seed.js                         ║
 * ║  Location:  nishi-diving-app/backend/seed.js     ║
 * ╚══════════════════════════════════════════════════╝
 */

require('dotenv').config()
const mongoose    = require('mongoose')
const bcrypt      = require('bcryptjs')
const User        = require('./models/User')
const Service     = require('./models/Service')
const AppSettings = require('./models/AppSettings')

// ── Default admin credentials (change after first login!) ───────────────────
const ADMIN = {
  name:     'Nishi Admin',
  email:    'admin@nishidiving.com',
  password: 'Nishi@2024',
  role:     'admin',
}

// ── Default services ─────────────────────────────────────────────────────────
const SERVICES = [
  {
    name:        'Salvage Operations',
    description: 'Recovery of ships, cargo or property after maritime accidents such as grounding, sinking or collision. Our experienced teams operate throughout Bangladesh territorial waters.',
    icon:        '⚓',
    category:    'Marine',
    price:       'Contact for pricing',
    isActive:    true,
    order:       1,
  },
  {
    name:        'Offshore Operations',
    description: 'Underwater inspections, repairs and salvage support for offshore structures and vessels. We serve the oil & gas industry in Bangladesh.',
    icon:        '🛢️',
    category:    'Offshore',
    price:       'Contact for pricing',
    isActive:    true,
    order:       2,
  },
  {
    name:        'Propeller Repair & Polishing',
    description: 'Expert underwater propeller repairs, polishing and inspection services ensuring optimal vessel performance and minimizing dry-dock downtime.',
    icon:        '🔧',
    category:    'Repair',
    price:       'Contact for pricing',
    isActive:    true,
    order:       3,
  },
  {
    name:        'CCTV Class Inspection',
    description: 'High-quality underwater CCTV inspections to meet classification requirements and ensure vessel integrity. Approved by LR, BV, RINA, IRS, KR, ABS and DNV.',
    icon:        '📷',
    category:    'Inspection',
    price:       'Contact for pricing',
    isActive:    true,
    order:       4,
  },
  {
    name:        'Underwater Welding & Cutting',
    description: 'Professional underwater welding and cutting for structural repairs, maintenance and marine asset restoration. Certified welders with international standards.',
    icon:        '⚡',
    category:    'Repair',
    price:       'Contact for pricing',
    isActive:    true,
    order:       5,
  },
  {
    name:        'ICCP Replacement',
    description: 'Impressed Current Cathodic Protection system replacement to protect vessels and offshore structures from corrosion and extend their operational service life.',
    icon:        '🔋',
    category:    'Repair',
    price:       'Contact for pricing',
    isActive:    true,
    order:       6,
  },
  {
    name:        'UWILD Inspection',
    description: 'Underwater Inspection in Lieu of Dry-Docking (UWILD). Save time and money with our in-water surveys. Approved by LR, BV, RINA, IRS, KR, ABS and DNV.',
    icon:        '🔍',
    category:    'Inspection',
    price:       'Contact for pricing',
    isActive:    true,
    order:       7,
  },
  {
    name:        'Blanking, Plugging & Cofferdam',
    description: 'Professional blanking, plugging and cofferdam installation services for underwater repairs without dry-docking. Safe and efficient solutions.',
    icon:        '🛡️',
    category:    'Marine',
    price:       'Contact for pricing',
    isActive:    true,
    order:       8,
  },
  {
    name:        'River Training Works',
    description: 'River training and hydraulic engineering services across Bangladesh. Bank protection, dredging support and river management solutions.',
    icon:        '🌊',
    category:    'Marine',
    price:       'Contact for pricing',
    isActive:    true,
    order:       9,
  },
  {
    name:        'Recreational Scuba Diving',
    description: 'Recreational scuba diving experiences at Cox\'s Bazar, Saint Martin Island and Kaptai Lake. Guided tours for beginners and experienced divers.',
    icon:        '🤿',
    category:    'Recreation',
    price:       'Contact for pricing',
    isActive:    true,
    order:       10,
  },
  {
    name:        'Underwater Welding Course',
    description: 'Professional Underwater Welding & Cutting training course. Get certified with hands-on training from our expert instructors. Limited seats available.',
    icon:        '🎓',
    category:    'Training',
    price:       'Contact for pricing',
    isActive:    true,
    order:       11,
  },
]

// ── Default app settings ──────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  appName:   'Nishi Diving',
  aboutText: 'Nishi Salvage & Diving is a Commercial Diving Company based in Chattogram, Bangladesh. We provide a wide variety of diving services, Salvage Service and Ship and Offshore Structure Repair, Fabrication and Modification Services. We are strategically positioned at Chittagong Port to serve all major ports in Bangladesh.',
  devNote:   'Built with ❤️ for Nishi Salvage & Diving. For technical support contact the developer.',
  helpText:  'For any inquiries or emergency support, please contact us via phone or WhatsApp. Our team is available 24/7 for urgent matters.',
  whatsapp:  '+8801712202165',
  phone:     '+8801712202165',
  phone2:    '+8801772511076',
  email:     'nishidiving@gmail.com',
  email2:    'office@nishidiving.com',
  address:   'Nishi House, Uttor Agrabad, Muhuri Para, Chattogram',
  facebook:  'https://www.facebook.com/profile.php?id=100090424453177',
}

// ── Main seed function ────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Starting Nishi Diving database seed...\n')

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected\n')

    // ── 1. Admin user ───────────────────────────────────────────────────────
    const existingAdmin = await User.findOne({ email: ADMIN.email })
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists — skipping')
    } else {
      await User.create(ADMIN)
      console.log('✅ Admin user created')
      console.log(`   📧 Email:    ${ADMIN.email}`)
      console.log(`   🔑 Password: ${ADMIN.password}`)
      console.log('   ⚠️  Please change the password after first login!\n')
    }

    // ── 2. Services ─────────────────────────────────────────────────────────
    const existingServices = await Service.countDocuments()
    if (existingServices > 0) {
      console.log(`ℹ️  Services already exist (${existingServices} found) — skipping`)
    } else {
      await Service.insertMany(SERVICES)
      console.log(`✅ ${SERVICES.length} default services created\n`)
      SERVICES.forEach(s => console.log(`   ${s.icon}  ${s.name}`))
      console.log()
    }

    // ── 3. App settings ─────────────────────────────────────────────────────
    const existingSettings = await AppSettings.findOne()
    if (existingSettings) {
      console.log('ℹ️  App settings already exist — skipping')
    } else {
      await AppSettings.create(DEFAULT_SETTINGS)
      console.log('✅ Default app settings created\n')
    }

    console.log('\n🎉 Seed completed successfully!')
    console.log('━'.repeat(50))
    console.log('🚀 You can now run:  node server.js')
    console.log('🌐 Admin login:     http://localhost:5173/login')
    console.log(`📧 Email:           ${ADMIN.email}`)
    console.log(`🔑 Password:        ${ADMIN.password}`)
    console.log('━'.repeat(50) + '\n')

  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
