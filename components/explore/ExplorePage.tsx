import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import image from "@/public/explore/background_Image.png";
import '@/styles/explore.css'
import { useRouter } from 'next/navigation';

const ExplorePage = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const textContentExploreLeftRef = useRef<SVGTextElement | null>(null);
    const rectRefs = useRef<(SVGRectElement | null)[]>([]);
    const lineRefs = useRef<(SVGLineElement | null)[]>([]);
    const vLineRefs = useRef<(SVGLineElement | null)[]>([]);
    const textRef = useRef<(SVGTextElement | null)>(null);
    const mainContentRef = useRef<(HTMLDivElement | null)>(null);
    const rotatingCircleRef = useRef<(SVGCircleElement | null)>(null);
    const rotatingCirclePathRef = useRef<(SVGCircleElement | null)>(null);
    const rectHoverRef = useRef<(SVGRectElement | null)>(null);
    const rectHoverRightRef = useRef<(SVGRectElement | null)>(null);
    const textChildRef = useRef<(SVGTextElement | null)[]>([]);
    const circleRef = useRef<(SVGPathElement | null)[]>([]);

    const animationsTriggered = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {

                if (entry.isIntersecting && !animationsTriggered.current) {
                    animationsTriggered.current = true;

                    lineRefs.current.forEach((line) => {
                        if (entry.isIntersecting) {
                            line?.classList.add('line-animation-horizontal');
                        } else {
                            line?.classList.remove('line-animation-horizontal');
                        }
                    });
                    vLineRefs.current.forEach((line) => {
                        if (entry.isIntersecting) {
                            line?.classList.add('line-animation-vertical');
                        } else {
                            line?.classList.remove('line-animation-vertical');
                        }
                    });
                    rectRefs.current.forEach((rect) => {
                        if (entry.isIntersecting) {
                            rect?.classList.add('rect-animation');
                        } else {
                            rect?.classList.remove('rect-animation');
                        }
                    });

                    textChildRef.current.forEach((text) => {
                        if (text) {
                            if (entry.isIntersecting) {
                                text.classList.add('reveal-text-animation');
                            } else {
                                text.classList.remove('reveal-text-animation');
                            }
                        }
                    });
                    circleRef.current.forEach((path) => {
                        if (path) {
                            if (entry.isIntersecting) {
                                path.classList.add('path-animation');
                            } else {
                                path.classList.remove('path-animation');
                            }
                        }
                    });

                    if (textRef.current) {
                        if (entry.isIntersecting) {
                            textRef.current.classList.add('text-animation');
                        } else {
                            textRef.current.classList.remove('text-animation');
                        }
                    }
                    if (rectHoverRef.current) {
                        if (entry.isIntersecting) {
                            rectHoverRef.current.classList.add('hover-rectangle-explore-left');
                        } else {
                            rectHoverRef.current.classList.remove('hover-rectangle-explore-left');
                        }
                    }
                    if (rectHoverRightRef.current) {
                        if (entry.isIntersecting) {
                            rectHoverRightRef.current.classList.add('hover-rectangle-explore');
                        } else {
                            rectHoverRightRef.current.classList.remove('hover-rectangle-explore');
                        }
                    }
                    if (rotatingCircleRef.current) {
                        if (entry.isIntersecting) {
                            rotatingCircleRef.current.classList.add('rotating-dash-circle');
                        } else {
                            rotatingCircleRef.current.classList.remove('rotating-dash-circle');
                        }
                    }
                    if (rotatingCirclePathRef.current) {
                        if (entry.isIntersecting) {
                            rotatingCirclePathRef.current.classList.add('path-animation-rotate');
                        } else {
                            rotatingCirclePathRef.current.classList.remove('path-animation-rotate');
                        }
                    }
                    if (mainContentRef.current) {
                        if (entry.isIntersecting) {
                            mainContentRef.current.classList.add('reveal-opacity');
                        } else {
                            mainContentRef.current.classList.remove('reveal-opacity');
                        }
                    }
                    if (textContentExploreLeftRef.current) {
                        if (entry.isIntersecting) {
                            textContentExploreLeftRef.current.classList.add('text-content-explore-left');
                        } else {
                            textContentExploreLeftRef.current.classList.remove('text-content-explore-left');
                        }
                    }

                }
            },
            {
                root: null,
                threshold: 0.1,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    const handleNavigation = () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 3);

        const queryParams: Record<string, any> = {
            destination: '',
            place_id: undefined,
            checkin: today.toISOString(),
            checkout: tomorrow.toISOString(),
            no_adults: '1',
            no_rooms: '1',
            no_children: '0',
            pets: false.toString(),
        };

        const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== "")
        );

        const params = new URLSearchParams(filteredParams).toString();

        router.push(`/search-results?${params}`);
    }

    return (
        <div ref={containerRef} className='relative bg-primary p-20 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full h-screen overflow-hidden Explore-main-container'>


            <Image
                loading="lazy"
                src={image}
                alt="Serviced Apartments Pool View hotel"
                className='top-0 left-0 absolute opacity-[46%] w-full h-full object-cover'
            />


            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={
                `
                absolute top-0 right-0 w-full h-full overflow-hidden
                max-[1441px]:h-[83%] max-[1441px]:right-[0] max-[1441px]:top-[14%]
                max-[1300px]:h-[78%] max-[1300px]:right-[10] max-[1300px]:top-[14%]
                max-[1030px]:h-[64%] max-[1030px]:right-[10] max-[1030px]:top-[14%]
                max-[431px]:h-[51%] max-[431px]:right-0 max-[431px]:!top-[49%] max-[431px]:w-[207%]
                max-[1001px]:hidden
                `
            }
                // preserveAspectRatio="xFullYMax meet"
                onClick={handleNavigation}
            >
                {/* Horizontal Lines */}
                <line x1="40" y1="14.285%" x2="153.3%" y2="14.285%" stroke="white" strokeWidth="0.15" className="horizontal-line" ref={(el) => { lineRefs.current[0] = el }} />
                <line x1="53.3" y1="42.855%" x2="153.3%" y2="42.855%" stroke="white" strokeWidth="0.15" className="horizontal-line" ref={(el) => { lineRefs.current[1] = el }} />
                <line x1="-54" y1="71.425%" x2="153.3%" y2="71.425%" stroke="white" strokeWidth="0.15" className="horizontal-line" ref={(el) => { lineRefs.current[2] = el }} />
                <line x1="-54" y1="100%" x2="153.3%" y2="100%" stroke="white" strokeWidth="0.15" className="horizontal-line" ref={(el) => { lineRefs.current[3] = el }} />

                {/* Vertical Lines */}
                <line x1="53.33%" y1="0" x2="53.33%" y2="100%" stroke="white" strokeWidth="0.15" className='vertical-line' ref={(el) => { vLineRefs.current[0] = el }} />
                <line x1="86.66%" y1="7" x2="86.66%" y2="100%" stroke="white" strokeWidth="0.15" className='vertical-line' ref={(el) => { vLineRefs.current[1] = el }} />
                <line x1="119.99%" y1="0" x2="119.99%" y2="100%" stroke="white" strokeWidth="0.15" className='vertical-line' ref={(el) => { vLineRefs.current[2] = el }} />
                <line x1="153.5%" y1="0" x2="153.5%" y2="100%" stroke="white" strokeWidth="0.15" className='vertical-line' ref={(el) => { vLineRefs.current[3] = el }} />


                <rect
                    x="86.66%"
                    y="14.285%"
                    width="33.33%"
                    height="28.57%"
                    fill="white"
                    fillOpacity="0.43"
                    ref={(el) => { rectRefs.current[0] = el }}
                />
                <text
                    x="86.66%"
                    y="14.285%"
                    fill="white"
                    textAnchor="start"
                    dominantBaseline="hanging"
                    // className='text-animation'
                    ref={textRef}
                >
                    <tspan x="89.66%" dy="1.1em" className='font-light text-[3.5px] tracking-wide'>Start Your First</tspan>
                    <tspan x="89.66%" dy="1.1em" className='font-light text-[3.5px] tracking-wide'>Booking With</tspan>
                    <tspan x="89.66%" dy="1.1em" className='font-light text-[3.5px] tracking-wide'>Us</tspan>
                </text>


                <rect
                    x="119.99%"
                    y="42.855%"
                    width="33.33%"
                    height="28.57%"
                    fill="white"
                    fillOpacity="0.43"
                    ref={(el) => { rectRefs.current[1] = el }}
                />

                <circle
                    cx="110%"
                    cy="35%"
                    r="5.5%"
                    fill="transparent"
                    stroke="white"
                    strokeOpacity="0.6"
                    strokeWidth="0.5"
                    strokeDasharray="30, 5"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    ref={rotatingCircleRef}
                />
                <path
                    d="M0.615827 33.8105L32.9836 6.52913L7.41965 4.34928L7.49325 0.897726L39.1438 3.59659L36.4449 35.2472L33.0308 34.7353L35.2106 9.1714L2.84288 36.4528L0.615827 33.8105Z"
                    fill="white"
                    ref={rotatingCirclePathRef}
                    transform="scale(0.1) translate(1080, 330)"
                />


                <rect
                    x="119.99%"
                    y="14.285%"
                    width="33.33%"
                    height="28.57%"
                    fill="transparent"
                    fillOpacity="0.43"
                    ref={rectHoverRightRef}
                />
                {/* arrow icon  */}

                <g transform="scale(0.15) translate(810, 218)" className="bottom-top-top-explore">
                    <rect
                        x="27.8485"
                        y="0.821853"
                        width="37.1062"
                        height="37.1062"
                        rx="18.5531"
                        transform="rotate(45 27.8485 0.821853)"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeOpacity="0.46"
                        fill="transparent"
                    />
                    <path
                        d="M22.5705 31.5858L31.9876 22.1687L23.9158 22.1687L23.8466 21.0848L33.8403 21.0848L33.8403 31.0785L32.7564 31.0093L32.7564 22.9375L23.3392 32.3546L22.5705 31.5858Z"
                        fill="white"
                    />
                </g>

                <text
                    x="119.99%"
                    y="32.285%"
                    className="text-content-explore"
                >
                    <tspan x="130.99%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">Ready to experience </tspan>
                    <tspan x="130.99%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">luxury and convenience? </tspan>
                    <tspan x="130.99%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">Reserve your stay now </tspan>
                    <tspan x="130.99%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">and let us handle the rest.</tspan>
                </text>

                <text
                    x="119.99%"
                    y="14.285%"
                    fill="white"
                    textAnchor="start"
                    dominantBaseline="hanging"
                >
                    <tspan x="122.99%" dy="1.1em" className="font-light text-[3.5px] tracking-wide pointer-events-none" ref={(el) => { textChildRef.current[0] = el }}>Local Attractions</tspan>
                    <tspan x="122.99%" dy="1.1em" className="font-light text-[3.5px] tracking-wide pointer-events-none" ref={(el) => { textChildRef.current[1] = el }}>Nearby</tspan>
                </text>



                <rect
                    x="53.33%"
                    y="42.855%"
                    width="33.33%"
                    height="28.57%"
                    fill="transparent"
                    fillOpacity="0.43"
                    ref={rectHoverRef}
                />
                {/* arrow icon  */}

                <g transform="scale(0.15) translate(360, 405)" className="bottom-top-top-explore-left" onClick={handleNavigation}>
                    <rect
                        x="0"
                        y="0"
                        width="50"
                        height="50"
                        fill="transparent"
                        style={{ cursor: "pointer" }}
                    />
                    <rect
                        x="27.8485"
                        y="0.821853"
                        width="37.1062"
                        height="37.1062"
                        rx="18.5531"
                        transform="rotate(45 27.8485 0.821853)"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeOpacity="0.46"
                        fill="transparent"
                    />
                    <path
                        d="M22.5705 31.5858L31.9876 22.1687L23.9158 22.1687L23.8466 21.0848L33.8403 21.0848L33.8403 31.0785L32.7564 31.0093L32.7564 22.9375L23.3392 32.3546L22.5705 31.5858Z"
                        fill="white"
                    />
                </g>

                <text
                    x="53.55%"
                    y="60.855%"
                    ref={textContentExploreLeftRef}
                    onClick={() => handleNavigation()}
                >
                    <tspan x="64.55%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">Ready to experience </tspan>
                    <tspan x="64.55%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">luxury and convenience? </tspan>
                    <tspan x="64.55%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">Reserve your stay now </tspan>
                    <tspan x="64.55%" dy="1.2em" className="font-poppins font-light text-[1.5px] tracking-wide">and let us handle the rest.</tspan>
                </text>

                <text
                    x="53.55%"
                    y="42.855%"
                    fill="white"
                    textAnchor="start"
                    dominantBaseline="hanging"
                >
                    <tspan x="56.55%" dy="1.1em" ref={(el) => { textChildRef.current[2] = el }} className="font-light text-[3.5px] tracking-wide cursor-pointer" onClick={() => handleNavigation()}>Book Your Stay</tspan>
                </text>


                {/* quarter circles */}
                <path
                    d="M 53.3 14.285 L 53.3 22.285 A 8 8 0 0 0 61.3 14.285 Z"
                    fill="white"
                    fillOpacity="0.43"
                    ref={(el) => { circleRef.current[0] = el }}
                />
                <path
                    d="M 53.3 14.285 L 53.3 6.285 A 8 8 0 0 0 45.3 14.285 Z"
                    fill="white"
                    fillOpacity="0.43"
                    ref={(el) => { circleRef.current[1] = el }}
                />
            </svg>


            <div className="min-[1001px]:hidden bottom-20 left-[5%] absolute flex flex-col gap-2 w-[90%]" onClick={handleNavigation}>
                <div className="bg-white bg-opacity-15 backdrop-blur-[10px] py-4 border rounded-xl w-full font-poppins text-white text-center">
                    Start Your First Booking With Us.
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-[10px] py-4 border rounded-xl w-full font-poppins text-white text-center">
                    Local Attractions Nearby
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-[10px] py-4 border rounded-xl w-full font-poppins text-white text-center">
                    Book Your Stay
                </div>
            </div>
            <div className="top-[10%] max-[431px]:top-[3%] left-[5%] z-[3] absolute max-[1001px]:w-[90%] text-white max-[1001px]:text-center reveal-opacity">
                <h2 className="font-light text-7xl leading-normal max-[450px]:leading-none max-[770px]:leading-tight tracking-wide">Feel Like Home,</h2>
                <h2 className="max-[1001px]:left-[50%] max-[1001px]:relative w-[800px] font-medium leading-tight tracking-wide max-[1001px]:translate-x-[-50%] explore-title-responsive">
                    Anywhere in
                </h2>
                <h2 className="max-[1001px]:left-[50%] max-[1001px]:relative w-[600px] font-medium leading-none tracking-wide max-[1001px]:translate-x-[-50%] explore-title-responsive">
                    Sri Lanka
                </h2>
                <p className="max-[1001px]:left-[50%] max-[1001px]:relative max-[430px]:mt-5 w-[575px] max-[1210px]:w-[400px] max-[530px]:w-[100%] tracking-wider max-[1001px]:translate-x-[-50%] sub-title-responsive">
                    Experience the elegance of Sri Lanka with our premium lodging alternatives, offering the warmth and hospitality akin to one's own home.
                </p>
            </div>
        </div>
    );
};

export default ExplorePage;
