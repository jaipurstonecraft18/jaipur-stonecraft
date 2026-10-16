"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import styles from "./MobileImageStudio.module.css";

const WATERMARK_SVG_URL = "/images/brand/jaipur-stonecraft-watermark.svg";

/**
 * Normalizes watermark geometry relative to the crop dimensions.
 * Both preview and final high-res canvas share this exact mathematical model.
 */
function getWatermarkNormDims(sizePercent, logoRatio, cropAspect) {
  const normW = Math.max(0.08, Math.min(0.9, sizePercent / 100));
  const normH = cropAspect > 0 && logoRatio > 0 ? (normW * cropAspect) / logoRatio : normW / (logoRatio || 4.28);
  return { normW, normH };
}

/**
 * Calculates preset watermark coordinates given the active aspect ratio and watermark size.
 */
function getPresetWatermarkCoords(pos, sizePercent, logoRatio, cropAspect, margin = 0.04) {
  const { normW, normH } = getWatermarkNormDims(sizePercent, logoRatio, cropAspect);
  const maxX = Math.max(0, 1 - normW - margin);
  const maxY = Math.max(0, 1 - normH - margin);

  switch (pos) {
    case "top-left":
      return { x: margin, y: margin };
    case "top-right":
      return { x: maxX, y: margin };
    case "bottom-left":
      return { x: margin, y: maxY };
    case "bottom-right":
      return { x: maxX, y: maxY };
    case "center":
      return {
        x: Math.max(0, (1 - normW) / 2),
        y: Math.max(0, (1 - normH) / 2)
      };
    default:
      return { x: maxX, y: maxY };
  }
}

/**
 * Jaipur Stonecraft — Mobile-First Product Image Studio
 * Production repair: Watermark Coordinate Drift, Cropper Gestures, and Mobile Cropping.
 */
