"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResultCard from "./ResultCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRating from "@/components/hotel-single-view/StartsRating";
import Filters from "./Filters";
import { useDispatch, useSelector } from "react-redux";
import {
  getFilterDetails,
  getFilteredProperties,
} from "@/actions/services/getFilters";
import SearchByDateFilterPage from "@/components/Filters/filter-page/SearchByDateFilterPage";
import SearchByGuestCountFilterPage from "@/components/Filters/filter-page/SearchByGuestCountFilterPage";
import { SearchByLocationFilterPage } from "@/components/Filters/filter-page/SearchByLocationFilterPage";
import DefaultImage from "@/public/shared/DefaultLocation.png";
import { FaFilter, FaRandom, FaSearch } from "react-icons/fa";
import { getPlaceDetails } from "@/lib/google";
import FiltersSkeleton from "./skeletons/FiltersSkeleton";
import ResultsCountSkeleton from "./skeletons/ResultsCountSkeleton";
import ResultCardSkeleton from "./skeletons/ResultCardSkeleton";
import FilterSheet from "./FilterSheet";
import { useLenis } from "lenis/react";
import SortByDrawer from "./SortByDrawer";
import { X } from "lucide-react";
import MobileSearchContainer from "./MobileSearchContainer";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { SortingTypes } from "@/common/constants";
import { CheckTimeType, refactorDate } from "@/common/commonClientFunctions";
import { useMediaQuery } from "react-responsive";
import { addHighlight, clearAllFilters } from "@/store/reducers/filterReducer";
import { FaArrowUp } from "react-icons/fa6";
import Navbar from "../navigation/Navbar";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import clsx from "clsx";
import { ActiveFilterTag } from "./ActiveFiltertag";
import { GooglePlaceDetails } from "@/common/googlePlaceDetails.interface";
import { RootState } from "@/store/store";
import { FilterDataProps } from "@/common/filter.interface";

export const formatDate = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ss");

interface ResultPageProps {
  destination: string;
  checkin: string;
  checkout: string;
  no_adults: number;
  no_rooms: number;
  no_children: number;
  pets: boolean;
  place_id: string;
  filter: string;
}
export interface Property {
  propertyId: number;
  propertyName: string;
  code: string;
  propertyDescription: string;
  slug: string;
  summaryReview: SummaryReview;
  unitDetails: UnitDetail[];
  propertyImage: PropertyImage;
  location: Location;
  propertyType: PropertyType;
  totalPrice: number | string;
  priceWithDiscount: number | null;
  monthlyRateApplied: boolean;
  cancellationPolicy: CancellationPolicy[];
  discount: string;
  allowEntireProperty: boolean;
  allowIndividualUnit: boolean;
  nightCount: number;
  hasBreakfast: boolean;
}

export interface SummaryReview {
  averageReviews: number;
  totalReviews: number;
}

export interface UnitDetail {
  id: number;
  name: string;
  unitCategoryName: string;
  bedDetails: BedDetail[];
  leftUnitCount: number;
  price: number;
  reservationCount: number | null;
  size: number;
}

export interface BedDetail {
  id: number;
  count: number;
  bedType: BedType;
}

export interface BedType {
  id: number;
  name: string;
}

export interface PropertyImage {
  isCover: boolean;
  altTag: string;
  file: ImageFile;
}

export interface ImageFile {
  id: number;
  originalName: string;
  originalPath: string;
  smallPath: string;
  mediumPath: string;
  largePath: string;
  type: "image";
}
export interface Location {
  country: Country;
  province: Province;
  district: District;
  city: City;
}

export interface Country {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}
export interface PropertyType {
  id: number;
  name: string;
}

export interface CancellationPolicy {
  shortCancellationPolicy?: ShortCancellationPolicy | null;
  longCancellationPolicy?: LongCancellationPolicy | null;
}

export interface ShortCancellationPolicy {
  id: number;
  name: string;
}

export interface LongCancellationPolicy {
  id: number;
  name: string;
}


