/**
 * Camera utilities for capturing and processing images
 */

export interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  /**
   * Request camera permission and start stream
   */
  async startCamera(videoElement: HTMLVideoElement, options: CameraOptions = {}): Promise<void> {
    const {
      facingMode = 'environment', // Back camera by default
      width = 1280,
      height = 720,
    } = options;

    try {
      this.videoElement = videoElement;

      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      });

      // Attach stream to video element
      videoElement.srcObject = this.stream;
      await videoElement.play();
    } catch (error) {
      console.error('Camera access error:', error);
      throw new Error('Unable to access camera. Please grant camera permissions.');
    }
  }

  /**
   * Stop camera stream and release resources
   */
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  /**
   * Capture photo from video stream as base64
   */
  capturePhoto(videoElement: HTMLVideoElement, quality: number = 0.8): string {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get canvas context');
    }

    // Draw video frame to canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    return canvas.toDataURL('image/jpeg', quality);
  }

  /**
   * Switch camera (front/back)
   */
  async switchCamera(videoElement: HTMLVideoElement): Promise<void> {
    const currentFacingMode = this.stream?.getVideoTracks()[0].getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    this.stopCamera();
    await this.startCamera(videoElement, { facingMode: newFacingMode });
  }

  /**
   * Check if device has camera
   */
  static async hasCameraAccess(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((device) => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  /**
   * Request camera permission
   */
  static async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image
 */
export const compressImage = (
  base64: string,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = reject;
    img.src = base64;
  });
};

export default CameraService;