export default function MobileImageStudio({
  file,
  imageIndex = 0,
  totalImages = 1,
  initialMetadata = null,
  onSave,
  onSkip,
  onCancel
}) {
  const imageElementRef = useRef(null);
  const cropperRef = useRef(null);
  const containerRef = useRef(null);
  const sourceImgRef = useRef(null);
  const watermarkImgRef = useRef(null);
  const customWatermarkImgRef = useRef(null);
  const customWatermarkInputRef = useRef(null);

  // Active Tool Tab: 'crop' | 'adjust' | 'watermark'
  const [activeTab, setActiveTab] = useState("crop");

  // Image Source state (Data URL or URL string)
  const [imageSrc, setImageSrc] = useState(() => (typeof file === "string" ? file : null));

  // Editing Parameters State
  const [cropMode, setCropMode] = useState(initialMetadata?.crop?.mode || "1:1"); // '1:1' | '4:3' | 'free' | 'fit'
  const [currentZoom, setCurrentZoom] = useState(1.0);

  // Color adjustments [-40 to 40]
  const [brightness, setBrightness] = useState(initialMetadata?.adjustments?.brightness || 0);
  const [contrast, setContrast] = useState(initialMetadata?.adjustments?.contrast || 0);
  const [saturation, setSaturation] = useState(initialMetadata?.adjustments?.saturation || 0);

  // Watermark parameters
  const [watermarkEnabled, setWatermarkEnabled] = useState(initialMetadata?.watermark?.applied ?? true);
  const [watermarkSource, setWatermarkSource] = useState(initialMetadata?.watermark?.source || "official"); // 'official' | 'custom'
  const [customWatermarkInfo, setCustomWatermarkInfo] = useState(null); // { name, dataUrl }
  const [watermarkPos, setWatermarkPos] = useState(initialMetadata?.watermark?.position || "bottom-right");
  const [watermarkCoord, setWatermarkCoord] = useState(initialMetadata?.watermark?.coord || { x: 0.64, y: 0.88 });
  const [watermarkSizePercent, setWatermarkSizePercent] = useState(initialMetadata?.watermark?.sizePercent || 30); // 8% to 90% of crop width
  const [watermarkOpacity, setWatermarkOpacity] = useState(initialMetadata?.watermark?.opacity ?? 0.85); // 0.1 to 1.0

  // Real-time Crop Box Tracking (CSS pixels from Cropper.js)
  const [cropBoxData, setCropBoxData] = useState(null); // { left, top, width, height }
  const [officialLogoRatio, setOfficialLogoRatio] = useState(1200 / 280);
  const [customLogoRatio, setCustomLogoRatio] = useState(null);

  // Processing & Loading State
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Watermark Interaction State (Drag & 2-Finger Pinch)
  const wmDragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initCoord: { x: 0, y: 0 }
  });

  const wmPinchStateRef = useRef({
    isPinching: false,
    initialDist: 0,
    initialSize: 30
  });

  // ---------------------------------------------------------------------------
  // 1. Load File Data safely with FileReader (immune to URL revocation issues)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!file || typeof file === "string") return;

    let isMounted = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isMounted && e.target?.result) {
        setImageSrc(e.target.result);
      }
    };
    reader.onerror = (err) => {
      console.error("[MobileImageStudio] FileReader error:", err);
    };
    reader.readAsDataURL(file);

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Load official watermark asset
  useEffect(() => {
    const wmImg = new Image();
    wmImg.onload = () => {
      watermarkImgRef.current = wmImg;
      setOfficialLogoRatio((wmImg.naturalWidth || 1200) / (wmImg.naturalHeight || 280));
    };
    wmImg.src = WATERMARK_SVG_URL;
  }, []);

  // Restore custom watermark from sessionStorage if previously uploaded
  useEffect(() => {
    try {
      const savedWm = sessionStorage.getItem("jsc_custom_watermark_data");
      const savedName = sessionStorage.getItem("jsc_custom_watermark_name");
      if (savedWm) {
        const cImg = new Image();
        cImg.onload = () => {
          customWatermarkImgRef.current = cImg;
          setCustomLogoRatio((cImg.naturalWidth || 1200) / (cImg.naturalHeight || 280));
          setCustomWatermarkInfo({ name: savedName || "custom-watermark.png", dataUrl: savedWm });
          setWatermarkSource("custom");
        };
        cImg.src = savedWm;
      }
    } catch {}
  }, []);

  const handleCustomWatermarkUpload = (e) => {
    const customFile = e.target.files?.[0];
    if (!customFile) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      const cImg = new Image();
      cImg.onload = () => {
        customWatermarkImgRef.current = cImg;
        setCustomLogoRatio((cImg.naturalWidth || 1200) / (cImg.naturalHeight || 280));
        setCustomWatermarkInfo({ name: customFile.name, dataUrl });
        setWatermarkSource("custom");
        setWatermarkEnabled(true);
        setHasUnsavedChanges(true);
        try {
          sessionStorage.setItem("jsc_custom_watermark_data", dataUrl);
          sessionStorage.setItem("jsc_custom_watermark_name", customFile.name);
        } catch {}
      };
      cImg.src = dataUrl;
    };
    reader.readAsDataURL(customFile);
    if (customWatermarkInputRef.current) customWatermarkInputRef.current.value = "";
  };

  // ---------------------------------------------------------------------------
  // 2. Initialize Cropper.js when Image Element Finishes Loading in DOM
  // ---------------------------------------------------------------------------
  const handleImageLoaded = () => {
    const imgEl = imageElementRef.current;
    if (!imgEl) return;

    sourceImgRef.current = imgEl;

    if (cropperRef.current) {
      cropperRef.current.destroy();
    }

    let initialAspectRatio = 1.0;
    if (cropMode === "4:3") initialAspectRatio = 3 / 4;
    else if (cropMode === "free") initialAspectRatio = NaN;
    else if (cropMode === "fit") {
      const nw = imgEl.naturalWidth || 1;
      const nh = imgEl.naturalHeight || 1;
      initialAspectRatio = nw / nh;
    }

    const cropper = new Cropper(imgEl, {
      viewMode: 1, // Restrict crop box to not exceed the boundaries of the image
      dragMode: "move", // Allow panning the image directly with 1 finger/mouse
      aspectRatio: initialAspectRatio,
      autoCropArea: 0.85,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      checkOrientation: true,
      responsive: true,
      background: false,
      minContainerWidth: 260,
      minContainerHeight: 260,
      ready() {
        const box = cropper.getCropBoxData();
        setCropBoxData(box);
        setIsReady(true);

        // If reopening with existing metadata, restore crop rect
        if (initialMetadata?.crop) {
          const c = initialMetadata.crop;
          if (c.width && c.height) {
            cropper.setData({
              x: c.x,
              y: c.y,
              width: c.width,
              height: c.height
            });
            setCropBoxData(cropper.getCropBoxData());
          }
        }
      },
      crop() {
        setCropBoxData(cropper.getCropBoxData());
      },
      zoom(event) {
        if (event.detail && typeof event.detail.ratio === "number") {
          setCurrentZoom(Math.max(0.5, Math.min(3.0, event.detail.ratio)));
        }
      }
    });

    cropperRef.current = cropper;
  };

  // Cleanup cropper on unmount
  useEffect(() => {
    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, []);

  // Apply CSS Color Filters to Cropper preview in real-time
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = 100 + saturation;
    const filterStr = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;

    const images = container.querySelectorAll(".cropper-wrap-box img, .cropper-view-box img");
    images.forEach((im) => {
      im.style.filter = filterStr;
    });
  }, [brightness, contrast, saturation, isReady, cropBoxData]);

  // Active logo aspect ratio from state
  const activeLogoAspectRatio = (watermarkSource === "custom" && customLogoRatio)
    ? customLogoRatio
    : officialLogoRatio;

  // Compute current crop box aspect ratio (width / height)
  const currentCropAspect = useMemo(() => {
    if (!cropBoxData || cropBoxData.height <= 0) return 1.0;
    return cropBoxData.width / cropBoxData.height;
  }, [cropBoxData]);

  // Compute normalized watermark dimensions and clamped coordinates
  const { normW, normH, clampedCoord } = useMemo(() => {
    const { normW: nw, normH: nh } = getWatermarkNormDims(
      watermarkSizePercent,
      activeLogoAspectRatio,
      currentCropAspect
    );
    const maxX = Math.max(0, 1 - nw);
    const maxY = Math.max(0, 1 - nh);
    const clampedX = Math.max(0, Math.min(maxX, watermarkCoord.x));
    const clampedY = Math.max(0, Math.min(maxY, watermarkCoord.y));

    return {
      normW: nw,
      normH: nh,
      clampedCoord: { x: clampedX, y: clampedY }
    };
  }, [watermarkSizePercent, activeLogoAspectRatio, currentCropAspect, watermarkCoord]);

  // ---------------------------------------------------------------------------
  // 3. Crop Mode Presets & Zoom Controls
  // ---------------------------------------------------------------------------
  const handleApplyCropPreset = (mode) => {
    const cropper = cropperRef.current;
    if (!cropper) return;

    setCropMode(mode);
    setHasUnsavedChanges(true);

    if (mode === "1:1") {
      cropper.setAspectRatio(1.0);
    } else if (mode === "4:3") {
      // 3:4 portrait statue orientation
      cropper.setAspectRatio(3 / 4);
    } else if (mode === "free") {
      cropper.setAspectRatio(NaN);
    } else if (mode === "fit") {
      const nw = sourceImgRef.current?.naturalWidth || 1;
      const nh = sourceImgRef.current?.naturalHeight || 1;
      cropper.setAspectRatio(nw / nh);
      cropper.setData({ x: 0, y: 0, width: nw, height: nh });
    }
  };

  const handleZoomSliderChange = (newZoom) => {
    const cropper = cropperRef.current;
    if (!cropper) return;
    cropper.zoomTo(newZoom);
    setCurrentZoom(newZoom);
    setHasUnsavedChanges(true);
  };

  // Watermark Corner Presets
  const handleWatermarkCornerPreset = (pos) => {
    setWatermarkPos(pos);
    const newCoords = getPresetWatermarkCoords(pos, watermarkSizePercent, activeLogoAspectRatio, currentCropAspect, 0.04);
    setWatermarkCoord(newCoords);
    setHasUnsavedChanges(true);
  };

  // One-tap Reset
  const handleResetSession = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.reset();
      cropper.setAspectRatio(1.0);
    }
    setCropMode("1:1");
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setWatermarkEnabled(true);
    setWatermarkPos("bottom-right");
    const defaultCoords = getPresetWatermarkCoords("bottom-right", 30, activeLogoAspectRatio, 1.0, 0.04);
    setWatermarkCoord(defaultCoords);
    setWatermarkSizePercent(30);
    setWatermarkOpacity(0.85);
    setHasUnsavedChanges(false);
  };

  // ---------------------------------------------------------------------------
  // 4. Touch & Mouse Watermark Gesture Handlers (Mode-Isolated)
  // ---------------------------------------------------------------------------
  const getTouchDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const handleWmTouchStart = (e) => {
    if (activeTab !== "watermark" || isProcessing) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      wmPinchStateRef.current = {
        isPinching: true,
        initialDist: dist,
        initialSize: watermarkSizePercent
      };
      wmDragStateRef.current.isDragging = false;
      return;
    }

    if (e.touches.length === 1) {
      e.preventDefault();
      wmPinchStateRef.current.isPinching = false;
      const t = e.touches[0];
      wmDragStateRef.current = {
        isDragging: true,
        startX: t.clientX,
        startY: t.clientY,
        initCoord: { ...clampedCoord }
      };
      setHasUnsavedChanges(true);
    }
  };

  const handleWmTouchMove = (e) => {
    if (activeTab !== "watermark" || isProcessing) return;

    if (e.touches.length === 2 && wmPinchStateRef.current.isPinching) {
      e.preventDefault();
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      const initDist = wmPinchStateRef.current.initialDist;
      if (initDist <= 0) return;

      const scaleFactor = currentDist / initDist;
      const newSize = Math.max(8, Math.min(90, Math.round(wmPinchStateRef.current.initialSize * scaleFactor)));
      setWatermarkSizePercent(newSize);
      return;
    }

    if (e.touches.length === 1 && wmDragStateRef.current.isDragging && cropBoxData) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - wmDragStateRef.current.startX;
      const dy = t.clientY - wmDragStateRef.current.startY;

      const normDeltaX = dx / cropBoxData.width;
      const normDeltaY = dy / cropBoxData.height;

      const maxX = Math.max(0, 1 - normW);
      const maxY = Math.max(0, 1 - normH);

      const newX = Math.max(0, Math.min(maxX, wmDragStateRef.current.initCoord.x + normDeltaX));
      const newY = Math.max(0, Math.min(maxY, wmDragStateRef.current.initCoord.y + normDeltaY));

      setWatermarkCoord({ x: newX, y: newY });
      setWatermarkPos("custom");
    }
  };

  const handleWmTouchEnd = (e) => {
    if (e.touches.length < 2) {
      wmPinchStateRef.current.isPinching = false;
    }
    if (e.touches.length === 0) {
      wmDragStateRef.current.isDragging = false;
    }
  };

  const handleWmMousedown = (e) => {
    if (activeTab !== "watermark" || isProcessing) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initCoord = { ...clampedCoord };

    const onMouseMove = (moveEvt) => {
      if (!cropBoxData) return;
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      const normDeltaX = dx / cropBoxData.width;
      const normDeltaY = dy / cropBoxData.height;

      const maxX = Math.max(0, 1 - normW);
      const maxY = Math.max(0, 1 - normH);

      const newX = Math.max(0, Math.min(maxX, initCoord.x + normDeltaX));
      const newY = Math.max(0, Math.min(maxY, initCoord.y + normDeltaY));

      setWatermarkCoord({ x: newX, y: newY });
      setWatermarkPos("custom");
      setHasUnsavedChanges(true);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // ---------------------------------------------------------------------------
  // 5. Final Full-Resolution Image Export (Prismatic Composition)
  // ---------------------------------------------------------------------------
  const generateFullResImage = async ({ isSkipped = false }) => {
    // Resolve loaded image safely
    let img = sourceImgRef.current || imageElementRef.current;
    if (!img || !img.naturalWidth) {
      if (imageSrc) {
        img = await new Promise((resolve, reject) => {
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = reject;
          fallbackImg.src = imageSrc;
        });
        sourceImgRef.current = img;
      } else {
        throw new Error("Source image not ready");
      }
    }

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    let srcX = 0;
    let srcY = 0;
    let srcW = naturalW;
    let srcH = naturalH;

    if (!isSkipped && cropperRef.current) {
      const cropData = cropperRef.current.getData(true);
      srcX = Math.max(0, Math.round(cropData.x));
      srcY = Math.max(0, Math.round(cropData.y));
      srcW = Math.max(10, Math.min(naturalW - srcX, Math.round(cropData.width)));
      srcH = Math.max(10, Math.min(naturalH - srcY, Math.round(cropData.height)));
    }

    // Full-resolution offscreen canvas
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = srcW;
    offscreenCanvas.height = srcH;

    const ctx = offscreenCanvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) throw new Error("Could not initialize 2D context");

    // 1. Color adjustments
    ctx.save();
    if (!isSkipped && (brightness !== 0 || contrast !== 0 || saturation !== 0)) {
      const bVal = 100 + brightness;
      const cVal = 100 + contrast;
      const sVal = 100 + saturation;
      ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;
    }

    // Draw native full-resolution pixels directly
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    ctx.restore();

    // 2. Composite Watermark at Full-Resolution (Zero-Drift Geometry)
    const shouldWatermark = watermarkEnabled || isSkipped;
    let activeWm = (watermarkSource === "custom" && customWatermarkImgRef.current && !isSkipped)
      ? customWatermarkImgRef.current
      : watermarkImgRef.current;

    // Ensure watermark image is resolved
    if (shouldWatermark && !activeWm) {
      try {
        activeWm = await new Promise((resolve) => {
          const wm = new Image();
          wm.onload = () => resolve(wm);
          wm.onerror = () => resolve(null);
          wm.src = (watermarkSource === "custom" && customWatermarkInfo?.dataUrl)
            ? customWatermarkInfo.dataUrl
            : WATERMARK_SVG_URL;
        });
      } catch {}
    }

    if (shouldWatermark && activeWm) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const logoRatio = (activeWm.naturalWidth || 1200) / (activeWm.naturalHeight || 280);
      const effectiveSizePercent = isSkipped ? 30 : watermarkSizePercent;
      const effectiveOpacity = isSkipped ? 0.85 : watermarkOpacity;

      const fullWmW = Math.round(srcW * (effectiveSizePercent / 100));
      const fullWmH = Math.round(fullWmW / logoRatio);

      let effectiveCoord = clampedCoord;
      if (isSkipped) {
        effectiveCoord = getPresetWatermarkCoords("bottom-right", 30, logoRatio, srcW / srcH, 0.04);
      }

      let fullWmX = Math.round(effectiveCoord.x * srcW);
      let fullWmY = Math.round(effectiveCoord.y * srcH);

      // Bound within output canvas
      fullWmX = Math.max(0, Math.min(srcW - fullWmW, fullWmX));
      fullWmY = Math.max(0, Math.min(srcH - fullWmH, fullWmY));

      ctx.save();
      ctx.globalAlpha = effectiveOpacity;
      ctx.drawImage(activeWm, fullWmX, fullWmY, fullWmW, fullWmH);
      ctx.restore();
    }

    // 3. Export to High-Quality Output Blob
    const isPng = file?.type === "image/png";
    const mimeType = isPng ? "image/png" : "image/jpeg";
    const quality = 0.95;

    return new Promise((resolve, reject) => {
      offscreenCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to encode processed image"));
            return;
          }
          const baseName = (file?.name || "product").replace(/\.[^/.]+$/, "");
          const ext = isPng ? ".png" : ".jpg";
          const processedFile = new File([blob], `${baseName}-studio${ext}`, {
            type: mimeType,
            lastModified: Date.now()
          });

          resolve({
            processedFile,
            metadata: {
              crop: { x: srcX, y: srcY, width: srcW, height: srcH, mode: cropMode },
              originalDimensions: { width: naturalW, height: naturalH },
              outputDimensions: { width: srcW, height: srcH },
              adjustments: { brightness, contrast, saturation },
              watermark: {
                applied: shouldWatermark,
                opacity: watermarkOpacity,
                position: watermarkPos,
                coord: clampedCoord,
                sizePercent: watermarkSizePercent,
                source: watermarkSource
              },
              isSkipped
            }
          });
        },
        mimeType,
        quality
      );
    });
  };

  // ---------------------------------------------------------------------------
  // 6. Action Handlers (Save, Skip, Cancel)
  // ---------------------------------------------------------------------------
  const handleSaveClick = async () => {
    setIsProcessing(true);
    try {
      const { processedFile, metadata } = await generateFullResImage({ isSkipped: false });
      await onSave({
        processedFile,
        originalFile: file,
        metadata
      });
    } catch (err) {
      console.error("[Image Studio Save Error]:", err);
      alert("Failed to process image. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSkipClick = async () => {
    setIsProcessing(true);
    try {
      const { processedFile, metadata } = await generateFullResImage({ isSkipped: true });
      await onSkip({
        processedFile,
        originalFile: file,
        metadata
      });
    } catch (err) {
      console.error("[Image Studio Skip Error]:", err);
      onSkip({ processedFile: file, originalFile: file, metadata: { isSkipped: true } });
    }
  };

  const handleCancelClick = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm("Discard changes to this photo?");
      if (!confirmDiscard) return;
    }
    onCancel();
  };

  const activeWatermarkSrc = watermarkSource === "custom" && customWatermarkInfo?.dataUrl
    ? customWatermarkInfo.dataUrl
    : WATERMARK_SVG_URL;

  return (
    <div className={styles.studioOverlay} role="dialog" aria-modal="true" aria-label="Product Image Studio">
      {/* 1. TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button
            type="button"
            onClick={handleCancelClick}
            className={styles.iconBtn}
            aria-label="Close Studio"
            disabled={isProcessing}
          >
            ✕
          </button>
        </div>

        <div className={styles.topBarCenter}>
          <h2 className={styles.studioTitle}>Product Photo Studio</h2>
          {totalImages > 1 && (
            <span className={styles.imageCounterBadge}>
              Photo {imageIndex + 1} of {totalImages}
            </span>
          )}
        </div>

        <div className={styles.topBarRight}>
          <button
            type="button"
            onClick={handleResetSession}
            className={styles.resetBtn}
            disabled={isProcessing}
          >
            Reset
          </button>
        </div>
      </div>

      {/* 2. MAIN PREVIEW AREA (CROPPER & WATERMARK) */}
      <div
        className={`${styles.mainPreviewArea} ${activeTab === "watermark" ? styles.watermarkMode : ""}`}
        ref={containerRef}
      >
        <div className={styles.cropperContainer}>
          {imageSrc && (
            <img
              ref={imageElementRef}
              src={imageSrc}
              alt="Source Photography"
              onLoad={handleImageLoaded}
              className={styles.cropperSourceImg}
            />
          )}

          {/* Real-time Synchronized Watermark Overlay */}
          {cropBoxData && watermarkEnabled && (
            <div
              className={`${styles.watermarkOverlay} ${activeTab === "watermark" ? styles.watermarkOverlayInteractive : ""}`}
              style={{
                left: `${cropBoxData.left}px`,
                top: `${cropBoxData.top}px`,
                width: `${cropBoxData.width}px`,
                height: `${cropBoxData.height}px`
              }}
              onTouchStart={handleWmTouchStart}
              onTouchMove={handleWmTouchMove}
              onTouchEnd={handleWmTouchEnd}
              onMouseDown={handleWmMousedown}
            >
              <div
                className={`${styles.watermarkBadge} ${activeTab === "watermark" ? styles.watermarkBadgeActive : ""}`}
                style={{
                  left: `${clampedCoord.x * 100}%`,
                  top: `${clampedCoord.y * 100}%`,
                  width: `${watermarkSizePercent}%`,
                  opacity: watermarkOpacity
                }}
              >
                <img
                  src={activeWatermarkSrc}
                  alt="Watermark Seal"
                  className={styles.watermarkImg}
                  draggable={false}
                />
                {activeTab === "watermark" && (
                  <div className={styles.watermarkActiveRing}>
                    <span className={styles.watermarkMoveDot} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic touch gesture hint */}
        <div className={styles.touchHintPill}>
          {activeTab === "crop" && "🖐️ 1-Finger Pan • Pinch Zoom • Drag Corners & Edges"}
          {activeTab === "watermark" && "🖐️ 1-Finger Drag Logo • Pinch 2-Fingers to Scale Size"}
          {activeTab === "adjust" && "✨ Fine-tune marble clarity & lighting"}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className={styles.processingOverlay}>
            <div className={styles.spinner} />
            <div className={styles.processingText}>Preparing High-Resolution Image...</div>
          </div>
        )}
      </div>

      {/* 3. TOOL TABS & CONTROLS */}
      <div className={styles.toolPanel}>
        <div className={styles.toolTabs}>
          <button
            type="button"
            className={`${styles.toolTab} ${activeTab === "crop" ? styles.toolTabActive : ""}`}
            onClick={() => setActiveTab("crop")}
          >
            <span>📐</span>
            <span>Crop & Frame</span>
          </button>
          <button
            type="button"
            className={`${styles.toolTab} ${activeTab === "adjust" ? styles.toolTabActive : ""}`}
            onClick={() => setActiveTab("adjust")}
          >
            <span>✨</span>
            <span>Tone & Stone</span>
          </button>
          <button
            type="button"
            className={`${styles.toolTab} ${activeTab === "watermark" ? styles.toolTabActive : ""}`}
            onClick={() => setActiveTab("watermark")}
          >
            <span>🛡️</span>
            <span>Watermark</span>
          </button>
        </div>

        <div className={styles.toolBody}>
          {/* TAB 1: CROP & FRAME */}
          {activeTab === "crop" && (
            <div>
              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${cropMode === "1:1" ? styles.pillBtnActive : ""}`}
                  onClick={() => handleApplyCropPreset("1:1")}
                >
                  <span>1:1 Square</span>
                  <span className={styles.pillSub}>Recommended</span>
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${cropMode === "4:3" ? styles.pillBtnActive : ""}`}
                  onClick={() => handleApplyCropPreset("4:3")}
                >
                  <span>4:3 Portrait</span>
                  <span className={styles.pillSub}>Tall Murti</span>
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${cropMode === "free" ? styles.pillBtnActive : ""}`}
                  onClick={() => handleApplyCropPreset("free")}
                >
                  <span>Free Crop</span>
                  <span className={styles.pillSub}>Custom</span>
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${cropMode === "fit" ? styles.pillBtnActive : ""}`}
                  onClick={() => handleApplyCropPreset("fit")}
                >
                  <span>Fit All</span>
                  <span className={styles.pillSub}>Full Statue</span>
                </button>
              </div>

              {/* Zoom Slider for quick 1-handed crop framing */}
              <div className={styles.sliderGroup} style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderLabel}>🔍 Crop Frame Zoom (Pinch or Slide)</span>
                  <span className={styles.sliderValue}>
                    {Math.round(currentZoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={currentZoom}
                  onChange={(e) => handleZoomSliderChange(parseFloat(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>
            </div>
          )}

          {/* TAB 2: ADJUST COLOR & LIGHTING */}
          {activeTab === "adjust" && (
            <div>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderLabel}>☀️ Brightness</span>
                  <span className={styles.sliderValue}>{brightness > 0 ? `+${brightness}` : brightness}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={brightness}
                  onChange={(e) => {
                    setBrightness(parseInt(e.target.value, 10));
                    setHasUnsavedChanges(true);
                  }}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderLabel}>🌓 Contrast (Carving Depth)</span>
                  <span className={styles.sliderValue}>{contrast > 0 ? `+${contrast}` : contrast}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="40"
                  value={contrast}
                  onChange={(e) => {
                    setContrast(parseInt(e.target.value, 10));
                    setHasUnsavedChanges(true);
                  }}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderGroup} style={{ marginBottom: 0 }}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderLabel}>🎨 Color Saturation</span>
                  <span className={styles.sliderValue}>{saturation > 0 ? `+${saturation}` : saturation}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={saturation}
                  onChange={(e) => {
                    setSaturation(parseInt(e.target.value, 10));
                    setHasUnsavedChanges(true);
                  }}
                  className={styles.sliderInput}
                />
              </div>
            </div>
          )}

          {/* TAB 3: WATERMARK BRANDING */}
          {activeTab === "watermark" && (
            <div>
              <input
                type="file"
                ref={customWatermarkInputRef}
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                onChange={handleCustomWatermarkUpload}
                style={{ display: "none" }}
              />

              <div className={styles.switchRow}>
                <div className={styles.switchLabel}>
                  <span className={styles.switchTitle}>Enable Brand Watermark</span>
                  <span className={styles.switchDesc}>Protects carving photographs with high-definition seal</span>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={watermarkEnabled}
                    onChange={(e) => {
                      setWatermarkEnabled(e.target.checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>

              {watermarkEnabled && (
                <>
                  <div className={styles.watermarkSourceTabs}>
                    <button
                      type="button"
                      className={`${styles.watermarkSourceBtn} ${watermarkSource === "official" ? styles.watermarkSourceBtnActive : ""}`}
                      onClick={() => {
                        setWatermarkSource("official");
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <span>🏛️</span>
                      <span>Official Brand Seal</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.watermarkSourceBtn} ${watermarkSource === "custom" ? styles.watermarkSourceBtnActive : ""}`}
                      onClick={() => {
                        if (!customWatermarkInfo) {
                          customWatermarkInputRef.current?.click();
                        } else {
                          setWatermarkSource("custom");
                          setHasUnsavedChanges(true);
                        }
                      }}
                    >
                      <span>📤</span>
                      <span>{customWatermarkInfo ? "Custom Logo" : "Upload Custom"}</span>
                    </button>
                  </div>

                  {watermarkSource === "custom" && (
                    <>
                      {customWatermarkInfo ? (
                        <div className={styles.customPreviewRow}>
                          <img src={customWatermarkInfo.dataUrl} alt="Custom Watermark" className={styles.customThumb} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.78rem", fontWeight: "600", color: "#FFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {customWatermarkInfo.name}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "#D4AF37" }}>✓ Active High-Definition Logo</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => customWatermarkInputRef.current?.click()}
                            className={styles.resetBtn}
                            style={{ minHeight: "32px", padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div
                          className={styles.customUploadBox}
                          onClick={() => customWatermarkInputRef.current?.click()}
                        >
                          <div style={{ fontSize: "1.4rem", marginBottom: "0.2rem" }}>📤</div>
                          <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#FFDF78" }}>
                            Tap to Upload Custom Watermark
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#A89A8C", marginTop: "0.15rem" }}>
                            Supports PNG (transparent), SVG, JPEG or WebP
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Watermark Size Controls */}
                  <div className={styles.sliderGroup} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.sliderLabel}>Watermark Size (Small to Big)</span>
                      <span className={styles.sliderValue}>{watermarkSizePercent}%</span>
                    </div>

                    <div className={styles.sizePresetsRow}>
                      <button
                        type="button"
                        className={`${styles.sizePresetBtn} ${watermarkSizePercent === 15 ? styles.sizePresetBtnActive : ""}`}
                        onClick={() => { setWatermarkSizePercent(15); setHasUnsavedChanges(true); }}
                      >
                        Compact (15%)
                      </button>
                      <button
                        type="button"
                        className={`${styles.sizePresetBtn} ${watermarkSizePercent === 30 ? styles.sizePresetBtnActive : ""}`}
                        onClick={() => { setWatermarkSizePercent(30); setHasUnsavedChanges(true); }}
                      >
                        Standard (30%)
                      </button>
                      <button
                        type="button"
                        className={`${styles.sizePresetBtn} ${watermarkSizePercent === 55 ? styles.sizePresetBtnActive : ""}`}
                        onClick={() => { setWatermarkSizePercent(55); setHasUnsavedChanges(true); }}
                      >
                        Large (55%)
                      </button>
                      <button
                        type="button"
                        className={`${styles.sizePresetBtn} ${watermarkSizePercent === 80 ? styles.sizePresetBtnActive : ""}`}
                        onClick={() => { setWatermarkSizePercent(80); setHasUnsavedChanges(true); }}
                      >
                        Centerpiece (80%)
                      </button>
                    </div>

                    <input
                      type="range"
                      min="8"
                      max="90"
                      value={watermarkSizePercent}
                      onChange={(e) => {
                        setWatermarkSizePercent(parseInt(e.target.value, 10));
                        setHasUnsavedChanges(true);
                      }}
                      className={styles.sliderInput}
                    />
                  </div>

                  {/* Placement Presets */}
                  <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#C8BFB2", marginBottom: "0.25rem", marginTop: "0.5rem" }}>
                    Placement (or Drag Directly on Image)
                  </div>
                  <div className={styles.cornerPresets}>
                    <button
                      type="button"
                      className={`${styles.cornerBtn} ${watermarkPos === "bottom-right" ? styles.cornerBtnActive : ""}`}
                      onClick={() => handleWatermarkCornerPreset("bottom-right")}
                    >
                      Bottom Right
                    </button>
                    <button
                      type="button"
                      className={`${styles.cornerBtn} ${watermarkPos === "center" ? styles.cornerBtnActive : ""}`}
                      onClick={() => handleWatermarkCornerPreset("center")}
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      className={`${styles.cornerBtn} ${watermarkPos === "bottom-left" ? styles.cornerBtnActive : ""}`}
                      onClick={() => handleWatermarkCornerPreset("bottom-left")}
                    >
                      Bottom Left
                    </button>
                    <button
                      type="button"
                      className={`${styles.cornerBtn} ${watermarkPos === "top-right" ? styles.cornerBtnActive : ""}`}
                      onClick={() => handleWatermarkCornerPreset("top-right")}
                    >
                      Top Right
                    </button>
                    <button
                      type="button"
                      className={`${styles.cornerBtn} ${watermarkPos === "top-left" ? styles.cornerBtnActive : ""}`}
                      onClick={() => handleWatermarkCornerPreset("top-left")}
                    >
                      Top Left
                    </button>
                  </div>

                  {/* Opacity Slider */}
                  <div className={styles.sliderGroup} style={{ marginBottom: 0, marginTop: "0.5rem" }}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.sliderLabel}>Watermark Visibility (Opacity)</span>
                      <span className={styles.sliderValue}>{Math.round(watermarkOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={Math.round(watermarkOpacity * 100)}
                      onChange={(e) => {
                        setWatermarkOpacity(parseInt(e.target.value, 10) / 100);
                        setHasUnsavedChanges(true);
                      }}
                      className={styles.sliderInput}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM ACTION BAR */}
      <div className={styles.bottomActionArea}>
        <button
          type="button"
          onClick={handleSkipClick}
          disabled={isProcessing}
          className={styles.skipBtn}
        >
          Skip (Auto Watermark)
        </button>

        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isProcessing}
          className={styles.saveBtn}
        >
          {isProcessing ? "Processing..." : "Save Image ✓"}
        </button>
      </div>
    </div>
  );
}
