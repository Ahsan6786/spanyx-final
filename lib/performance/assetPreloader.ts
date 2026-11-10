/**
 * SPANYX Intelligent Asset Preloader
 *
 * Production-grade background asset preloading engine with:
 * - Idle-time network scheduling (requestIdleCallback)
 * - Concurrency control & queue priority
 * - Network sensing (Save-Data, 2G/3G backoff)
 * - Deduplication via in-memory URL registry
 * - Browser HTTP cache population via HTMLImageElement decoding="async"
 */

type PreloadPriority = 'high' | 'normal' | 'idle';

interface QueueItem {
  url: string;
  priority: PreloadPriority;
}

class IntelligentAssetPreloader {
  private preloadedUrls = new Set<string>();
  private inFlightUrls = new Set<string>();
  private highQueue: string[] = [];
  private normalQueue: string[] = [];
  private idleQueue: string[] = [];
  private activeDownloads = 0;
  private isProcessing = false;
  private isIdleScheduled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Warm up existing loaded images from the DOM so we never re-request them
      this.syncExistingDomImages();
    }
  }

  /**
   * Scan DOM for already-loaded or rendered images to prevent duplicate network calls
   */
  private syncExistingDomImages(): void {
    if (typeof document === 'undefined') return;
    try {
      const imgs = document.querySelectorAll('img');
      imgs.forEach((img) => {
        if (img.src) this.preloadedUrls.add(img.src);
        if (img.currentSrc) this.preloadedUrls.add(img.currentSrc);
      });
    } catch {}
  }

  /**
   * Determine max concurrent background downloads based on network conditions
   */
  private getMaxConcurrency(): number {
    if (typeof navigator === 'undefined') return 2;

    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    // Strict Save-Data enforcement
    if (conn?.saveData) return 0;

    // Slow 2G / 2G networks: single background request max
    if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') {
      return 1;
    }

    // 3G or constrained mobile connections: 2 concurrent
    if (conn?.effectiveType === '3g' || (typeof window !== 'undefined' && window.innerWidth < 768)) {
      return 2;
    }

    // Fast 4G / WiFi desktop: 3 concurrent
    return 3;
  }

  /**
   * Check if preloading should be skipped entirely (e.g. Save-Data mode)
   */
  public isNetworkConstrained(): boolean {
    if (typeof navigator === 'undefined') return false;
    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    return Boolean(conn?.saveData || conn?.effectiveType === 'slow-2g');
  }

  /**
   * Preload an individual image URL or array of URLs with priority
   */
  public preload(urls: string | string[], priority: PreloadPriority = 'normal'): void {
    if (typeof window === 'undefined') return;
    if (this.isNetworkConstrained() && priority === 'idle') return;

    const list = Array.isArray(urls) ? urls : [urls];

    list.forEach((url) => {
      if (!url || typeof url !== 'string') return;
      const cleanUrl = url.trim();
      if (!cleanUrl) return;

      // Skip already cached or in-flight assets
      if (this.preloadedUrls.has(cleanUrl) || this.inFlightUrls.has(cleanUrl)) {
        return;
      }

      if (priority === 'high') {
        if (!this.highQueue.includes(cleanUrl)) this.highQueue.push(cleanUrl);
      } else if (priority === 'normal') {
        if (!this.normalQueue.includes(cleanUrl)) this.normalQueue.push(cleanUrl);
      } else {
        if (!this.idleQueue.includes(cleanUrl)) this.idleQueue.push(cleanUrl);
      }
    });

    this.scheduleNext();
  }

  /**
   * Schedule next batch using requestIdleCallback with setTimeout fallback
   */
  private scheduleNext(): void {
    if (this.isProcessing || this.isIdleScheduled) return;

    const maxConcurrency = this.getMaxConcurrency();
    if (maxConcurrency <= 0) return;
    if (this.activeDownloads >= maxConcurrency) return;

    const hasItems =
      this.highQueue.length > 0 ||
      this.normalQueue.length > 0 ||
      this.idleQueue.length > 0;

    if (!hasItems) return;

    this.isIdleScheduled = true;

    const runner = (deadline?: any) => {
      this.isIdleScheduled = false;
      this.processQueue(deadline);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runner, { timeout: 400 });
    } else {
      setTimeout(() => runner(), 120);
    }
  }

  /**
   * Process items from highest to lowest priority
   */
  private processQueue(deadline?: { timeRemaining: () => number }): void {
    const maxConcurrency = this.getMaxConcurrency();
    if (maxConcurrency <= 0) return;

    this.isProcessing = true;

    try {
      while (this.activeDownloads < maxConcurrency) {
        // Stop if deadline budget is exhausted (only for normal/idle priority)
        if (
          deadline &&
          deadline.timeRemaining() < 5 &&
          this.highQueue.length === 0
        ) {
          break;
        }

        const nextUrl =
          this.highQueue.shift() ||
          this.normalQueue.shift() ||
          this.idleQueue.shift();

        if (!nextUrl) break;

        this.downloadAsset(nextUrl);
      }
    } finally {
      this.isProcessing = false;
    }

    const remaining =
      this.highQueue.length + this.normalQueue.length + this.idleQueue.length;
    if (remaining > 0 && this.activeDownloads < maxConcurrency) {
      this.scheduleNext();
    }
  }

  /**
   * Execute actual download via Image object to populate browser HTTP cache
   * and asynchronously decode bitmaps off the main thread before viewport arrival.
   */
  private downloadAsset(url: string): void {
    if (this.preloadedUrls.has(url) || this.inFlightUrls.has(url)) return;

    this.inFlightUrls.add(url);
    this.activeDownloads++;

    const img = new Image();
    img.decoding = 'async';
    if ('fetchPriority' in img) {
      (img as any).fetchPriority = 'low';
    }

    let isDone = false;
    const cleanup = () => {
      if (isDone) return;
      isDone = true;
      clearTimeout(watchdogTimer);
      this.inFlightUrls.delete(url);
      this.preloadedUrls.add(url);
      this.activeDownloads = Math.max(0, this.activeDownloads - 1);
      this.scheduleNext();
    };

    // Watchdog timer: release slot after 10s if network stalls
    const watchdogTimer = setTimeout(cleanup, 10000);

    const onComplete = () => {
      if ('decode' in img && typeof img.decode === 'function') {
        img.decode().then(cleanup).catch(cleanup);
      } else {
        cleanup();
      }
    };

    img.onload = onComplete;
    img.onerror = cleanup;

    // Trigger HTTP download
    img.src = url;
  }

  /**
   * Returns whether a given URL is already primed in cache
   */
  public has(url: string): boolean {
    return this.preloadedUrls.has(url);
  }

  /**
   * Debug stats
   */
  public getStats() {
    return {
      cachedCount: this.preloadedUrls.size,
      inFlightCount: this.inFlightUrls.size,
      queuedHigh: this.highQueue.length,
      queuedNormal: this.normalQueue.length,
      queuedIdle: this.idleQueue.length,
    };
  }
}

// Singleton global instance
export const assetPreloader = new IntelligentAssetPreloader();
