// import { useEffect, useRef, useState } from "react";
// import lotusTower from "@/public/hero-images/lotus-tower/LotusTower.webp";
// import lotusTowerBg from "@/public/hero-images/lotus-tower/LotusTowerBackground.webp";
// import lotusTowerSky from "@/public/hero-images/lotus-tower/LotusTowersky.webp";
// import fog_4 from "@/public/hero-images/lotus-tower/fog_4.webp";
// import fog_6 from "@/public/hero-images/lotus-tower/fog_6.webp";
// import Elephants from "@/public/hero-images/elephants/Elephants.webp";
// import Grass from "@/public/hero-images/elephants/Grass.webp";
// import ElephantSky from "@/public/hero-images/elephants/Background.webp";
// import GrassLayer from "@/public/hero-images/elephants/GrassLayer.webp";
// import Sigiriya6 from "@/public/hero-images/sigiriya/sigiriya06.webp"
// import Sigiriya5 from "@/public/hero-images/sigiriya/sigiriya05.webp"
// import Sigiriya4 from "@/public/hero-images/sigiriya/sigiriya04.webp"
// import Sigiriya3 from "@/public/hero-images/sigiriya/sigiriya03.webp"
// import Sigiriya2 from "@/public/hero-images/sigiriya/sigiriya02.webp"
// import Sigiriya1 from "@/public/hero-images/sigiriya/sigiriya01.webp"
// import { throttle } from "lodash";
// import defaultBg from "@/public/hero-images/sigiriya/sigiriyaBlur.webp";

// interface LoadedImage {
//     img: HTMLImageElement;
//     scaledWidth: number;
//     scaledHeight: number;
// }
// interface Layer {
//     image: string;
//     speedX: number;
//     speedY: number;
//     scale: number;
//     opacity?: number;
//     blendMode?: GlobalCompositeOperation;
// }
// const UnifiedParallaxCanvas = () => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const animationRef = useRef<number | null>(null);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [isLoaded, setIsLoaded] = useState(false);

//     const slides: Layer[][] = [
//         [
//             { image: Sigiriya1.src, speedX: 0.001, speedY: 0, scale: 1.1 },
//             { image: Sigiriya2.src, speedX: 0.001, speedY: 0.001, scale: 1.1 },
//             { image: Sigiriya3.src, speedX: 0.001, speedY: 0, scale: 1.1 },
//             { image: Sigiriya4.src, speedX: 0.002, speedY: 0.002, scale: 1.1 },
//             { image: Sigiriya5.src, speedX: 0.002, speedY: 0.002, scale: 1.1 },
//             { image: Sigiriya6.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
//         ],
//         [
//             { image: lotusTowerSky.src, speedX: 0.002, speedY: 0.002, scale: 1.1 },
//             { image: fog_4.src, speedX: 0.005, speedY: 0, opacity: 1, scale: 0.4 },
//             { image: lotusTowerBg.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
//             { image: fog_6.src, speedX: 0.02, speedY: 0, opacity: 0.8, scale: 0.6 },
//             { image: lotusTower.src, speedX: 0.005, speedY: 0.005, scale: 0.9 },
//         ],
//         [
//             { image: ElephantSky.src, speedX: 0.001, speedY: 0.001, scale: 1.1 },
//             { image: Grass.src, speedX: 0.001, speedY: 0.001, scale: 1.1 },
//             { image: Elephants.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
//             { image: GrassLayer.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
//         ],
//     ];

//     const [layers, setLayers] = useState(slides[currentSlide]);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
//         }, 30000);

//         return () => clearInterval(interval);
//     }, [slides.length]);

//     useEffect(() => {
//         setLayers(slides[currentSlide]);
//     }, [currentSlide]);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas?.getContext("2d");
//         if (!canvas || !ctx) return;

//         let mouseX = 0;
//         let mouseY = 0;
//         let timeOffset = 0;
//         const loadedImages: LoadedImage[] = [];

//         const setCanvasDimensions = () => {
//             const dpr = window.devicePixelRatio || 1;
//             canvas.width = window.innerWidth * dpr;
//             canvas.height = window.innerHeight * dpr;
//             ctx.scale(dpr, dpr);
//         };

//         const preloadImages = async () => {
//             const imageSources = layers.map((layer) => layer.image);
//             const images = await Promise.all(
//                 imageSources.map(
//                     (src) =>
//                         new Promise<HTMLImageElement>((resolve, reject) => {
//                             const img = new Image();
//                             img.src = src;
//                             img.onload = () => resolve(img);
//                             img.onerror = reject;
//                         })
//                 )
//             );
        
//             images.forEach((img, index) => {
        
//                 const canvasRatio = canvas.width / canvas.height;
//                 const imageRatio = img.width / img.height;
        
//                 let scale;
//                 if (canvasRatio > imageRatio) {
//                     scale = canvas.width / img.width;
//                 } else {
//                     scale = canvas.height / img.height;
//                 }
        
                
//                 scale = Math.min(scale, 1.01);
        
