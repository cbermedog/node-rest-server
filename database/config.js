const mongoose = require('mongoose');

const DbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ATLAS_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Base de datos online');
  } catch (error) {
    console.log(error);
    throw new error('Error al estblecer conecion con la base de datos');
  }
};

module.exports = {
  DbConnection,
};
