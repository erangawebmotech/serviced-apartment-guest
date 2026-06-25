"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/hotel-single-view/StartsRating";
import { FaCheck, FaStar } from "react-icons/fa";
import { CancellationPolicy, formatDate, Property } from "./ResultPage";
import { Ref } from "react";

export const cleanAndTrimDescription = (htmlString: string) => {
  const text = htmlString.replace(/<[^>]+>/g, "");
  return text.length > 255 ? text.substring(0, 255).trim() + "..." : text;
};

interface RoomCardProps {
  title: string;
  discount?: string;
  image: StaticImageData | string;
  price: string | number;
  checkIn: Date;
  checkOut: Date;
  averageReviews: number;
  totalReviews: number;
  unitCategoryName: string | [];
  ref: Ref<HTMLDivElement> | undefined;
  cancellationPolicy: CancellationPolicy[];
  unitDetails: {
    id: number;
    leftUnitCount: number | null;
    name: string | null;
    price: number;
    reservationCount: number | null;
    size: number | null;
    unitCategoryName: string | null;
    bedDetails: {
      bedType: {
        id: number;
        name: string;
      };
      count: number;
    }[];
  }[];
  property: Property;
  description: string;
  count: {
    adults: number;
    children: number;
    rooms: number;
    pets: boolean;
  };
}