//                 loadedImages[index] = {
//                     img,
//                     scaledWidth: img.width * scale,
//                     scaledHeight: img.height * scale,
//                 };
//             });
        
//             setIsLoaded(true); 
//         };
//         const handleMouseMove = throttle((e: MouseEvent) => {
//             mouseX = (e.clientX / canvas.width - 0.5) * 2;
//             mouseY = (e.clientY / canvas.height - 0.5) * 2;
//         }, 16);

//         const animate = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height); 

//             layers.forEach((layer, index) => {
//                 const { img, scaledWidth, scaledHeight } = loadedImages[index];

//                 const xOffset = (canvas.width / window.devicePixelRatio - scaledWidth) / 2;
//                 const yOffset = (canvas.height / window.devicePixelRatio - scaledHeight) / 2;

//                 let mouseXOffset = 0;
//                 let mouseYOffset = 0;

//                 if (layer.image !== fog_4.src && layer.image !== fog_6.src) {
//                     mouseXOffset = mouseX * layer.speedX * canvas.width / window.devicePixelRatio;
//                     mouseYOffset = mouseY * layer.speedY * canvas.height / window.devicePixelRatio;
//                 }

//                 let driftX = 0;

//                 if (layer.image === fog_4.src || layer.image === fog_6.src) {
//                     driftX = (timeOffset * layer.speedX * canvas.width) % canvas.width;
//                 }

//                 const finalX = xOffset + mouseXOffset + driftX;
//                 const finalY = yOffset + mouseYOffset;

//                 ctx.globalAlpha = layer.opacity ?? 1;
//                 ctx.globalCompositeOperation = layer.blendMode ?? "source-over";

//                 ctx.drawImage(img, finalX, finalY, scaledWidth, scaledHeight);
//             });

//             timeOffset += 0.016;
//             animationRef.current = requestAnimationFrame(animate);
//         };

//         const startAnimation = async () => {
//             setCanvasDimensions();
//             await preloadImages();
//             window.addEventListener("mousemove", handleMouseMove);
//             animate();
//         };

//         startAnimation();

//         window.addEventListener("resize", setCanvasDimensions);

//         return () => {
//             if (animationRef.current) cancelAnimationFrame(animationRef.current);
//             window.removeEventListener("mousemove", handleMouseMove);
//             window.removeEventListener("resize", setCanvasDimensions);
//         };
//     }, [layers]);

//     return (
//         <>
//             {!isLoaded && (
//                 <img
//                     src={defaultBg.src}
//                     alt="Loading background"
//                     style={{
//                         scale: 1,
//                         display: "block",
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         filter: "blur(10px)",
//                     }}
//                 />
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     filter: isLoaded ? "blur(0)" : "blur(10px)",
//                     transition: "filter 1.5s ease-out",
//                     display: "block",
//                     width: "100%",
//                     height: "100%",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     transform: "translateZ(0)",
//                 }}
//             />
//         </>
//     );
// };

// export default UnifiedParallaxCanvas;
import { useEffect, useRef, useState } from "react";
import lotusTower from "@/public/hero-images/lotus-tower/LotusTower.webp";
import lotusTowerBg from "@/public/hero-images/lotus-tower/LotusTowerBackground.webp";
import lotusTowerSky from "@/public/hero-images/lotus-tower/LotusTowersky.webp";
import fog_4 from "@/public/hero-images/lotus-tower/fog_4.webp";
import fog_6 from "@/public/hero-images/lotus-tower/fog_6.webp";
import Elephants from "@/public/hero-images/elephants/Elephants.webp";
import Grass from "@/public/hero-images/elephants/Grass.webp";
import ElephantSky from "@/public/hero-images/elephants/Background.webp";
import GrassLayer from "@/public/hero-images/elephants/GrassLayer.webp";
import Sigiriya6 from "@/public/hero-images/sigiriya/sigiriya06.webp";
import Sigiriya5 from "@/public/hero-images/sigiriya/sigiriya05.webp";
import Sigiriya4 from "@/public/hero-images/sigiriya/sigiriya04.webp";
import Sigiriya3 from "@/public/hero-images/sigiriya/sigiriya03.webp";
import Sigiriya2 from "@/public/hero-images/sigiriya/sigiriya02.webp";
import Sigiriya1 from "@/public/hero-images/sigiriya/sigiriya01.webp";
import { throttle } from "lodash";
import defaultBg from "@/public/hero-images/sigiriya/sigiriyaBlur.webp";

interface LoadedImage {
  img: HTMLImageElement;
  scaledWidth: number;
  scaledHeight: number;
}
interface Layer {
  image: string;
  speedX: number;
  speedY: number;
  scale: number;
  opacity?: number;
  blendMode?: GlobalCompositeOperation;
}

const UnifiedParallaxCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageCache = useRef<Map<string, LoadedImage>>(new Map());

  const slides: Layer[][] = [
    [
      { image: Sigiriya1.src, speedX: 0.001, speedY: 0, scale: 1.1 },
      { image: Sigiriya2.src, speedX: 0.001, speedY: 0.001, scale: 1.1 },
      { image: Sigiriya3.src, speedX: 0.001, speedY: 0, scale: 1.1 },
      { image: Sigiriya4.src, speedX: 0.002, speedY: 0.002, scale: 1.1 },
      { image: Sigiriya5.src, speedX: 0.002, speedY: 0.002, scale: 1.1 },
      { image: Sigiriya6.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
    ],
    [
      { image: lotusTowerSky.src, speedX: 0.002, speedY: 0.002, scale: 1.1 },
      { image: fog_4.src, speedX: 0.005, speedY: 0, opacity: 1, scale: 0.4 },
      { image: lotusTowerBg.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
      { image: fog_6.src, speedX: 0.02, speedY: 0, opacity: 0.8, scale: 0.6 },
      { image: lotusTower.src, speedX: 0.005, speedY: 0.005, scale: 0.9 },
    ],
    [
      { image: ElephantSky.src, speedX: 0.001, speedY: 0.001, scale: 1.1 },
      { image: Grass.src, speedX: 0.001, speedY: 0.001, scale: 1.1 },
      { image: Elephants.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
      { image: GrassLayer.src, speedX: 0.003, speedY: 0.003, scale: 1.1 },
    ],
  ];

  const [layers, setLayers] = useState(slides[currentSlide]);

  // 🔹 Slide interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    setLayers(slides[currentSlide]);
  }, [currentSlide]);

  const preloadImages = async (layerSet: Layer[], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const promises = layerSet.map(
      (layer) =>
        new Promise<void>((resolve, reject) => {
          if (imageCache.current.has(layer.image)) {
            resolve();
            return;
          }
          const img = new Image();
          img.src = layer.image;
          img.onload = () => {
            const canvasRatio = canvas.width / canvas.height;
            const imageRatio = img.width / img.height;

            let scale =
              canvasRatio > imageRatio
                ? canvas.width / img.width
                : canvas.height / img.height;

            scale = Math.min(scale, 1.01);

            imageCache.current.set(layer.image, {
              img,
              scaledWidth: img.width * scale,
              scaledHeight: img.height * scale,
            });
            resolve();
          };
          img.onerror = reject;
        })
    );

    await Promise.all(promises);
  };

  // 🔹 Preload NEXT slide in background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nextIndex = (currentSlide + 1) % slides.length;
    preloadImages(slides[nextIndex], canvas);
  }, [currentSlide, slides]);

  // 🔹 Main rendering logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let mouseX = 0;
    let mouseY = 0;
    let timeOffset = 0;

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseX = (e.clientX / canvas.width - 0.5) * 2;
      mouseY = (e.clientY / canvas.height - 0.5) * 2;
    }, 16);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      layers.forEach((layer) => {
        const cached = imageCache.current.get(layer.image);
        if (!cached) return; // still loading

        const { img, scaledWidth, scaledHeight } = cached;

        const xOffset =
          (canvas.width / window.devicePixelRatio - scaledWidth) / 2;
        const yOffset =
          (canvas.height / window.devicePixelRatio - scaledHeight) / 2;

        let mouseXOffset = 0;
        let mouseYOffset = 0;

        if (layer.image !== fog_4.src && layer.image !== fog_6.src) {
          mouseXOffset =
            (mouseX * layer.speedX * canvas.width) / window.devicePixelRatio;
          mouseYOffset =
            (mouseY * layer.speedY * canvas.height) / window.devicePixelRatio;
        }

        let driftX = 0;
        if (layer.image === fog_4.src || layer.image === fog_6.src) {
          driftX = (timeOffset * layer.speedX * canvas.width) % canvas.width;
        }

        const finalX = xOffset + mouseXOffset + driftX;
        const finalY = yOffset + mouseYOffset;

        ctx.globalAlpha = layer.opacity ?? 1;
        ctx.globalCompositeOperation = layer.blendMode ?? "source-over";

        ctx.drawImage(img, finalX, finalY, scaledWidth, scaledHeight);
      });

      timeOffset += 0.016;
      animationRef.current = requestAnimationFrame(animate);
    };

    const start = async () => {
      setCanvasDimensions();
      await preloadImages(layers, canvas);
      setIsLoaded(true);
      window.addEventListener("mousemove", handleMouseMove);
      animate();
    };

    start();
    window.addEventListener("resize", setCanvasDimensions);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, [layers]);

  return (
    <>
      {!isLoaded && (
        <img
          src={defaultBg.src}
          alt="Loading background"
          style={{
            scale: 1,
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            filter: "blur(10px)",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{
          filter: isLoaded ? "blur(0)" : "blur(10px)",
          transition: "filter 1.5s ease-out",
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translateZ(0)",
        }}
      />
    </>
  );
};

export default UnifiedParallaxCanvas;
