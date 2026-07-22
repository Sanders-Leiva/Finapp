/**
 * Utilidad para disparar vibraciones hápticas en dispositivos móviles.
 * Verifica si la API navigator.vibrate está disponible.
 */

export const hapticFeedback = {
  // Vibración ligera para interacciones pequeñas (clicks en botones, tabs)
  light: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  
  // Vibración media para acciones principales (Añadir transacción, Guardar)
  medium: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },
  
  // Vibración fuerte o patrón para alertas, errores o acciones destructivas (Borrar)
  heavy: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  },
  
  // Patrón de éxito
  success: () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  }
};