export default function ResultCard({
  title,
  discount,
  checkIn,
  checkOut,
  count,
  image,
  price,
  averageReviews,
  totalReviews,
  unitCategoryName,
  description,
  ref,
  unitDetails,
  cancellationPolicy,
  property,
}: RoomCardProps) {
  const handleNavigate = (
    id: Property,
    checkin?: Date,
    checkout?: Date,
    counts?: { adults: number; children: number; rooms: number; pets: boolean }
  ) => {
    const url = new URL(
      `/${id?.propertyType?.name.toLowerCase() || "hotel"}/${id?.slug || ""}`,
      window.location.origin
    );

    if (checkin) url.searchParams.set("checkin", formatDate(checkin));
    if (checkout) url.searchParams.set("checkout", formatDate(checkOut));
    if (counts?.adults)
      url.searchParams.set("adults", counts?.adults.toString());
    if (counts?.children)
      url.searchParams.set("children", counts?.children.toString());
    if (counts?.rooms) url.searchParams.set("rooms", counts?.rooms.toString());

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      ref={ref}
      className="flex flex-row max-[1000px]:flex-col max-[1000px]:justify-center max-[1000px]:items-center gap-10 max-[1030px]:gap-0 max-[1372px]:gap-5 bg-white max-[1000px]:bg-transparent shadow-sm max-[1000px]:shadow-none max-[1000px]:m-5 mb-5 max-[1030px]:mb-2 max-[1372px]:mb-4 ml-5 max-[1030px]:ml-2 max-[1372px]:ml-4 max-[1000px]:p-1 max-[1372px]:p-3 px-5 py-6 border max-[1000px]:border-none rounded-lg w-full max-[1000px]:w-[90%] max-[1000px]:max-w-[390px] font-poppins cursor-default"
      onClick={() => {
        handleNavigate(property, checkIn, checkOut, count);
      }}
    >
      <div className="relative flex w-max max-[1000px]:w-full h-max">
        <div className="relative w-64 max-[1000px]:w-full max-[1372px]:w-64 aspect-square">
          <Image
            loading="lazy"
            src={image}
            alt={title || "Serviced Apartments Property"}
            fill
            decoding="async"
            style={{ contain: "paint" }}
            className="rounded-lg object-cover"
          />
          <span className="block top-2 left-2 absolute bg-primary/80 px-3 py-1 rounded-lg text-white text-xs">
            {property?.propertyType?.name || ""}
          </span>
        </div>
      </div>
      <CardContent className="flex flex-col flex-1 justify-between max-[1000px]:bg-transparent max-[1372px]:p-1 max-[1000px]:pl-1 max-[1030px]:pl-3 max-[1372px]:pl-6 max-[1000px]:w-full">
        <div>
          <span className="max-[1000px]:hidden font-semibold text-lg">
            {title || "Undefined"}
          </span>

          <div className="max-[1000px]:flex justify-between w-[100%]">
            <div>
              <span className="min-[1000px]:hidden font-semibold text-base">
                {title || "Undefined"}
              </span>
              <div className="flex max-[1000px]:flex-col justify-start items-start gap-2 max-[1000px]:gap-0 text-sm max-[1000px]:text-sm">
                <span className="max-[1000px]:hidden">
                  <StarRating rating={averageReviews} />
                </span>
                <span className="hidden max-[1000px]:flex justify-center items-center gap-1">
                  <FaStar className="text-[#F2994A]" />
                  {averageReviews}
                </span>
                <h3 className="max-[1000px]:text-xs">
                  {" "}
                  {totalReviews ? `${totalReviews} Reviews` : 'Not rated yet'}
                </h3>
              </div>
            </div>
            <div className="hidden max-[1000px]:flex flex-col justify-start items-end">
              {/* <div className="font-semibold text-lg">${price}</div> */}
              <div className="flex justify-start items-center gap-2">
                {property?.priceWithDiscount ? (
                  <div className="text-red-500 text-sm line-through">
                    ${price}
                  </div>
                ) : (
                  <div>
                    {property?.priceWithDiscount === 0 ? (
                      <div className="text-red-500 text-sm line-through">
                        ${price}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}

                {property?.priceWithDiscount ? (
                  <div className="font-bold text-lg">
                    ${property?.priceWithDiscount}
                  </div>
                ) : (
                  <div className="font-bold text-lg">{
                    property?.priceWithDiscount === 0 ? (<span className="text-green-700">Free</span>) : (<span>${price}</span>)
                  }</div>
                )}
              </div>
              {property?.nightCount > 0 && (
                <div className="text-gray-700 text-xs">
                  For {property?.nightCount} nights
                </div>
              )}
              <div className="text-gray-500 text-xs">
                Includes taxes and fees
              </div>
            </div>
          </div>

          <div className="text-primary text-xs">
            {`${property?.location?.city?.name || ""}, ${property?.location?.district?.name || ""
              }`}

            {property?.hasBreakfast && (
              <p className="text-green-700 text-xs">Breakfast included</p>
            )}
          </div>

          <div className="max-[1000px]:hidden flex flex-col gap-1 my-2">
            <span className="font-medium text-sm">{unitCategoryName}</span>
            <div className="relative flex flex-col gap-1">
              {property?.allowEntireProperty &&
                !property?.allowIndividualUnit ? (
                <>
                  <div className="flex flex-col gap-5">
                    <p className="text-xs">
                      {cleanAndTrimDescription(description)}
                    </p>

                    <div>
                      {unitDetails &&
                        unitDetails.length === 1 &&
                        cancellationPolicy.length > 0 &&
                        (cancellationPolicy[0].shortCancellationPolicy?.name ||
                          cancellationPolicy[0].longCancellationPolicy?.name) ? (
                        <div>
                          <ul className="text-primary text-xs">
                            {cancellationPolicy[0].shortCancellationPolicy
                              ?.name ? (
                              <li className="flex items-center gap-2">
                                <FaCheck size={10} />
                                {
                                  cancellationPolicy[0].shortCancellationPolicy
                                    .name
                                }
                              </li>
                            ) : null}

                            {cancellationPolicy[0].longCancellationPolicy
                              ?.name ? (
                              <li className="flex items-center gap-2">
                                <FaCheck size={10} />
                                {
                                  cancellationPolicy[0].longCancellationPolicy
                                    .name
                                }
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {unitDetails.map((unitDetail, index) => (
                    <div
                      className="relative flex items-start gap-5 w-full h-max"
                      key={index}
                    >
                      <div className="relative flex flex-col items-center h-20">
                        <div className="bg-gray-200 w-[0.15rem] h-full"></div>
                        <div className="top-0 -left-3 absolute bg-gray-200 p-1 border rounded-md font-medium text-gray-800 text-xs">
                          {unitDetail?.reservationCount || 1}×
                        </div>
                      </div>
                      <div className="h-max">
                        <h2 className="font-bold text-gray-800 text-xs">
                          {unitDetail?.unitCategoryName || ""}
                        </h2>
                        <p className="mt-1 text-gray-600 text-xs">
                          <span className="font-medium">
                            {unitDetail?.size ? `${unitDetail.size}m²` : ""}
                          </span>

                          {/* Private suite • 1 bedroom • <span className="font-medium">158m²</span> */}
                        </p>
                        <p className="mt-1 text-gray-600 text-xs">
                          {(() => {
                            const beds =
                              unitDetail?.bedDetails?.filter(
                                (bed) => bed.count >= 1
                              ) || [];
                            return `${beds.length} bed${beds.length > 1 ? "s" : ""
                              } (${beds
                                .map(
                                  (bed) =>
                                    `${bed.count
                                    } ${bed.bedType.name.toLowerCase()}`
                                )
                                .join(", ")})`;
                          })()}
                        </p>

                        {unitDetail?.leftUnitCount &&
                          unitDetail?.leftUnitCount < 2 ? (
                          <span className="max-[1000px]:mt-2 font-medium text-red-600 text-xs">
                            Only {unitDetail?.leftUnitCount} room
                            {unitDetail?.leftUnitCount > 1 ? "s" : ""} left at
                            this price on our site
                          </span>
                        ) : (
                          <span className="max-[1000px]:mt-2 font-medium text-green-700 text-xs">
                            {unitDetail?.leftUnitCount} rooms available
                          </span>
                        )}

                        <div>
                          {unitDetails &&
                            unitDetails.length === 1 &&
                            cancellationPolicy.length > 0 &&
                            (cancellationPolicy[0].shortCancellationPolicy
                              ?.name ||
                              cancellationPolicy[0].longCancellationPolicy
                                ?.name) ? (
                            <div>
                              <ul className="text-primary text-xs">
                                {cancellationPolicy[0].shortCancellationPolicy
                                  ?.name ? (
                                  <li className="flex items-center gap-2">
                                    <FaCheck size={10} />
                                    {
                                      cancellationPolicy[0]
                                        .shortCancellationPolicy.name
                                    }
                                  </li>
                                ) : null}

                                {cancellationPolicy[0].longCancellationPolicy
                                  ?.name ? (
                                  <li className="flex items-center gap-2">
                                    <FaCheck size={10} />
                                    {
                                      cancellationPolicy[0]
                                        .longCancellationPolicy.name
                                    }
                                  </li>
                                ) : null}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hidden max-[1000px]:hidden max-[1372px]:flex flex-row justify-between items-center mt-3 w-full">
          <div className="flex flex-col justify-start items-start gap-2">
            {discount && (
              <Badge className="bg-green-600 font-normal text-white">
                {discount}
              </Badge>
            )}
            <div>
              <div className="flex justify-start items-center gap-2">
                {property?.priceWithDiscount ? (
                  <div className="text-red-500 text-sm line-through">
                    ${price}
                  </div>
                ) : (
                  <div>
                    {property?.priceWithDiscount === 0 ? (
                      <div className="text-red-500 text-sm line-through">
                        ${price}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}

                {property?.priceWithDiscount ? (
                  <div className="font-bold text-lg">
                    ${property?.priceWithDiscount}
                  </div>
                ) : (
                  <div className="font-bold text-lg">{
                    property?.priceWithDiscount === 0 ? (<span className="text-green-700">Free</span>) : (<span>${price}</span>)
                  }</div>
                )}
              </div>
              {property?.nightCount > 0 && (
                <div className="text-gray-700 text-xs">
                  For {property?.nightCount} nights
                </div>
              )}
              <div className="text-gray-500 text-xs">
                Includes taxes and fees
              </div>
            </div>
          </div>

          <Button size={"lg"} className="w-32 font-light">
            See availability
          </Button>
        </div>
      </CardContent>
      <div className="max-[1372px]:hidden flex flex-col justify-between items-start gap-3 w-max">
        <div className="flex flex-col justify-start items-start gap-2">
          {discount && (
            <Badge className="bg-green-600 font-normal text-white">
              {discount}
            </Badge>
          )}
          <div>
            <div className="flex justify-start items-center gap-2">
              {property?.priceWithDiscount ? (
                <div className="text-red-500 text-sm line-through">
                  ${price}
                </div>
              ) : (
                <div>
                  {property?.priceWithDiscount === 0 ? (
                    <div className="text-red-500 text-sm line-through">
                      ${price}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}

              {property?.priceWithDiscount ? (
                <div className="font-bold text-lg">
                  ${property?.priceWithDiscount}
                </div>
              ) : (
                <div className="font-bold text-lg">{
                  property?.priceWithDiscount === 0 ? (<span className="text-green-700">Free</span>) : (<span>${price}</span>)
                }</div>
              )}
            </div>
            {property?.nightCount > 0 && (
              <div className="text-gray-700 text-xs">
                For {property?.nightCount} nights
              </div>
            )}
            <div className="text-gray-500 text-xs">Includes taxes and fees</div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          {property?.monthlyRateApplied && (
            <div className="font-medium text-red-500 text-xs">
              Monthly Charges Applied
            </div>
          )}
          <Button
            size={"lg"}
            className="font-normal"
            onClick={() => {
              handleNavigate(property, checkIn, checkOut, count);
            }}
          >
            See availability
          </Button>
        </div>
      </div>
    </Card>
  );
}
