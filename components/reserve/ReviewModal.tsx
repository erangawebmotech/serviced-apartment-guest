import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import DynamicStarRating from "./DynamicStarRating";
import { RatingCategoriesProps } from "./ReservationSuccessPage";
import { addNewReview } from "@/actions/services/getRatingDetails";
import Spinner from "../common/Spinner";
import { toast } from "@/hooks/use-toast";

const formatText = (text: string): string => {
    return text
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function ReviewModal({
    isOpen,
    toggle,
    ratingCategoriesData,
    code,
    slug,
    onSuccessfulSubmit,
}: {
    isOpen: boolean;
    toggle: () => void;
    ratingCategoriesData: RatingCategoriesProps[];
    code: string | undefined;
    slug: string;
    onSuccessfulSubmit?: () => void;
}) {
    // export function ReviewModal({ isOpen, toggle, ratingCategoriesData, code, submit, slug }: { isOpen: boolean, toggle: () => void, ratingCategoriesData: RatingCategoriesProps[], code: string | undefined, submit: () => void, slug: string }) {
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [review, setReview] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleRatingChange = (categoryId: number, rating: number) => {
        setRatings((prev) => ({ ...prev, [categoryId]: rating }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const ratingObj = Object.entries(ratings).map(([id, rating]) => ({
            count: rating || 0,
            ratingCategoryId: Number(id),
        }));

        if (review.trim().length <= 0) {
            setLoading(false);
            return;
        }
        const data = {
            description: review || '',
            slug: slug,
            reservationCode: code || -1,
            ratings: ratingObj,
        };

        setLoading(true);

        await addNewReview(data).then((res) => {

            if (res.error) {
                throw res;
            }


            toast({
                description: res.message,
                className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            })
            toggle();
            setReview('');
            setRatings({});
            setLoading(false);

            onSuccessfulSubmit?.();

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        }).catch((error) => {
            toast({
                description: error.errors.message,
                className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            })
        }).finally(() => {
            setLoading(false);
        });
    };


    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="font-poppins">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogDescription className="text-xs">
                        Write a review based on the reservation number <span className="font-semibold text-primary">#{code}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div className="gap-4 grid grid-cols-2">
                        {ratingCategoriesData.map((category) => (
                            <div key={category.id}>
                                <Label className="font-normal">{formatText(category?.name)}</Label>
                                <DynamicStarRating
                                    rating={ratings[category.id] || 0}
                                    onRatingChange={(rating) => handleRatingChange(category.id, rating)}
                                />
                            </div>
                        ))}

                    </div>
                </div>
                <div>
                    <Label htmlFor="review">Review</Label>
                    <Textarea id="review" placeholder="Leave your review here." rows={8} value={review} onChange={(e) => setReview(e.target.value)} />
                </div>

                <DialogFooter>
                    {/* <Button onClick={handleSubmit} className="w-full" disabled={loading}> */}
                    <Button onClick={handleSubmit} className="w-full" disabled={loading} size="lg">
                        {
                            loading ? (
                                <>
                                    <Spinner /> Rate My Stay
                                </>
                            ) : (
                                <>Rate My Stay</>
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
