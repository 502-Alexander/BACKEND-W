// Middleware para manejar la subida de imágenes de productos
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Configurar almacenamiento en memoria
const storage = multer.memoryStorage();

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Verificar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Función para procesar y comprimir fotos de citas
const processCitaImage = async (buffer, filename) => {
  try {
    // Crear directorio si no existe
    const uploadDir = path.join(__dirname, '../uploads/citas');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generar nombre único para la foto
    const timestamp = Date.now();
    const baseName = path.parse(filename).name;
    const fotoName = `cita_${baseName}_${timestamp}.webp`;

    // Procesar imagen (optimizada para fotos de clientes)
    await sharp(buffer)
      .resize(600, 600, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toFile(path.join(uploadDir, fotoName));

    return `/uploads/citas/${fotoName}`;
  } catch (error) {
    console.error('Error procesando foto de cita:', error);
    throw error;
  }
};

// Función para procesar y comprimir imágenes
const processImage = async (buffer, filename, productId) => {
  try {
    // Crear directorio si no existe
    const uploadDir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generar nombres únicos para las imágenes
    const timestamp = Date.now();
    const baseName = path.parse(filename).name;
    const foto1Name = `${productId}_${baseName}_1_${timestamp}.webp`;
    const foto2Name = `${productId}_${baseName}_2_${timestamp}.webp`;

    // Procesar primera imagen (principal)
    await sharp(buffer)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 80 })
      .toFile(path.join(uploadDir, foto1Name));

    // Procesar segunda imagen (thumbnail)
    await sharp(buffer)
      .resize(400, 400, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 70 })
      .toFile(path.join(uploadDir, foto2Name));

    return {
      foto1: `/uploads/products/${foto1Name}`,
      foto2: `/uploads/products/${foto2Name}`
    };
  } catch (error) {
    console.error('Error procesando imagen:', error);
    throw error;
  }
};

// Middleware para subir imágenes
const uploadImages = upload.fields([
  { name: 'foto1', maxCount: 1 },
  { name: 'foto2', maxCount: 1 }
]);

// Middleware específico para fotos de citas (solo una foto)
const uploadCitaImage = upload.single('foto_cliente');

// Middleware para procesar foto de cita
const processCitaUploadedImage = async (req, res, next) => {
  try {
    if (req.file) {
      const fotoUrl = await processCitaImage(
        req.file.buffer,
        req.file.originalname
      );
      req.processedCitaImage = fotoUrl;
    }
    
    next();
  } catch (error) {
    console.error('Error procesando foto de cita:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error procesando foto de cita',
      error: error.message
    });
  }
};

// Middleware para procesar imágenes después de la subida
const processUploadedImages = async (req, res, next) => {
  try {
    if (req.files) {
      const processedImages = {};
      
      // Procesar foto1 si existe
      if (req.files.foto1 && req.files.foto1[0]) {
        const foto1Result = await processImage(
          req.files.foto1[0].buffer,
          req.files.foto1[0].originalname,
          req.body.producto_id || 'temp'
        );
        processedImages.foto1 = foto1Result.foto1;
      }

      // Procesar foto2 si existe
      if (req.files.foto2 && req.files.foto2[0]) {
        const foto2Result = await processImage(
          req.files.foto2[0].buffer,
          req.files.foto2[0].originalname,
          req.body.producto_id || 'temp'
        );
        processedImages.foto2 = foto2Result.foto2;
      }

      req.processedImages = processedImages;
    }
    
    next();
  } catch (error) {
    console.error('Error procesando imágenes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error procesando imágenes',
      error: error.message
    });
  }
};

export {

  uploadImages,
  processUploadedImages,
  processImage,
  uploadCitaImage,
  processCitaUploadedImage,
  processCitaImage

};