const ResultPage: React.FC<ResultPageProps> = ({
  destination,
  checkin,
  checkout,
  no_adults,
  no_rooms,
  no_children,
  pets,
  place_id,
  filter,
}) => {
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [hasBreakfast, setHasBreakfast] = useState<true | null>(null);
  const [filters, setFilters] = useState<FilterDataProps | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingProperties, setFetchingProperties] = useState<boolean>(true);
  const [fetchingNextPage, setFetchingNextPage] = useState<boolean>(false);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<GooglePlaceDetails | null>(null);
  const [breadCrumbDetails, setBreadCrumbDetails] = useState<GooglePlaceDetails | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [propertiesToShow, setPropertiesToShow] = useState<Property[]>([]);
  const [propertiesCount, setPropertiesCount] = useState<number>(0);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [defaultLocationData, setDefaultLocationData] = useState<{ destination: string; placeId: string; } | null>(null);
  const [openSortbyDrawer, setOpenSortbyDrawer] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [initialFilters, setInitialFilters] = useState<boolean>(true);
  const [minVal, setMinVal] = useState<number>(25);
  const [checkIn, setCheckIn] = useState<any>(checkin);
  const [checkOut, setCheckOut] = useState<any>(checkout);
  const [maxVal, setMaxVal] = useState<number>(100000);
  const [selectedSortFilter, setSelectedSortFilter] = useState<string>(
    SortingTypes[0].value
  );
  const [selectedValue, setSelectedValue] = useState<string>(
    SortingTypes[0].value
  );
  const dispatch = useDispatch();
  const lenis = useLenis();
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [counts, setCounts] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
    pets: false,
  });
  const filterState = useSelector((state: RootState) => state.filters);
  const offsetMinutes = 5 * 60 + 30;
  const isMobile = useMediaQuery({ maxWidth: 1000 });
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollY = useRef(0);
  const manualExpandRef = useRef(false);
  /** True only after user clears location in the picker — avoids wiping URL on refresh before state hydrates. */
  const locationClearRequestedRef = useRef(false);
  /** Full list refresh (`fetchProperties`); stale responses are ignored. */
  const propertiesListGenerationRef = useRef(0);
  /** Load-more requests; invalidated when a full list refresh starts. */
  const paginationGenerationRef = useRef(0);
  /** Supersedes overlapping default-place hydration when URL location changes quickly. */
  const defaultPlaceFetchGenerationRef = useRef(0);
  /** Supersedes breadcrumb place-details fetch when `place_id` changes quickly. */
  const breadcrumbPlaceGenerationRef = useRef(0);
  /** Blocks duplicate Search taps before `fetchingProperties` state updates (same tick). */
  const searchExecuteGuardRef = useRef(false);
  const [showSearchBackdrop, setShowSearchBackdrop] = useState(false);
  const [triggerExpandAnim, setTriggerExpandAnim] = useState(false);
  const [showCompactSearchButton, setShowCompactSearchButton] = useState(false);
  const [defaultFetchLocation, setDefaultFetchLocation] = useState<GooglePlaceDetails | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState<boolean>(false);
  const selectedDefaultHighlight = useRef<number | null>(-1);

  const handleCount = useCallback(
    (adults: number, children: number, rooms: number, pets: boolean) => {
      setCounts((prevCounts) => ({
        ...prevCounts,
        adults: adults,
        children: children,
        rooms: rooms,
        pets: pets,
      }));
    },
    []
  );

  useEffect(() => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      adults: Number(no_adults) || 1,
      children: Number(no_children) || 0,
      rooms: Number(no_rooms) || 1,
      pets:
        typeof pets === "boolean"
          ? pets
          : String(pets ?? "").toLowerCase() === "true",
    }));
  }, [no_adults, no_children, no_rooms, pets]);

  useEffect(() => {
    const initialize = async () => {
      if (!defaultLocationData && selectedLocationDetails) return;
      await Promise.all([loadFilters(), getLocationDetails()]);
    };
    initialize();

    if (!place_id || place_id === "undefined") {
      fetchProperties({ filtered: false, });
    }
  }, [place_id]);

  const closeFilterSheet = (open: boolean) => {
    setOpenFilter(open);
    setOpenSortbyDrawer(open);
  };

  const handleSortByFilter = (value: string) => {
    setSelectedSortFilter(value);
  };

  useEffect(() => {
    if (openFilter) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [openFilter, lenis]);

  const loadFilters = async () => {
    try {
      const res = await getFilterDetails();
      setFilters(res.data);
    } catch (error) {
      console.error("Error loading filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationDetails = async () => {
    if (place_id == "undefined" || undefined) {
      return;
    }
    const requestId = ++breadcrumbPlaceGenerationRef.current;
    try {
      setFetchingLocation(true)
      const response = await getPlaceDetails(place_id);
      if (requestId !== breadcrumbPlaceGenerationRef.current) return;
      setSelectedLocationDetails(response);
      setBreadCrumbDetails(response);
    } catch (error) {
      console.error("Error fetching location details:", error);
    } finally {
      if (requestId === breadcrumbPlaceGenerationRef.current) {
        setFetchingLocation(false);
      }
    }
  };

  useEffect(() => {
    handleDefaultFilter();
    setPageNumber(1);
    setCheckIn(checkin);
    setCheckOut(checkout);
  }, []);

  const handleDefaultFilter = async () => {
    if (!filter || filter === "undefined") {
      return;
    }
    await dispatch(addHighlight(Number(filter)));
  };

  /** Resolves API location: prefers fetched details, then URL bar (live), then SSR props (handles refresh race). */
  const resolveLocationForSearch = useCallback((): GooglePlaceDetails | null => {
    if (
      defaultFetchLocation?.place_id &&
      defaultFetchLocation.place_id !== "undefined"
    ) {
      return defaultFetchLocation;
    }
    if (
      selectedLocationDetails?.place_id &&
      selectedLocationDetails.place_id !== "undefined"
    ) {
      return selectedLocationDetails;
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("place_id")) {
        const rawPid = params.get("place_id");
        if (!rawPid || rawPid === "undefined") {
          return null;
        }
        const rawDest = params.get("destination");
        return {
          place_id: rawPid,
          name:
            rawDest && rawDest !== "null" && rawDest !== "undefined"
              ? rawDest
              : "",
        };
      }
    }

    if (place_id && place_id !== "undefined") {
      return {
        place_id,
        name:
          destination && destination !== "null" && destination !== "undefined"
            ? destination
            : "",
      };
    }
    return null;
  }, [
    defaultFetchLocation,
    selectedLocationDetails,
    place_id,
    destination,
  ]);

  const handleLocationDetailsChange = useCallback(
    (details: GooglePlaceDetails | null) => {
      if (details === null) {
        locationClearRequestedRef.current = true;
      } else {
        locationClearRequestedRef.current = false;
      }
      setSelectedLocationDetails(details);
      setDefaultLocationData(null);
      setDefaultFetchLocation(null);
    },
    []
  );

  const fetchProperties = async ({ filtered = false }: { filtered?: boolean; }) => {
    const requestId = ++propertiesListGenerationRef.current;
    paginationGenerationRef.current += 1;
    setPageNumber(1);
    try {
      setFetchingProperties(true);
      const dataObject = {
        location: resolveLocationForSearch(),
        propertyTypeIds: filterState?.propertyTypes || [],
        highlights: selectedDefaultHighlight.current === -1 ? (!filter ? [] : [Number(filter)]) : filterState?.highlights || [],
        minMaxVal: {
          min: minVal,
          max: maxVal,
        },
        amenityIds: filterState?.amenities || [],
        adults: counts.adults || 1,
        children: counts.children || 0,
        activeRating: activeRating,
        hasBreakfast: hasBreakfast,
        checkIn:
          new Date(
            refactorDate(checkIn, CheckTimeType.CHECKIN).getTime() +
            offsetMinutes * 60 * 1000
          ) || new Date(),
        checkOut:
          new Date(
            refactorDate(checkOut, CheckTimeType.CHECKOUT).getTime() +
            offsetMinutes * 60 * 1000
          ) || new Date().getDate() + 1,
        bedTypeIds: filterState?.bedTypes || [],
        page: 0,
        sortType: isMobile ? selectedSortFilter : selectedValue,
      };

      if (dataObject?.location?.place_id === "undefined") {
        dataObject.location = null;
      }

      const response = await getFilteredProperties(dataObject);
      if (requestId !== propertiesListGenerationRef.current) return;

      const currentUrl = new URL(window.location.href);

      currentUrl.searchParams.set("no_adults", counts.adults.toString() || "");
      currentUrl.searchParams.set(
        "no_children",
        counts.children.toString() || ""
      );
      currentUrl.searchParams.set("no_rooms", counts.rooms.toString() || "");
      currentUrl.searchParams.set("pets", counts.pets.toString() || "false");

      window.history.replaceState(null, "", currentUrl.toString());

      setHasNextPage(response?.pagination?.hasNextPage || false);

      setPropertiesToShow(response.data || []);

      setPropertiesCount(response?.pagination?.totalCount || 0);

      if (!filtered) {
        setInitialFilters(false);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      if (requestId === propertiesListGenerationRef.current) {
        setFetchingProperties(false);
      }
    }
  };

  const handleSearchParams = () => {
    if (isCompact) {
      manualExpandRef.current = true;
      setShowSearchBackdrop(true);
      setTriggerExpandAnim(true);
      setIsCompact(false);

      requestAnimationFrame(() => {
        setTimeout(() => {
          manualExpandRef.current = false;
        }, 300);
      });

      return;
    }
    executeSearch();
  };

  const executeSearch = () => {
    if (searchExecuteGuardRef.current || fetchingLocation) {
      return;
    }
    searchExecuteGuardRef.current = true;

    scrollToTop();
    const currentUrl = new URL(window.location.href);

    const propsDestination =
      destination && destination !== "null" && destination !== "undefined"
        ? destination
        : "";
    const propsPlaceId =
      place_id && place_id !== "undefined" ? place_id : "";

    const locationToUse =
      selectedLocationDetails?.name ??
      defaultLocationData?.destination ??
      propsDestination;

    const placeIdToUse =
      selectedLocationDetails?.place_id ??
      defaultLocationData?.placeId ??
      propsPlaceId;

    if (locationClearRequestedRef.current) {
      locationClearRequestedRef.current = false;
      setDefaultLocationData(null);
      currentUrl.searchParams.set("destination", "");
      currentUrl.searchParams.set("place_id", "");
    } else {
      currentUrl.searchParams.set("destination", locationToUse ?? "");
      currentUrl.searchParams.set("place_id", placeIdToUse ?? "");
    }

    setBreadCrumbDetails(selectedLocationDetails);
    window.history.replaceState({}, "", currentUrl.toString());
    void fetchProperties({ filtered: true }).finally(() => {
      searchExecuteGuardRef.current = false;
    });
  };

  useEffect(() => {
    // Only set defaultLocationData if place_id is valid
    if (place_id && place_id !== "undefined") {

      if (!defaultLocationData && selectedLocationDetails) return;
      setDefaultLocationData({
        destination: destination,
        placeId: place_id,
      });
    } else {
      setDefaultLocationData(null);
    }

    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        if (rect.top <= 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [destination, place_id]);

  useEffect(() => {
    if (!defaultLocationData?.placeId || defaultLocationData.placeId === "undefined") return;

    const requestId = ++defaultPlaceFetchGenerationRef.current;
    const pid = defaultLocationData.placeId;

    const fetchDefaultLocation = async () => {
      const response = await getPlaceDetails(pid);
      if (requestId !== defaultPlaceFetchGenerationRef.current) return;
      const fullLocation = {
        ...response,
        place_id: pid,
      };
      setDefaultFetchLocation(fullLocation);
    };

    fetchDefaultLocation();
  }, [defaultLocationData]);

  useEffect(() => {
    if (!defaultFetchLocation || !defaultFetchLocation.place_id || defaultFetchLocation.place_id === "undefined") return;
    fetchProperties({});
  }, [defaultFetchLocation]);

  useEffect(() => {

    const currentState = filterState["highlights"] || [];
    if (currentState?.length > 0) {
      selectedDefaultHighlight.current = null
      if (selectedLocationDetails === null) {
        fetchProperties({ filtered: false, });
        return;
      }
    }
    if (initialFilters) {
      return;
    }
    if (selectedLocationDetails === null) {
      fetchProperties({ filtered: false, });
      return;
    }
    fetchProperties({ filtered: true, });
  }, [
    filterState,
    activeRating,
    selectedValue,
    selectedSortFilter,
    hasBreakfast,
  ]);

  const nextPage = async () => {
    if (!hasNextPage) {
      return;
    }
    const requestId = ++paginationGenerationRef.current;
    try {
      setFetchingNextPage(true);
      const response = await getFilteredProperties({
        location: resolveLocationForSearch(),
        propertyTypeIds: filterState?.propertyTypes || [],
        highlights: filterState?.highlights || [],
        minMaxVal: {
          min: minVal,
          max: maxVal,
        },
        amenityIds: filterState?.amenities || [],
        checkIn:
          new Date(
            refactorDate(checkIn, CheckTimeType.CHECKIN).getTime() +
            offsetMinutes * 60 * 1000
          ) || new Date(),
        checkOut:
          new Date(
            refactorDate(checkOut, CheckTimeType.CHECKOUT).getTime() +
            offsetMinutes * 60 * 1000
          ) || new Date().getDate() + 1,
        // checkIn: refactorDate(checkIn, CheckTimeType.CHECKIN) || new Date(),
        // checkOut: refactorDate(checkOut, CheckTimeType.CHECKOUT) || (new Date().getDate() + 1),
        adults: counts.adults || 1,
        children: counts.children || 0,
        bedTypeIds: filterState?.bedTypes || [],
        activeRating: activeRating,
        hasBreakfast: hasBreakfast,
        page: pageNumber,
        sortType: isMobile ? selectedSortFilter : selectedValue,
      });
      if (requestId !== paginationGenerationRef.current) return;

      const currentUrl = new URL(window.location.href);

      currentUrl.searchParams.set("no_adults", counts.adults.toString() || "");
      currentUrl.searchParams.set(
        "no_children",
        counts.children.toString() || ""
      );
      currentUrl.searchParams.set("no_rooms", counts.rooms.toString() || "");
      currentUrl.searchParams.set("pets", counts.pets.toString() || "false");

      window.history.replaceState(null, "", currentUrl.toString());
      if (response) {
        setHasNextPage(response?.pagination?.hasNextPage || false);

        setPropertiesToShow((prevProperties) => [
          ...prevProperties,
          ...(response?.data || []),
        ]);

        setPropertiesCount(response?.pagination?.totalCount || 0);

        setPageNumber((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setFetchingNextPage(false);
    }
  };

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nextPage();
        }
      },
      { threshold: 1.0 }
    );

    return () => {
      observer.current?.disconnect();
    };
  }, [hasNextPage, fetchingProperties, fetchingNextPage]);

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    if (loadMoreRef.current) {
      observer.current?.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.current?.unobserve(loadMoreRef.current);
      }
    };
  }, [propertiesToShow]);

  const onChangeDate = (date: DateRange | undefined) => {
    // Use the most up-to-date value for both states
    const locationToUse = selectedLocationDetails;
    setSelectedLocationDetails(locationToUse);

    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.set(
      "checkin",
      date?.from ? formatDate(date.from) : ""
    );
    currentUrl.searchParams.set(
      "checkout",
      date?.to ? formatDate(date.to) : ""
    );
    setCheckIn(date?.from ? formatDate(date.from) : undefined);
    setCheckOut(date?.to ? formatDate(date.to) : undefined);

    window.history.replaceState(null, "", currentUrl.toString());
  };


  const handleRatingClick = (rating: number) => {
    setActiveRating((prev) => (prev === rating ? null : rating));
  };

  useEffect(() => {
    setDefaultLocationData({
      destination: destination,
      placeId: place_id,
    });
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        if (rect.top <= 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCountChange = () => {
    fetchProperties({ filtered: false, });
  };

  const handleMobileRating = (rating: number) => {
    setActiveRating(rating);
  };
  const handleMobileHasBreakfast = (status: true | null) => {
    setHasBreakfast(status);
  };

  const handleClearAllFilters = () => {
    // Clear price range filters
    setMinVal(25);
    setMaxVal(100000);
    // Clear rating filter
    setActiveRating(null);
    // Clear breakfast filter
    setHasBreakfast(null);
    // Clear all Redux-managed checkbox filters
    dispatch(clearAllFilters());
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

    window.addEventListener("scroll", throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [showScrollTopButton]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Prevent collapsing if we're in a manual expand
      if (triggerExpandAnim || manualExpandRef.current) return;

      setShowSearchBackdrop(false);
      setIsCompact(true);
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20 && currentScrollY > lastScrollY.current) {
        setIsCompact(true);
      } else if (currentScrollY < 20) {
        setTriggerExpandAnim(false);
        setIsCompact(false);
        setShowCompactSearchButton(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isCompact) {
      const timeout = setTimeout(() => {
        setShowCompactSearchButton(true);
      }, 300); // Wait for the fade-out animation to complete

      return () => clearTimeout(timeout);
    } else {
      setShowCompactSearchButton(false);
    }
  }, [isCompact]);

  // Memoize defaultCount to avoid unnecessary re-renders in child components
  const memoizedDefaultCount = useMemo(
    () => ({
      adult: counts.adults,
      children: counts.children,
      room: counts.rooms,
      pets: counts.pets,
    }),
    [counts.adults, counts.children, counts.rooms, counts.pets]
  );

  return (
    <>
      <section className="flex flex-col items-center bg-[#F7F7F7] p-10 max-[1000px]:p-3 max-[1030px]:p-5 max-[1700px]:p-8 max-[1730px]:p-8 w-full font-poppins">
        <div className="relative flex flex-col justify-center items-center max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1700px]:px-10 max-[1730px]:px-32 w-full h-full">
          <Navbar className="bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4 border-b" />

          {showSearchBackdrop && (
            <div className="top-0 left-0 z-[10] fixed bg-[#f7f7f7] shadow-md w-full h-[200px] animate-slide-down pointer-events-none" />
          )}

          <div className="group relative flex justify-center items-center w-full">
            <div
              className={clsx(
                "max-[1000px]:hidden flex justify-between items-center bg-white bg-opacity-50 shadow-md backdrop-blur-sm mt-16 p-3 border rounded-full h-20 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform",
                {
                  // Manual animation
                  "fixed top-[30px] z-[40] -translate-x-1/2 animate-slide-down bg-white bg-opacity-50 shadow-md backdrop-blur-sm border mt-16 items-center p-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]":
                    !isCompact && triggerExpandAnim,
                }
              )}
              onClick={() => setIsCompact(false)}
            >
              <div
                className={clsx(
                  "left-5 z-2 relative flex flex-row items-center w-[85%] font-poppins"
                )}
              >
                <SearchByLocationFilterPage
                  onLocationDetailsChange={handleLocationDetailsChange}
                  selectedLocation={selectedLocationDetails}
                  defaultLocation={
                    destination == "null" ? null : destination ? destination : null
                  }
                />

                <SearchByDateFilterPage
                  defaultDateRange={{ from: checkIn, to: checkOut }}
                  onChangeDate={onChangeDate}
                />
                <SearchByGuestCountFilterPage
                  defaultCount={memoizedDefaultCount}
                  onChangeCounts={handleCount}
                />
              </div>

              <div className="relative flex justify-center items-center w-full overflow-hidden">
                <Button
                  className={clsx(
                    "flex justify-center items-center bg-secondary py-5 rounded-[84px] w-full h-[60px] text-center transition-all duration-300 cursor-pointer"
                  )}
                  onClick={handleSearchParams}
                  disabled={fetchingLocation || fetchingProperties}
                >
                  <FaSearch className="text-white" />
                  <span className="font-poppins font-normal text-sm">
                    Search
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden relative max-[1000px]:flex flex-col justify-center items-center mt-20 w-full h-max">
            <MobileSearchContainer
              onLocationDetailsChange={handleLocationDetailsChange}
              onDateChange={onChangeDate}
              defaultDateRange={{ from: checkIn, to: checkOut }}
              defaultLocation={destination}
              handleSearchParams={handleSearchParams}
              onChangeCounts={handleCount}
              defaultCount={{
                adult: counts.adults,
                children: counts.children,
              }}
              isCompact={isCompact}
              isSearchBusy={fetchingProperties || fetchingLocation}
            />
          </div>
        </div>
      </section>
      {isCompact ||
        (manualExpandRef.current && (
          <div
            className={clsx(
              "top-0 left-0 bg-[#f7f7f7] w-full h-20",
              manualExpandRef.current ? "fixed" : "sticky"
            )}
          ></div>
        ))}
      {isCompact && (
        <div className="lg:hidden block top-[74px] left-0 z-[50] sticky bg-[#f7f7f7] w-full h-14"></div>
      )}

      <div
        className="top-0 z-10 sticky bg-[#F7F7F7] pb-3 border-none"
        style={{
          boxShadow: isSticky ? "rgba(0, 0, 0, 0.16) 0px 1px 4px" : "none",
          paddingTop: isSticky ? "10px" : "0",
        }}
        ref={stickyRef}
      >
        <div className="hidden max-[1000px]:flex justify-start items-center bg-[#F7F7F7] px-6 border-none w-full font-poppins">
          <Button
            onClick={() => setOpenFilter(true)}
            className="bg-transparent hover:bg-transparent focus:bg-transparent shadow-none font-light text-primary"
          >
            <FaFilter /> Filter
          </Button>
          <Button
            onClick={() => setOpenSortbyDrawer(true)}
            className="bg-transparent hover:bg-transparent focus:bg-transparent shadow-none font-light text-primary"
          >
            <FaRandom /> SortBy
          </Button>

          <SortByDrawer
            open={openSortbyDrawer}
            closeFilter={closeFilterSheet}
            handleChange={handleSortByFilter}
          />
          <FilterSheet
            fetching={fetchingProperties}
            filters={filters}
            open={openFilter}
            closeFilter={closeFilterSheet}
            count={propertiesCount}
            handleRating={handleMobileRating}
            handleHasBreakfast={handleMobileHasBreakfast}
            hasBreakfast={hasBreakfast}
          />
        </div>
        <div className="min-[1000px]:hidden px-8 w-full">
          <ActiveFilterTag filterData={filters} />
        </div>
        <div className="hidden scrollbar-hidden gap-2 bg-[#F7F7F7] px-3 pt-3 border-none w-full h-max overflow-x-auto font-poppins whitespace-nowrap">
          <div className="flex justify-between items-center gap-2 bg-secondary bg-opacity-15 px-3 py-1 border border-secondary rounded-2xl w-max h-min text-secondary text-sm">
            {selectedSortFilter} <X className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-center gap-2 bg-primary bg-opacity-15 px-3 py-1 border border-primary rounded-2xl w-max h-min text-primary text-sm">
            {selectedSortFilter}
          </div>
        </div>
      </div>

      <section className="flex flex-col items-center bg-[#F7F7F7] max-[1000px]:p-0 px-10 max-[1030px]:px-5 max-[1700px]:px-8 w-full font-poppins">
        <div className="flex justify-between items-start max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1700px]:px-8 w-full">
          <div className="max-[1000px]:hidden w-2/6">
            {loading ? (
              <>
                <FiltersSkeleton />
              </>
            ) : (
              <>
                <Card className="w-full">
                  <CardHeader className="flex flex-col items-start gap-4 p-4 border-b w-full">
                    <div className="flex justify-between items-center w-full">
                      <CardTitle className="font-semibold text-lg">Filter by</CardTitle>
                      <Button
                        variant="outline"
                        className="!z-[1] flex items-center gap-1 px-3 py-1 text-sm"
                        onClick={handleClearAllFilters}
                      >
                        <X className="w-4 h-4" />
                        <span className="font-poppins font-normal">Clear</span>
                      </Button>
                    </div>


                    <div className="flex flex-wrap gap-2">
                      <ActiveFilterTag filterData={filters} />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="py-5 border-b">
                      <span className="font-medium text-sm">
                        Budget (per night)
                      </span>

                      <div className="flex justify-between items-center gap-3 mt-3 w-full">
                        <div className="relative w-full min-w-32 max-w-60">
                          <span className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2">
                            $
                          </span>
                          <input
                            className="!px-2 !py-3 pl-6 border border-primary border-opacity-40 !rounded-lg min-w-32 max-w-60 !text-sm text-center"
                            type="number"
                            value={minVal}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value)) {
                                setMinVal(value);
                              }
                            }}
                            onBlur={() => {
                              if (minVal < 25) {
                                setMinVal(25);
                              }
                              if (maxVal <= minVal) {
                                setMaxVal(minVal + 1);
                              }
                            }}
                            min={1}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                document.getElementById("applyButton")?.click();
                              }
                            }}
                          />
                        </div>

                        <div className="relative w-full min-w-32 max-w-60">
                          <span className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2">
                            $
                          </span>
                          <input
                            className="!px-2 !py-3 pl-6 border border-primary border-opacity-40 !rounded-lg min-w-32 max-w-60 !text-sm text-center"
                            type="number"
                            value={maxVal}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value)) {
                                setMaxVal(value);
                              }
                            }}
                            onBlur={() => {
                              if (maxVal <= minVal) {
                                setMaxVal(minVal + 1);
                              }
                            }}
                            min={minVal + 1}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                document.getElementById("applyButton")?.click();
                              }
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        id="applyButton"
                        className="bg-secondary mt-3 w-full font-normal"
                        onClick={() => {
                          if (maxVal < minVal + 1) {
                            setMaxVal(minVal + 1);
                          }
                          handleCountChange();
                        }}
                      >
                        Apply
                      </Button>
                    </div>

                    <div className="flex-col justify-between items-start gap-2 py-5 border-b w-full lex">
                      <span className="font-medium text-sm">Rating</span>
                      <div>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div
                            key={rating}
                            onClick={() => handleRatingClick(rating)}
                            className={`flex items-center gap-3 hover:border-[#FFECEC]  px-2 py-3 border ${rating === 5
                              ? "rounded-bl-xl rounded-br-xl"
                              : rating === 1
                                ? "rounded-tl-xl rounded-tr-xl"
                                : "border-b-0"
                              } w-full duration-100 cursor-pointer ${activeRating === rating
                                ? "active-rating-filter hover:bg-secondary"
                                : "hover:bg-[#FFECEC]"
                              } justify-start items-center`}
                          >
                            <span className="font-light text-sm">{rating}</span>
                            <StarRating
                              rating={rating}
                              className={
                                activeRating === rating
                                  ? "text-white"
                                  : "text-secondary"
                              }
                              size={16}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Filters
                      filterData={filters}
                    />

                    <div className="flex-col justify-between items-start gap-2 py-5 border-b w-full lex">
                      <span className="font-medium text-sm">Other</span>
                      <div>
                        <span className="flex justify-start items-center gap-2 hover:cursor-pointer fle">
                          <Checkbox
                            checked={hasBreakfast ?? false}
                            id="hasBreakfast"
                            onClick={() => {
                              setHasBreakfast((prev) =>
                                prev === true ? null : true
                              );
                            }}
                            className="data-[state=checked]:bg-secondary border-secondary"
                          />
                          <Label
                            htmlFor="hasBreakfast"
                            className="font-light text-sm hover:cursor-pointer"
                          >
                            Breakfast Included
                          </Label>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="w-full">
            {fetchingProperties ? (
              <>
                <ResultsCountSkeleton />
              </>
            ) : (
              <div className="max-[1000px]:hidden flex justify-between ml-5">
                {propertiesCount > 0 ? (
                  <span>
                    {breadCrumbDetails?.name
                      ? breadCrumbDetails?.name + ":"
                      : ""}{" "}
                    {propertiesCount} search results found
                  </span>
                ) : (
                  <span>No properties to show</span>
                )}
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                  <SelectTrigger className="focus:outline-none focus:ring-0 w-2/6">
                    <SelectValue placeholder="Select Value" />
                  </SelectTrigger>
                  <SelectContent className="font-poppins">
                    {SortingTypes.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="mt-10 max-[1000px]:mt-0">
              {fetchingProperties ? (
                <div className="max-[1000px]:place-items-center gap-0 max-[1000px]:gap-10 grid max-[1000px]:grid-cols-2 max-[675px]:grid-cols-1">
                  {Array.from({
                    length: propertiesCount > 0 ? propertiesCount : 3,
                  }).map((_, index) => (
                    <ResultCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="place-items-center gap-0 grid max-[1000px]:grid-cols-2 max-[675px]:grid-cols-1">
                  {propertiesToShow?.map((room: Property, index) => {
                    return (
                      <ResultCard
                        property={room || ""}
                        checkIn={checkIn}
                        count={counts}
                        checkOut={checkOut}
                        key={room?.propertyId || index}
                        ref={
                          index === propertiesToShow?.length - 1
                            ? loadMoreRef
                            : null
                        }
                        title={room.propertyName}
                        image={
                          room?.propertyImage?.file?.mediumPath || DefaultImage
                        }
                        price={room?.totalPrice || 0}
                        discount={room.discount}
                        unitDetails={room?.unitDetails || []}
                        averageReviews={room.summaryReview.averageReviews}
                        totalReviews={room.summaryReview.totalReviews}
                        unitCategoryName={
                          room?.unitDetails?.[0]?.unitCategoryName || []
                        }
                        description={room?.propertyDescription || ""}
                        cancellationPolicy={room?.cancellationPolicy || []}
                      />
                    );
                  })}
                  {
                    !hasNextPage && (
                      <div className="min-[1000px]:hidden w-full h-[300px]" />
                    )
                  }
                  {
                    propertiesCount <= 0 && (
                      <span className="min-[1000px]:hidden">No properties to show</span>
                    )
                  }
                  {fetchingNextPage && <ResultCardSkeleton />}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          className="right-5 bottom-[4.5rem] z-[99999] fixed bg-primary shadow-lg p-3 border rounded-full focus:outline-none text-white hover:scale-110 transition-transform duration-300 transform"
          aria-label="Scroll to top"
          style={{
            willChange: "transform, opacity",
            opacity: showScrollTopButton ? 1 : 0,
          }}
        >
          <FaArrowUp size={20} />
        </button>
      )}
      <div
        className={`fixed top-[75px] left-1/2 -translate-x-1/2 z-10 transition-transform duration-500 ease-in-out transform ${showCompactSearchButton
          ? "translate-y-0 opacity-100"
          : "translate-y-[-50px] opacity-20"
          }`}
      >
        <Button
          className="flex justify-center items-center bg-secondary filter-page-search-button py-5 rounded-bl-[20px] rounded-br-[20px] h-[40px] text-center transition-all duration-300 cursor-pointer"
          onClick={handleSearchParams}
          disabled={fetchingLocation || fetchingProperties}
        >
          <FaSearch className="mr-1" />
          Search
        </Button>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ResultPage;
