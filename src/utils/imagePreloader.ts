
class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  preloadImage(src: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src)!);
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Start loading the image
    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Add size optimization parameters
      const optimizedSrc = this.addOptimizationParams(src);
      img.src = optimizedSrc;
    });

    this.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }

  private addOptimizationParams(src: string): string {
    // For local images, return as-is
    if (src.startsWith('/')) {
      return src;
    }
    
    // Add optimization parameters for external images
    const url = new URL(src);
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('w', '248');
    url.searchParams.set('h', '331');
    url.searchParams.set('q', '85');
    return url.toString();
  }

  preloadMultiple(sources: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(sources.map(src => this.preloadImage(src)));
  }

  getCachedImage(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export const imagePreloader = new ImagePreloader();
