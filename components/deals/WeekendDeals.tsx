import React, { useEffect, useRef, useState } from 'react'
import { getUpcomingWeekend } from '@/common/commonFunctions'
import { loadInitialDiscounts } from '@/actions/services/getDeals'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import dealImage from '@/public/deals/deals.png'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Skeleton } from '../ui/skeleton'
const WeekendDeals = () => {
  const [date, setDate] = useState<{ formattedSaturday: string; formattedSunday: string } | null>(null)
  const [discounts, setDiscounts] = useState<any[]>([])
  const [discountsRecent, setDiscountsRecent] = useState<any[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const Deals = dynamic(() => import('./Deals'), { ssr: false })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    observer.current = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !hasFetched) {
          setHasFetched(true)
          setLoading(true)
          observer.current?.disconnect()

          const weekend = await getUpcomingWeekend()
          setDate(weekend)

          const response = await loadInitialDiscounts()
          const data = response.data

          if (data.length > 10) {
            const middleIndex = Math.ceil(data.length / 2)
            setDiscountsRecent(data.slice(0, middleIndex))
            setDiscounts(data.slice(middleIndex))
          } else {
            setDiscountsRecent(data)
            setDiscounts([])
          }

          setLoading(false)
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    )

    observer.current.observe(containerRef.current)

    return () => {
      observer.current?.disconnect()
    }
  }, [hasFetched])


  const handleGotoFilter = () => {
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 3);

    const queryParams: Record<string, string> = {
      destination: '',
      place_id: '',
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
    <>
      <div
        ref={containerRef}
        className={`mt-20 pb-20 w-full h-max ${discountsRecent.length === 0 && !hasFetched ? 'min-h-[100px]' : ''}`}
      >
        <div className="w-screen">
          <div className="px-20 max-[769px]:px-5">
            <h2 className="md:text-left text-center title">Deals for the weekend</h2>
            <p className="md:text-left text-center subtitle">
              {date
                ? `Save on stays for ${date.formattedSaturday} - ${date.formattedSunday}`
                : 'Loading...'}
            </p>
          </div>

          <div className="max-[769px]:m-0 mt-10">
            {loading ? (
              <div className="flex justify-center gap-4 px-5 overflow-x-hidden">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`
                      m-0 p-1 flex-shrink-0
                      max-[290px]:!basis-full 
                      max-[321px]:!basis-[88%] 
                      max-[365px]:!basis-[80%] 
                      max-[500px]:!basis-[70%] 
                      max-[610px]:!basis-[65%] 
                      max-[769px]:!basis-[55%] 
                      max-[850px]:!basis-[45%] 
                      max-[980px]:!basis-[40%] 
                      min-[980px]:!basis-[40%] 
                      min-[1535px]:!basis-[25%] 
                      min-[1720px]:!basis-1/5 
                      min-[2000px]:!basis-[18%]
                      lg:!basis-1/3 
                      xl:!basis-1/4
                      ${idx > 0 ? 'max-[768px]:hidden' : ''}
                    `}
                  >
                    <Skeleton className="bg-gray-200 rounded-xl max-w-[280px] h-[324px]" />
                  </div>
                ))}
              </div>
            ) : (
              hasFetched && discountsRecent.length > 0 && (
                <Deals discountList={discounts} discountRecent={discountsRecent} />
              )
            )}
          </div>

          {
            !loading && hasFetched && discountsRecent.length === 0 && (
              <div className="flex flex-col justify-center items-center px-4 py-10 w-full text-center">
                <Image
                  src={dealImage}
                  alt="shopping bag"
                  className="mb-4 w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28"
                />

                <p className="max-w-md font-poppins font-light text-[#404040] text-base sm:text-lg">
                  No weekend deals available right now. Check back soon for exciting
                  discounts!
                </p>

                <Button className="mt-6 px-6 sm:px-8 py-2 lg:py-6 rounded-xl font-poppins text-base sm:text-lg" onClick={handleGotoFilter}>
                  Browse All Properties
                </Button>
              </div>
            )
          }
        </div>
      </div>

      <div className={`${discountsRecent.length === 0 ? 'mt-20' : 'mt-0'}`} />
    </>
  )
}

export default WeekendDeals
