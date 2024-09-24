export const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 800; // Max width untuk gambar
        const MAX_HEIGHT = 800; // Max height untuk gambar
        let width = img.width;
        let height = img.height;
  
        // Skala gambar
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
  
        // Menghasilkan base64 dari canvas
        const compressedBase64 = canvas.toDataURL(); // Tanpa menentukan format, mempertahankan format asli
        resolve(compressedBase64);
      };
    });
  };
  