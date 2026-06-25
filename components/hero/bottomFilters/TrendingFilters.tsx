'use client'
import React, { useEffect, useState } from 'react'
import TrendingFilterButton from './TrendingFilterButton'
import { useMediaQuery } from 'react-responsive';
import { trendingOptions } from '@/helpers/mockArrays'
import { loadInitialHighlights } from '@/actions/services/getHighlights';

const TrendingFilters = ({ onChange }: { onChange: (id: number) => void }) => {
    const centerIndex = Math.floor(trendingOptions.length / 2)
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isSmallMobile = useMediaQuery({ maxWidth: 535 });
    const [highlights, setHighlights] = useState([])
    const highlightsCountToFetch = isSmallMobile ? 3 : isMobile ? 3 : 10;

    const shouldLoadHighlights = typeof window !== "undefined" && window.innerWidth >= 426;

    useEffect(() => {
        if (shouldLoadHighlights) {
            loadHighlights(highlightsCountToFetch);
        }
    }, [shouldLoadHighlights, highlightsCountToFetch]);

    const loadHighlights = async (perPage: number) => {
        const response = await loadInitialHighlights(perPage);
        setHighlights(response.data);
    }

    return (
        <div className={`z-30  hidden absolute min-[426px]:flex justify-center items-center gap-4 max-[800px]:gap-0.5 max-[970px]:gap-1 w-full h-min translate-x-0 top-[63%] max-[600px]:top-[68%]`}>
            {highlights && highlights.map((option: any, index) => {
                const delay = 1.2 + Math.abs(centerIndex - index) * 0.1
                return (
                    <TrendingFilterButton
                        key={option.id}
                        id={option.id}
                        icon={option.file?.smallPath}
                        label={option.name}
                        href={`/filter/${option.name}`}
                        className="reveal-from-center"
                        style={{ animationDelay: `${delay}s` }}
                        onClick={(e) => { onChange(e) }}
                    />
                )
            })}
        </div>
    )
}

export default TrendingFilters

