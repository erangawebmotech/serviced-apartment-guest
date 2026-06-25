"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AboutPage from "@/components/about/AboutPage";
import ImageContainer from "@/components/hero/ImageContainer/ImageContainer";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearAllFilters } from "@/store/reducers/filterReducer";
import dynamic from "next/dynamic";
import RequestWhatsappWrapper from "@/components/contactUs/RequestWhatsappWrapper";

export default function Home() {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()

  const ExplorePage = dynamic(() => import("@/components/explore/ExplorePage"), { ssr: false });
  const PopularLocation = dynamic(() => import("@/components/PopularLocations/PopularLocation"), { ssr: false });
  const Footer = dynamic(() => import("@/components/footer/Footer"), { ssr: false });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 300 && !showScrollTopButton) {
        setShowScrollTopButton(true);
      } else if (scrollPosition <= 300 && showScrollTopButton) {
        setShowScrollTopButton(false);
      }
    };

    const throttledScrollHandler = () => {
      if (!scrollListenerRef.current) {
        scrollListenerRef.current = () => {
          handleScroll();
          scrollListenerRef.current = null;
        };
        requestAnimationFrame(scrollListenerRef.current);
      }
    };

    window.addEventListener("scroll", throttledScrollHandler);

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [showScrollTopButton]);

  useEffect(() => {
    dispatch(clearAllFilters());

    if (typeof window === "undefined" || window.innerWidth < 769) return;

    // Dynamically import ScrollTrigger and run the animations after it's available
    import("gsap/ScrollTrigger").then((mod) => {
      const ScrollTrigger = mod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Use matchMedia from the imported ScrollTrigger
      ScrollTrigger.matchMedia({
        "(min-width: 769px)": () => {
          gsap.fromTo(
            ".image-container",
            { opacity: 1, yPercent: 0 },
            {
              opacity: 0.1,
              yPercent: 0,
              ease: "power1.out",
              scrollTrigger: {
                trigger: ".image-container",
                start: "75% top",
                end: "top bottom",
                scrub: 0.9,
                onUpdate: (self) => {
                  const imageContainer = document.querySelector('.image-container') as HTMLElement | null;
                  if (imageContainer) {
                    imageContainer.style.pointerEvents = self.progress > 0.75 ? 'none' : 'auto';
                  }
                },
              },
            }
          );

          gsap.fromTo(
            ".about-page",
            { y: 0 },
            {
              y: "0",
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".about-page",
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            ".navbar-container-main",
            { opacity: 1, yPercent: 0 },
            {
              opacity: 0,
              yPercent: -20,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".about-page",
                start: "top bottom",
                end: "top center",
                scrub: true,
              },
            }
          );
        },

        "(max-width: 768px)": () => {
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        },
      });
      
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    });
  }, []);


  return (

    <>
      <main className="bg-primary w-full" role="main-root">
        <section className="relative h-screen image-container">
          <ImageContainer aboutRef={aboutRef} footerRef={footerRef} />
        </section>

        <section className="bg-white w-full about-page" ref={aboutRef}>
          <AboutPage />
        </section>

        <section className="max-[769px]:relative bg-primary h-screen scroll-explore panel">
          <ExplorePage />
        </section>

        <section className="top-0 z-40 max-[769px]:relative sticky bg-white w-full min-h-screen">
          <PopularLocation />
        </section> 


        {showScrollTopButton && (
          <button
            onClick={scrollToTop}
            className="right-5 bottom-32 z-[99999] fixed bg-primary shadow-lg p-3 border rounded-full focus:outline-none text-white hover:scale-110 transition-transform duration-300 transform"
            aria-label="Scroll to top"
            style={{ willChange: "transform, opacity", opacity: showScrollTopButton ? 1 : 0 }}
          >
            <FaArrowUp size={20} />
          </button>
        )}
        <RequestWhatsappWrapper>
          <button
            className="right-5 bottom-[4.5rem] z-[99999] fixed bg-[#0CC143] shadow-lg p-3 border rounded-full focus:outline-none text-white hover:scale-110 transition-transform duration-300 transform"
            aria-label="Contact Through Whatsapp"
          >
            <FaWhatsapp size={20} />
          </button>
        </RequestWhatsappWrapper>
      </main>

      <Footer footerRef={footerRef} />

    </>
  );
}
