import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from '@/public/Logo.png'
import logoLowSat from '@/public/Logo_low_sat.png'
import Image from "next/image";
import defaultImage from '@/public/shared/DefaultLocation.png'
import { PAYMENT_STATUS_TYPES } from "@/common/constants";

interface RoomDetailsProps {
  name: string, maxHeadCount: number, roomCount: number, unitPrice: number
}


const formatString = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ReservationDetailsTemplate = ({ code, propertyName, checkin, checkout, adults, child, isEntireProperty, propertyType, owner, cancellationPolicy, propertyImage, roomDetails, subTotal, netTotal, securityFee, paymentStatus, paymentType }:
  {
    code: string, propertyName: string, checkin: string | Date, checkout: string | Date, adults: number, child: number, isEntireProperty: boolean, propertyType: string, owner: string,
    cancellationPolicy: string, propertyImage: string | undefined, roomDetails: RoomDetailsProps[] | null, subTotal: number, netTotal: number, securityFee: number, paymentStatus: string, paymentType: string
  }) => {
  return (

    <Card className="flex flex-col justify-start bg-transparent shadow-none px-6 border-none rounded-xl w-full font-poppins">
      <CardHeader className="flex justify-between items-center pb-4 border-b">
        <CardTitle className="flex justify-between items-start w-full text-gray-800 text-4xl">
          <div className="gap-5 grid">
            <h1>Your receipt from Serviced Apartments</h1>
            <p className="text-primary text-3xl">
              <span className="font-semibold">Reservation Code :</span> <span className="font-normal">{code}</span>
            </p>
          </div>
          <Image
            src={logo}
            alt="Service apartments Logo"
            className="w-auto h-20 object-cover"
          />
        </CardTitle>

      </CardHeader>

      <CardContent>

        <section className="gap-6 grid grid-cols-2 mt-6 pb-6 border-b">
          <div className="p-6 border rounded-lg">
            <div className="flex justify-between items-start gap-6 w-full">
              <div className="text-3xl">
                <h2 className="font-semibold">{propertyName}</h2>
                <p >For {adults} Adult {child > 0 ? `and ${child} Child${child > 1 ? 'ren' : null}` : null}</p>
                <p className="text-gray-600 text-2xl">
                  {new Date(checkin!).toDateString()} → {new Date(checkout).toDateString()}
                </p>
                {
                  isEntireProperty && (
                    <p className="mt-2 text-2xl">Entire {propertyType}</p>
                  )
                }

                <p className="text-gray-600 text-2xl">Hosted by {owner}</p>
              </div>
              <Image
                src={propertyImage || defaultImage}
                alt="Listing Image"
                width={20}
                height={20}
                className="mt-2 rounded w-auto h-44"
              />
            </div>
            <div>
              {roomDetails && (
                <div className="gap-2 grid grid-cols-1 mt-6">
                  {roomDetails.map((unit: any, index) => (

                    <div key={index} className="flex justify-between items-center gap-2 p-3 border rounded-lg">

                      <div className='flex flex-col items-start gap-1'>
                        <p className="font-medium text-2xl">{unit.name}</p>
                        <p className="text-gray-500 text-xl">Room Count: {unit.roomCount}</p>
                        <p className="text-gray-500 text-xl">Max Guests: {unit.maxHeadCount}</p>
                        <p className="font-medium text-xl">Price: ${unit.unitPrice}</p>
                      </div>
                      <Image src={propertyImage!} alt={'Property'} width={100} height={100} className='rounded-lg w-28 h-auto aspect-square' />
                    </div>

                  ))}
                </div>
              )

              }
            </div>
            <div className="mt-6 text-2xl">
              <p><strong>Cancellation Policy</strong></p>
              <p className="text-gray-600">{cancellationPolicy}</p>

            </div>
          </div>


          <div className="gap-6 grid grid-rows-2 text-2xl">
            <div className="gap-1 grid p-6 border rounded-lg">
              <div className="flex justify-between items-center w-full">
                <h2 className="font-semibold text-3xl">Price Breakdown</h2>

              </div>

              <p className="flex justify-between">
                <span>Sub total</span> <span>${subTotal}</span>
              </p>
              <p className="flex justify-between">
                <span>Security fee</span> <span>${securityFee}</span>
              </p>
              <hr className="my-2" />
              <p className="flex justify-between font-semibold text-3xl">
                <span>TOTAL (USD)</span> <span>${netTotal}</span>
              </p>
            </div>



            <div className="p-6 border rounded-lg text-3xl">
              <h2 className="font-semibold">Payment</h2>
              <p className="flex justify-between mt-3 text-2xl">
                <span>{formatString(paymentType)}</span> <span>${netTotal}</span>
              </p>
              <p className="flex justify-between mt-3 text-2xl">
                <span>Status</span>
                <span className={`font-medium text-xl 
                                                                            ${paymentStatus === PAYMENT_STATUS_TYPES.SUCCESS ? 'text-green-600' :
                    paymentStatus === PAYMENT_STATUS_TYPES.FAILED ? 'text-red-500' :
                      paymentStatus === PAYMENT_STATUS_TYPES.PENDING ? 'text-yellow-500' :
                        'text-gray-500'}`}>{formatString(paymentStatus!)}
                </span>
              </p>
            </div>
          </div>
        </section>
      </CardContent>

      <footer className="gap-6 grid mt-6 text-gray-500 text-3xl">
        <div className="text-2xl">
          <p><strong>Serviced apartments service fee</strong></p>
          <p>Includes applicable VAT charges.</p>

        </div>

        <div className="flex justify-between items-start w-full text-2xl">
          <div>
            <p><strong>Payments processed by</strong></p>
            <p>Service Apartments Payments (pvt)Ltd.</p>
            <p>40 Compton St, London, EC1V 0AP, United Kingdom</p>
            <p>
              <a href="https://www.servicedapartments.lk/" className="text-secondary" target="_blank">
                www.servicedapartments.lk
              </a>
            </p>
          </div>


          <div>
            <Image
              src={logoLowSat}
              alt="Service apartments Logo"
              className="w-auto h-20"
            />
          </div>
        </div>
      </footer>
    </Card>
  );
};

export default ReservationDetailsTemplate;
