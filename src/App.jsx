import React, { useState } from 'react';
import { Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const ImageClassifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const classificationTypes = {
    dog: { color: '#e85d2f', label: 'Dog Breed', icon: '🐕' },
    car: { color: '#2563eb', label: 'Car Brand', icon: '🚗' },
    city: { color: '#f59e0b', label: 'City', icon: '🏙️' }
  };

    const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          mimeType: selectedImage.match(/^data:(.*?);/)?.[1] || 'image/jpeg'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Classification failed');
      }

      setResult(data);

    } catch (err) {
      setError('Failed to classify image. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAccentColor = () => {
    if (!result || result.type === 'unknown') return '#6b7280';
    return classificationTypes[result.type]?.color || '#6b7280';
  };

  const getTypeInfo = () => {
    if (!result || result.type === 'unknown') return null;
    return classificationTypes[result.type];
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Image Classifier</h1>
        <p style={styles.subtitle}>
          Upload an image and discover what's in it—dog breeds, car brands, or cities
        </p>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Upload Area */}
        <div style={styles.uploadSection}>
          <label style={{
            ...styles.uploadBox,
            borderColor: loading ? '#9ca3af' : selectedImage ? getAccentColor() : '#4b5563',
            backgroundColor: selectedImage ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={styles.fileInput}
              disabled={loading}
            />
            
            {selectedImage ? (
              <div style={styles.imagePreview}>
                <img src={selectedImage} alt="Selected" style={styles.previewImage} />
                <div style={{
                  ...styles.previewOverlay,
                  borderColor: getAccentColor()
                }} />
              </div>
            ) : (
              <div style={styles.uploadPrompt}>
                <Upload size={48} color="#9ca3af" />
                <p style={styles.uploadText}>Click to upload or drag and drop</p>
                <p style={styles.uploadSubtext}>PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </label>

          {selectedImage && (
            <button
              onClick={classifyImage}
              disabled={loading}
              style={{
                ...styles.classifyButton,
                backgroundColor: loading ? '#6b7280' : getAccentColor(),
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <div style={styles.loaderContainer}>
                  <Loader size={20} style={styles.spinner} />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Classify Image'
              )}
            </button>
          )}
        </div>

        {/* Results */}
        {result && result.type !== 'unknown' && (
          <div style={{
            ...styles.resultCard,
            borderColor: getAccentColor()
          }}>
            <div style={styles.resultHeader}>
              <div style={styles.resultType}>
                <span style={styles.typeIcon}>{getTypeInfo()?.icon}</span>
                <span style={{ color: getAccentColor(), fontWeight: '600' }}>
                  {getTypeInfo()?.label}
                </span>
              </div>
              <div style={{
                ...styles.confidenceBadge,
                backgroundColor: result.confidence === 'high' ? '#10b981' : 
                                result.confidence === 'medium' ? '#f59e0b' : '#ef4444',
                color: 'white'
              }}>
                {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} Confidence
              </div>
            </div>

            <h2 style={{
              ...styles.classification,
              color: getAccentColor()
            }}>
              {result.classification}
            </h2>

            <p style={styles.description}>
              {result.description}
            </p>

            <button
              onClick={() => {
                setSelectedImage(null);
                setResult(null);
              }}
              style={styles.resetButton}
            >
              Try Another Image
            </button>
          </div>
        )}

        {result && result.type === 'unknown' && (
          <div style={styles.errorCard}>
            <AlertCircle size={24} color="#ef4444" />
            <p style={styles.errorText}>
              Couldn't identify the image as a dog breed, car brand, or city. Try uploading a clearer image or one that better matches these categories.
            </p>
            <button
              onClick={() => {
                setSelectedImage(null);
                setResult(null);
              }}
              style={styles.resetButton}
            >
              Try Another Image
            </button>
          </div>
        )}

        {error && (
          <div style={styles.errorCard}>
            <AlertCircle size={24} color="#ef4444" />
            <p style={styles.errorText}>{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Powered by Gemini AI • Classifies dog breeds, car brands, and cities
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1f2e',
    color: '#e5e7eb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    marginTop: '1rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    margin: '0',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6'
  },
  content: {
    maxWidth: '700px',
    margin: '0 auto',
    flex: 1,
    width: '100%'
  },
  uploadSection: {
    marginBottom: '2rem'
  },
  uploadBox: {
    display: 'block',
    border: '2px dashed',
    borderRadius: '12px',
    padding: '2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  fileInput: {
    display: 'none'
  },
  imagePreview: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    maxHeight: '400px'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '2px solid',
    borderRadius: '8px',
    pointerEvents: 'none'
  },
  uploadPrompt: {
    padding: '2rem 1rem'
  },
  uploadText: {
    fontSize: '1rem',
    fontWeight: '500',
    margin: '1rem 0 0.5rem 0'
  },
  uploadSubtext: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0'
  },
  classifyButton: {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    transition: 'all 0.3s ease'
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem'
  },
  spinner: {
    animation: 'spin 1s linear infinite'
  },
  resultCard: {
    backgroundColor: '#262d3d',
    borderLeft: '4px solid',
    borderRadius: '8px',
    padding: '2rem',
    marginTop: '2rem',
    animation: 'slideUp 0.4s ease'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  resultType: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  typeIcon: {
    fontSize: '1.5rem'
  },
  confidenceBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  classification: {
    fontSize: '2rem',
    margin: '0 0 1rem 0',
    fontWeight: '700'
  },
  description: {
    color: '#d1d5db',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    fontSize: '0.95rem'
  },
  resetButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#374151',
    color: '#e5e7eb',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  errorCard: {
    backgroundColor: '#374151',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    padding: '1.5rem',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  errorText: {
    textAlign: 'center',
    margin: '0',
    color: '#f3f4f6'
  },
  footer: {
    textAlign: 'center',
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #374151'
  },
  footerText: {
    color: '#6b7280',
    fontSize: '0.875rem',
    margin: '0'
  }
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default ImageClassifier;