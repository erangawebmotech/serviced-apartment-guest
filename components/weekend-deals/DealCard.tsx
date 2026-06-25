"use client";

import React, { memo } from "react";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { Rating } from "@/common/types";
import { GoArrowUpRight } from "react-icons/go";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import defaultLocation from '@/public/shared/DefaultLocation.png'
import defaultLocationHover from '@/public/shared/DefaultLocationHover.png'
import { formatDate } from "@/components/search-results/ResultPage";


const DealCard = ({
  option1,
  option2,
  name,
  id,
  address,
  favorite, // eslint-disable-line
  rating,
  slug,
  type,
  offer = 0
}: {
  option1: string;
  id: number;
  slug: string;
  option2: string;
  name: string;
  address: string;
  favorite: boolean;
  rating: Rating;
  type: string;
  offer?: number;
}) => {

  const handleNavigate = (slug: string, type: string) => {
    const url = new URL(`/${type.toLowerCase()}/${slug || ''}`, window.location.origin);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 3);

    url.searchParams.set("checkin", formatDate(today));
    url.searchParams.set("checkout", formatDate(tomorrow));

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  const patternOptionId = `bgPatternOption-${id}`;
  const patternHoverOptionId = `bgPatternOptionHover-${id}`;
  return (
    <>
      <div className="relative m-5 sm:mx-10 w-max h-max deal-container [clip-path:inset(0_-9999px_-9999px_0)]">

        {
          offer > 0 && (
            <div className="top-6 -left-7 z-20 absolute bg-secondary shadow-md py-1 w-[130px] font-poppins font-semibold text-white text-xs text-center rotate-[-45deg]">
              {offer}% Off
            </div>
          )
        }

        <svg
          width="290"
          height="324"
          viewBox="0 0 290 324"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-[430px]:w-[233px] max-[900px]:w-[274px] !h-max deal-svg"
          data-testid="deal-svg"
          onClick={() => {
            handleNavigate(slug, type);
          }}
        >
          <defs>
            <pattern id={patternOptionId} patternUnits="objectBoundingBox" width="1" height="1">
              <image
                href={option1 || defaultLocation.src}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                className="image-primary"
              />
            </pattern>
            <pattern id={patternHoverOptionId} patternUnits="objectBoundingBox" width="1" height="1">
              <image
                href={option2 || defaultLocationHover.src}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                className="image-hover"
              />
            </pattern>
            <linearGradient id="textBackground" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0B161F" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <clipPath id="clipPath">
              <path
                d="M289.985 42.0202V225.62C289.985 239.143 279.534 249.943 265.358 249.943C264.449 249.943 263.449 249.943 262.45 249.943C242.275 250.76 225.917 267.277 225.19 287.425C225.19 288.696 225.281 289.876 225.281 291.146C225.281 309.751 212.468 323.637 194.838 323.637H42.0755C18.9022 323.637 0 304.85 0 281.617V42.0202C0 18.8773 18.8113 0 42.0755 0H247.909C271.174 0 289.985 18.7866 289.985 42.0202Z"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#clipPath)">
            <path
              d="M289.985 42.0202V225.62C289.985 239.143 279.534 249.943 265.358 249.943C264.449 249.943 263.449 249.943 262.45 249.943C242.275 250.76 225.917 267.277 225.19 287.425C225.19 288.696 225.281 289.876 225.281 291.146C225.281 309.751 212.468 323.637 194.838 323.637H42.0755C18.9022 323.637 0 304.85 0 281.617V42.0202C0 18.8773 18.8113 0 42.0755 0H247.909C271.174 0 289.985 18.7866 289.985 42.0202Z"
              fill={`url(#${patternOptionId})`}
              className="svg-path"
            />
            <path
              d="M289.985 42.0202V225.62C289.985 239.143 279.534 249.943 265.358 249.943C264.449 249.943 263.449 249.943 262.45 249.943C242.275 250.76 225.917 267.277 225.19 287.425C225.19 288.696 225.281 289.876 225.281 291.146C225.281 309.751 212.468 323.637 194.838 323.637H42.0755C18.9022 323.637 0 304.85 0 281.617V42.0202C0 18.8773 18.8113 0 42.0755 0H247.909C271.174 0 289.985 18.7866 289.985 42.0202Z"
              fill={`url(#${patternHoverOptionId})`}
              className="svg-hover-path"
            />
            <rect x="0" y="240" width="290" height="84" fill="url(#textBackground)" />
          </g>

          <text
            x="20"
            y={
              address?.length > 20 && address?.length < 26  && name?.length > 15 ?
                "255" :
                address?.length > 26 && name?.length > 15 ?
                  "240" :
                  name?.length > 26 && address?.length <= 26 ?
                    "255"
                    : name?.length > 15 && address?.length <= 26 ?
                      "280"
                      : name?.length <= 15 && address?.length > 26 ?
                        "258" :
                        "280"
            }
            fill="white"
            className="svg-text-title"
          >
            {(() => {
              const maxTotalLength = 30;
              const maxLineLength = 20;

              if (!name) return null;

              let displayName = name;

              if (name.length > maxTotalLength) {
                displayName = name.slice(0, maxTotalLength - 3) + "...";
              }

              const words = displayName.split(" ");
              const lines: string[] = [];
              let currentLine = "";

              // Split name into words including punctuation breakpoints
              const splitWord = (word: string): string[] => {
                return word
                  .split(/([-,/()])/g)        // split while keeping delimiters
                  .filter(Boolean)
                  .reduce((acc: string[], part) => {
                    if (part.match(/[-,/()]/)) {
                      // attach punctuation to previous chunk
                      acc[acc.length - 1] = (acc[acc.length - 1] || "") + part;
                    } else {
                      acc.push(part);
                    }
                    return acc;
                  }, []);
              };

              const processedWords = words.flatMap(splitWord);

              processedWords.forEach((word) => {
                if ((currentLine + " " + word).trim().length <= maxLineLength) {
                  currentLine += (currentLine ? " " : "") + word;
                } else {
                  lines.push(currentLine);
                  currentLine = word;
                }
              });

              if (currentLine) lines.push(currentLine);

              return lines.map((line, index) => (
                <tspan key={index} x="20" dy={index === 0 ? 0 : 22}>
                  {line}
                </tspan>
              ));
            })()}
          </text>
          <text
            x="20"
            y={address.length > 26 ? "278" : "300"}
            fontSize="14"
            fill="white"
            className="svg-text-subtitle"
          >
            {(() => {
              const maxLength = 26;
              const truncateLimit = 50;
              let trimmedAddress = address;

              if (address.length > truncateLimit) {
                trimmedAddress = address.substring(0, truncateLimit).trim() + '...';
              }

              const words = trimmedAddress.split(' ');
              const lines: string[] = [];
              let currentLine = '';

              words.forEach((word) => {
                if ((currentLine + word).length <= maxLength) {
                  currentLine += (currentLine ? ' ' : '') + word;
                } else {
                  lines.push(currentLine);
                  currentLine = word;
                }
              });

              if (currentLine) lines.push(currentLine);

              return lines.map((line, index) => (
                <tspan key={index} x="20" dy={index === 0 ? 0 : 18}>
                  {line}
                </tspan>
              ));
            })()}
          </text>

          <g transform="translate(20, 305)" className="svg-text-rating-container">
            <foreignObject x="20" y="295" width="100%" height="100%">
              <div className="flex items-center space-x-2">
                {
                  rating > 0 ? (
                    <>
                      <span className="svg-text-rating text-white text-sm">Rating</span>
                      {Array.from({ length: rating }).map((_, index) => (
                        <Star key={index} size={14} color="white" className="fill-white svg-rating-star" data-testid="rating-star" />
                      ))}
                    </>
                  ) : (
                    <span className="svg-text-rating text-white text-sm">Not rated yet</span>
                  )
                }
              </div>
            </foreignObject>
          </g>
        </svg>

        <TooltipProvider delayDuration={200} >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  handleNavigate(slug, type);
                }}
                className="flex justify-center items-center p-0 rounded-full hover:scale-110 duration-300 goto-deals-details-btn"
                aria-label="Move up right"
                role="button"
              >
                <GoArrowUpRight size={48} className="flex-shrink-0 text-current !text-xl" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p className="font-poppins">Book {name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default memo(DealCard);