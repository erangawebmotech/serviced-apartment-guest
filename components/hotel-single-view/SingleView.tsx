"use client";

import { getHotelDetails, getHotelReviews, getHotelRooms } from '@/actions/services/getHotelDetails';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';
import defaultCoverImage from '@/public/shared/DefaultLocation.png';
import location from '@/public/single-page/locationIcon.png';
import StarRating from './StartsRating';
import PropertyDetails from './PropertyDetails';
import UserReview from './UserReview';
import '@/styles/single-poperty.css'
import HotelNotFound from './HotelNotFound';
import SinglePropertyImageView from './SinglePropertyImageView';
import SinglePropertyImageViewMobile from './SinglePropertyImageViewMobile';
import SingleViewSkeleton from './skeleton/SingleViewSkeleton';
import { PROPERTY_TYPES } from '@/common/constants';
import Navbar from '../navigation/Navbar';


const SingleView = ({ slug, checkin, checkout, adults, children, rooms }: { slug: string; checkin: string, checkout: string, adults: string, children: string, rooms: string }) => {
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isApartment, setIsApartment] = useState<boolean>(false);
    const [coverImage, setCoverImage] = useState<string | StaticImageData>(defaultCoverImage);
    const [selectedImage, setSelectedImage] = useState<string | StaticImageData>(defaultCoverImage);
    const [secondImage, setSecondImage] = useState<string | StaticImageData>(defaultCoverImage);
    const [secondImageLg, setSecondImageLg] = useState<string | StaticImageData>(defaultCoverImage);
    const [thirdImage, setThirdImage] = useState<string | StaticImageData>(defaultCoverImage);
    const [thirdImageLg, setThirdImageLg] = useState<string | StaticImageData>(defaultCoverImage);
    const [reviews, setReviews] = useState<any[]>([]);
    const [roomDetails, setRoomDetails] = useState<any>([]);
    const [allImages, setAllImages] = useState<any[]>([]);

    useEffect(() => {
        const loadHotel = async () => {

            await getHotelDetails(slug).then((res) => {
                setHotel(res.data);

                const loadReviews = async () => {
                    await getHotelReviews({ id: res?.data?.id || slug, page: 0, perPage: 4 }).then((res) => {
                        setReviews(res);
                    }).catch((error) => {
                        console.log(error.status)
                    }).finally(() => {
                        setLoading(false);
                    })

                };

                const loadRooms = async () => {

                    await getHotelRooms({ id: res?.data?.id || slug, checkIn: checkin, checkOut: checkout, adultCount: adults, roomCount: rooms, childCount: children }).then((res) => {
                        setRoomDetails(res);
                    }).catch((error) => {
                        console.log(error.status)
                    })

                };

                loadRooms();
                loadReviews();

            }).catch((error) => {
                console.log(error)
            })

        };

        loadHotel();

    }, []);


    useEffect(() => {

        if (!hotel) {
            return;
        }

        const coverImage = hotel?.propertyImages?.find((image: any) => image?.isCover)?.file.largePath || defaultCoverImage;
        setCoverImage(coverImage);
        setSelectedImage(coverImage);

        const nonCoverImages = hotel?.propertyImages?.filter((image: any) => !image?.isCover);


        const secondImage = nonCoverImages?.[0]?.file.mediumPath || defaultCoverImage;
        const secondImageLg = nonCoverImages?.[0]?.file.largePath || defaultCoverImage;
        const thirdImage = nonCoverImages?.[1]?.file.mediumPath || defaultCoverImage;
        const thirdImageLg = nonCoverImages?.[1]?.file.largePath || defaultCoverImage;

        setSecondImage(secondImage);
        setSecondImageLg(secondImageLg);
        setThirdImage(thirdImage);
        setThirdImageLg(thirdImageLg);

        setImageArray();

        if ((hotel?.propertyType?.name || '').toLowerCase() === PROPERTY_TYPES.APARTMENT) {
            setIsApartment(true);
        }

    }, [hotel]);



    const setImageArray = () => {
        if (hotel) {
            const imageArray = hotel.propertyImages?.map((property: any) => property.file) || [];
            const unitImagesArray = hotel?.unitImages?.flatMap((unit: { images: any[]; }) => unit.images.map((image: any) => image.file)) || [];
            setAllImages([...imageArray, ...unitImagesArray]);
        }

    }



    return (
        <section className="relative flex flex-col items-center bg-[#F7F7F7] mt-5 p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full">
            {loading ? (
                <SingleViewSkeleton />

            ) : !hotel ? (
                <div>
                    <HotelNotFound />
                </div>
            ) : (

                <div className='relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full'>
                    <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />

                    <div className="relative mt-5 border rounded-2xl w-full h-[70vh] max-[1300px]:h-[55vh] max-[500px]:h-[30vh] max-[770px]:h-[45vh] overflow-hidden">

                        <Image
                            src={selectedImage || defaultCoverImage}
                            alt={`${hotel.name}, Serviced Apartments`}
                            fill
                            objectFit='cover'
                            // style={{ objectFit: "cover" }}
                            priority
                        />

                        <div className="max-[1000px]:hidden absolute inset-0 bg-gradient-to-t from-[#0B161F] via-[#0B161F] to-transparent opacity-70"></div>



                        <div className='max-[1000px]:hidden bottom-0 left-0 absolute p-10 w-[50%] h-max text-wrap'>
                            <h1 className="font-bold !text-white text-2xl tracking-wider title">{hotel.name}</h1>
                        </div>

                        <div className='max-[1000px]:hidden right-0 bottom-0 absolute flex flex-col justify-center items-end gap-3 max-[1300px]:gap-1 p-10 w-[50%] h-max font-poppins text-white'>

                            <div className='flex justify-center items-center gap-2 max-[1300px]:text-sm'>
                                <StarRating rating={hotel?.summaryReviews?.averageReviews || 0} />
                                <h3>{hotel?.summaryReviews?.averageReviews || ''}
                                    {hotel?.summaryReviews?.totalReviews ? `(${hotel?.summaryReviews?.totalReviews} Reviews)` : 'Not rated yet'}
                                </h3>
                            </div>

                            <div className='flex justify-center items-center gap-2'>
                                <Image src={location} alt='Location Map mark' />
                                <p>Entire {hotel?.propertyType?.name || ''} in {hotel?.city || ''}, Sri Lanka</p>
                            </div>
                            <div className='relative flex gap-2 max-[1300px]:gap-1 p-3 !rounded-3xl w-max h-max custom-glass-container'>
                                <div className='w-max'>
                                    <div className='relative w-96 max-[1300px]:w-80 h-44 max-[1300px]:h-40'>
                                        <Image loading="lazy" src={secondImage} alt="Serviced Apartments Logo" className='rounded-3xl object-cover' fill />
                                    </div>

                                </div>
                                <div className='flex flex-col justify-between items-center gap-2 max-[1300px]:gap-1 w-max h-max'>
                                    <div className='relative w-32 max-[1300px]:w-28 h-32 max-[1300px]:h-28'>
                                        <Image loading="lazy" src={thirdImage} alt="Serviced Apartments Logo" className="rounded-xl object-cover" fill />
                                    </div>


                                    <SinglePropertyImageView defaultImages={allImages} name={`${hotel?.name} - ${hotel?.city}` || 'Undefined'} reviews={reviews} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='min-[500px]:hidden flex gap-1 py-2 w-full'>
                        <div className={`w-24 h-16 relative border-primary border-0 rounded-lg ${selectedImage === coverImage ? 'border-2' : ''}`} onClick={() => { setSelectedImage(coverImage) }}>
                            <Image loading="lazy" src={coverImage} alt="Serviced Apartments Logo" className='rounded-lg object-cover' fill />
                        </div>
                        <div className={`w-24 h-16 relative border-primary border-0 rounded-lg ${selectedImage === secondImage ? 'border-2' : ''}`} onClick={() => { setSelectedImage(secondImage) }}>
                            <Image loading="lazy" src={secondImage} alt="Serviced Apartments Logo" className='rounded-lg object-cover' fill />
                        </div>
                        <div className={`w-24 h-16 relative border-primary border-0 rounded-lg ${selectedImage === thirdImage ? 'border-2' : ''}`} onClick={() => { setSelectedImage(thirdImage) }}>
                            <Image loading="lazy" src={thirdImage} alt="Serviced Apartments Logo" className='rounded-lg object-cover' fill />
                        </div>
                        <SinglePropertyImageViewMobile defaultImages={allImages} name={`${hotel?.name} - ${hotel?.city}` || 'Undefined'} reviews={reviews} />
                    </div>
                    <div className='max-[500px]:hidden min-[1001px]:hidden flex gap-1 py-2 w-full'>
                        <div className={`w-24 h-16 relative border-primary border-0 rounded-lg ${selectedImage === coverImage ? 'border-2' : ''}`} onClick={() => { setSelectedImage(coverImage) }}>
                            <Image loading="lazy" src={coverImage} alt="Serviced Apartments Logo" className='rounded-lg object-cover' fill />
                        </div>
                        <div className={`w-24 h-16 relative border-primary border-0 rounded-lg ${selectedImage === secondImageLg ? 'border-2' : ''}`} onClick={() => { setSelectedImage(secondImageLg) }}>
                            <Image loading="lazy" src={secondImageLg} alt="Serviced Apartments Logo" className='rounded-lg object-cover' fill />
                        </div>
                        <div className={`w-24 h-16 relative border-primary border-0 rounded-lg ${selectedImage === thirdImageLg ? 'border-2' : ''}`} onClick={() => { setSelectedImage(thirdImageLg) }}>
                            <Image loading="lazy" src={thirdImageLg} alt="Serviced Apartments Logo" className='rounded-lg object-cover' fill />
                        </div>
                        <SinglePropertyImageViewMobile defaultImages={allImages} name={`${hotel?.name} - ${hotel?.city}` || 'Undefined'} reviews={reviews} />


                    </div>


                    <PropertyDetails hotel={hotel} reviews={reviews} roomDetails={roomDetails} checkin={checkin} checkout={checkout} />

                    <UserReview />

                </div>
            )}
        </section>
    );
};

export default SingleView;