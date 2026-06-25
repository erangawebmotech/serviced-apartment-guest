export const fullHotelMock = {
  name: 'Ella Rock Heaven',
  city: 'Colombo',
  description: '<p>This is a test hotel description with enough content for testing.</p>',
  summaryReviews: {
    averageReviews: 4.5,
    totalReviews: 12,
  },
  propertyType: {
    name: 'Apartment',
  },
  unitHighlights: [
    {
      id: 1,
      name: 'Jungle View',
      file: { smallPath: '', originalName: '' },
    },
  ],
  propertyAmenities: [
    {
      amenity: {
        name: 'Free Wifi',
        file: { smallPath: '', originalName: '' },
      },
    },
  ],
  shortCancellationPolicy: {
    description: 'Free cancellation up to 5 days before check-in.',
  },
  longCancellationPolicy: {
    description: 'Full refund if canceled 30 days in advance.',
  },
};

export const RoomsMock = {
  hotel: {
    id: 1,
    slug: 'ella-rock-heaven',
    propertyType: { name: 'Apartment' },
  },
  roomDetails: {
    data: {
      allowEntireProperty: true,
      allowIndividualUnit: false,
      isEntirePropertyAvailable: true,
      subUnits: [
        {
          id: 1,
          prices: [
            { maxHeadCount: 1, priceForMaxCount: 100 },
            { maxHeadCount: 2, priceForMaxCount: 200 },
            { maxHeadCount: 3, priceForMaxCount: 300 },
          ],
          maxHeadCount: 3,
          subUnits: [1, 2, 3],
        },
      ],
      propertyMaxHeadCount: 3,
    },
  },
  checkin: new Date('2025-08-05T00:00:01'),
  checkout: new Date('2025-08-08T23:59:01'),
  blockedDates: {
    reserved: [],
    blocked: [],
  },
};