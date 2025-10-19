import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ productId, onImagesUploaded }) => {
  const [images, setImages] = useState({
    foto1: null,
    foto2: null
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState({
    foto1: null,
    foto2: null
  });

  // Manejar selección de archivos
  const handleFileChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      setImages(prev => ({
        ...prev,
        [imageType]: file
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(prev => ({
          ...prev,
          [imageType]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Subir imágenes
  const handleUpload = async () => {
    if (!images.foto1 && !images.foto2) {
      alert('Por favor selecciona al menos una imagen');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      
      if (images.foto1) {
        formData.append('foto1', images.foto1);
      }
      if (images.foto2) {
        formData.append('foto2', images.foto2);
      }

      const response = await fetch(`http://localhost:4000/api/upload/producto/${productId}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Imágenes subidas exitosamente');
        if (onImagesUploaded) {
          onImagesUploaded(result.data.imagenes);
        }
        // Limpiar formulario
        setImages({ foto1: null, foto2: null });
        setPreview({ foto1: null, foto2: null });
      } else {
        alert('Error al subir imágenes: ' + result.mensaje);
      }
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('Error al subir imágenes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Subir Imágenes del Producto</h3>
      
      <div className="upload-section">
        <div className="image-upload-item">
          <label htmlFor="foto1">Imagen Principal:</label>
          <input
            type="file"
            id="foto1"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'foto1')}
            disabled={uploading}
          />
          {preview.foto1 && (
            <div className="image-preview">
              <img src={preview.foto1} alt="Preview foto1" />
              <p>Archivo: {images.foto1?.name}</p>
              <p>Tamaño: {(images.foto1?.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        <div className="image-upload-item">
          <label htmlFor="foto2">Imagen Secundaria:</label>
          <input
            type="file"
            id="foto2"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'foto2')}
            disabled={uploading}
          />
          {preview.foto2 && (
            <div className="image-preview">
              <img src={preview.foto2} alt="Preview foto2" />
              <p>Archivo: {images.foto2?.name}</p>
              <p>Tamaño: {(images.foto2?.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleUpload} 
        disabled={uploading || (!images.foto1 && !images.foto2)}
        className="upload-button"
      >
        {uploading ? 'Subiendo...' : 'Subir Imágenes'}
      </button>

      <div className="upload-info">
        <p><strong>Información:</strong></p>
        <ul>
          <li>Formatos aceptados: JPG, PNG, WEBP</li>
          <li>Tamaño máximo: 5MB por imagen</li>
          <li>Las imágenes se comprimirán automáticamente</li>
          <li>Se generarán dos versiones: principal (800x800) y thumbnail (400x400)</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
