<script>
  let { editor = $bindable(), logo } = $props();
  import { gestures } from '../../../../lib/actions/gestures';

  let panState = $state(null);
  let rotateState = $state(null);
  let resizeState = $state(null);
  let aspectRatio = $derived.by(() => {
    if (editor.canvasHeight > 0) {
      return editor.canvasWidth / editor.canvasHeight;
    }
    return 1;
  });

  function handlePanStart(event) {
    panState = {
      initialLogoX: editor.logoX,
      initialLogoY: editor.logoY,
      initialPointerX: event.detail.x,
      initialPointerY: event.detail.y,
      axisLock: null,
    };
  }

  function handlePan(event) {
    if (!panState) return;

    const screenDeltaX = event.detail.x - panState.initialPointerX;
    const screenDeltaY = event.detail.y - panState.initialPointerY;

    let finalX = panState.initialLogoX + screenDeltaX;
    let finalY = panState.initialLogoY + screenDeltaY;

    if (event.detail.shiftKey) {
      if (!panState.axisLock) {
        if (Math.abs(screenDeltaX) > 5 || Math.abs(screenDeltaY) > 5) {
          if (Math.abs(screenDeltaX) > Math.abs(screenDeltaY)) {
            panState.axisLock = { axis: 'y', position: finalY };
          } else {
            panState.axisLock = { axis: 'x', position: finalX };
          }
        }
      }

      if (panState.axisLock) {
        if (panState.axisLock.axis === 'x') {
          finalX = panState.axisLock.position;
        } else {
          finalY = panState.axisLock.position;
        }
      }
    } else {
      panState.axisLock = null;
    }

    editor.logoX = finalX;
    editor.logoY = finalY;
  }

  function handlePanEnd() {
    panState = null;
  }

  function handleResizeStart(event) {
    resizeState = {
      initialCanvasWidth: editor.canvasWidth,
      initialCanvasHeight: editor.canvasHeight,
      initialLogoX: editor.logoX,
      initialLogoY: editor.logoY,
      initialPointerX: event.detail.x,
      initialPointerY: event.detail.y,
    };
  }

  function handleResize(event, edge) {
    if (!resizeState) return;

    const dx = event.detail.x - resizeState.initialPointerX;
    const dy = event.detail.y - resizeState.initialPointerY;

    let newWidth = resizeState.initialCanvasWidth;
    let newHeight = resizeState.initialCanvasHeight;
    let logoDeltaX = 0;
    let logoDeltaY = 0;

    switch (edge) {
      case 'right':
      case 'left': {
        const widthChange = (edge === 'right' ? dx : -dx) * 2;
        newWidth = resizeState.initialCanvasWidth + widthChange;
        if (editor.keepAspectRatio && aspectRatio > 0) {
          newHeight = newWidth / aspectRatio;
        }
        if (edge === 'left') {
          logoDeltaX = -dx * 2;
        }
        break;
      }

      case 'bottom':
      case 'top': {
        const heightChange = (edge === 'bottom' ? dy : -dy) * 2;
        newHeight = resizeState.initialCanvasHeight + heightChange;
        if (editor.keepAspectRatio && aspectRatio > 0) {
          newWidth = newHeight * aspectRatio;
        }
        if (edge === 'top') {
          logoDeltaY = -dy * 2;
        }
        break;
      }
    }

    editor.canvasWidth = Math.max(50, newWidth);
    editor.canvasHeight = Math.max(50, newHeight);
    editor.logoX = resizeState.initialLogoX + logoDeltaX;
    editor.logoY = resizeState.initialLogoY + logoDeltaY;
  }

  function handleResizeEnd() {
    resizeState = null;
  }

  function wrapAngle(angle) {
    return ((((angle + 180) % 360) + 360) % 360) - 180;
  }

  function handleZoom(event) {
    event.preventDefault();
    if (event.detail.shiftKey) {
      const rotateFactor = event.detail.deltaY * 0.1;
      let newRotate = editor.logoRotate + rotateFactor;
      editor.logoRotate = wrapAngle(newRotate);
    } else {
      const zoomFactor = 1 - event.detail.deltaY * 0.001;
      let newScale = editor.logoScale * zoomFactor;
      editor.logoScale = Math.max(0.1, Math.min(newScale, 5));
    }
  }

  const logoTransform = $derived(
    `translate(${editor.logoX}, ${editor.logoY}) rotate(${editor.logoRotate}) scale(${
      editor.logoScale
    }) translate(-${logo.width / 2}, -${logo.height / 2})`,
  );

  function handlePinch(event) {
    event.preventDefault();
    let newScale = editor.logoScale * (1 + (event.detail.scale - 1) * 0.5);
    editor.logoScale = Math.max(0.1, Math.min(newScale, 5));
  }

  function handleRotateStart() {
    rotateState = {
      initialLogoRotate: editor.logoRotate,
    };
  }

  function handleRotate(event) {
    if (!rotateState) return;
    editor.logoRotate = rotateState.initialLogoRotate + event.detail.rotation;
  }

  function handleRotateEnd() {
    editor.logoRotate = wrapAngle(editor.logoRotate);
    rotateState = null;
  }

  export function getExportData() {
    return {
      originalSvgDimensions: {
        width: logo.width,
        height: logo.height,
      },
      extension: 'svg',
    };
  }
</script>

<div
  class="relative touch-none"
  style="width: {editor.canvasWidth}px; height: {editor.canvasHeight}px; max-width: 100%; max-height: 100%;"
>
  <svg
    class="h-full w-full border border-dashed border-white/20"
    style="background-color: {logo?.background};"
    viewBox="0 0 {editor.canvasWidth} {editor.canvasHeight}"
  >
    <rect
      use:gestures
      onpanstart={handlePanStart}
      onpan={handlePan}
      onpanend={handlePanEnd}
      onzoom={handleZoom}
      onpinch={handlePinch}
      onrotatestart={handleRotateStart}
      onrotate={handleRotate}
      onrotateend={handleRotateEnd}
      width={editor.canvasWidth}
      height={editor.canvasHeight}
      fill="transparent"
    />
    <g transform={logoTransform} class="pointer-events-none">
      <image
        href={logo?.url}
        x="0"
        y="0"
        width={logo?.width}
        height={logo?.height}
      />
    </g>
  </svg>

  <div
    use:gestures
    onpanstart={handleResizeStart}
    onpan={(e) => handleResize(e, 'top')}
    onpanend={handleResizeEnd}
    class="absolute -top-1 left-1/2 h-2 w-16 -translate-x-1/2 cursor-ns-resize rounded-full bg-[#FFA676]"
  ></div>
  <div
    use:gestures
    onpanstart={handleResizeStart}
    onpan={(e) => handleResize(e, 'right')}
    onpanend={handleResizeEnd}
    class="absolute -right-1 top-1/2 h-16 w-2 -translate-y-1/2 cursor-ew-resize rounded-full bg-[#FFA676]"
  ></div>
  <div
    use:gestures
    onpanstart={handleResizeStart}
    onpan={(e) => handleResize(e, 'bottom')}
    onpanend={handleResizeEnd}
    class="absolute -bottom-1 left-1/2 h-2 w-16 -translate-x-1/2 cursor-ns-resize rounded-full bg-[#FFA676]"
  ></div>
  <div
    use:gestures
    onpanstart={handleResizeStart}
    onpan={(e) => handleResize(e, 'left')}
    onpanend={handleResizeEnd}
    class="absolute -left-1 top-1/2 h-16 w-2 -translate-y-1/2 cursor-ew-resize rounded-full bg-[#FFA676]"
  ></div>
</div>
