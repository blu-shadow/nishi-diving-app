const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
  appName:   { type: String, default: 'Nishi Diving' },
  logo:      { type: String, default: '' },
  aboutText: { type: String, default: 'Nishi Salvage & Diving is a Commercial Diving Company in Bangladesh.' },
  devNote:   { type: String, default: 'Built with ❤️ for Nishi Diving' },
  helpText:  { type: String, default: 'Contact us for any help or queries.' },
  whatsapp:  { type: String, default: '+8801712202165' },
  phone:     { type: String, default: '+8801712202165' },
  phone2:    { type: String, default: '+8801772511076' },
  email:     { type: String, default: 'nishidiving@gmail.com' },
  email2:    { type: String, default: 'office@nishidiving.com' },
  address:   { type: String, default: 'Nishi House, Uttor Agrabad, Muhuri Para, Chattogram' },
  facebook:  { type: String, default: 'https://www.facebook.com/profile.php?id=100090424453177' }
}, { timestamps: true });

module.exports = mongoose.model('AppSettings', appSettingsSchema);
