import React from "react";
import ResultPage from "../../../components/search-results/ResultPage";
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: any }): Promise<Metadata> {
  const { destination } = await searchParams;
  return {
    title: destination === 'null' ? `Book your stay now` : `Hotels in ${destination}. Book your stay now`,
    description: destination === 'null' ? `Explore serviced apartments and hotels.` : `Hotels in ${destination}.`
  };
}

const SearchResultsPage = async ({ searchParams }: { searchParams: any }) => {
  const { destination, checkin, checkout, no_adults, no_rooms, no_children, pets, place_id, filter } = await searchParams;

  return (
    <ResultPage destination={destination} checkin={checkin} checkout={checkout} no_adults={no_adults} no_rooms={no_rooms} no_children={no_children} pets={pets} place_id={place_id} filter={filter} />
  );
};

export default SearchResultsPage;
