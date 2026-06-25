'use client';
import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import Spinner from '../common/Spinner';
import {PAYMENT_TYPES} from '@/common/constants';

type PaymentMethod = keyof typeof PAYMENT_TYPES | 'CARD' | 'PAY_AT_PROPERTY';

export function PaymentMethodModal({
                                       isOpen,
                                       payAtProperty,
                                       onClose,
                                       currentMethod,
                                       onSubmit,
                                       disabled = false,
                                   }: {
    isOpen: boolean;
    payAtProperty?: boolean;
    onClose: () => void;
    currentMethod: PaymentMethod;
    onSubmit: (method: PaymentMethod) => Promise<void>;
    disabled?: boolean;
}) {
    const [method, setMethod] = useState<PaymentMethod>(currentMethod);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync when opening with current method
        if (isOpen) setMethod(currentMethod);
    }, [isOpen, currentMethod]);

    const handleConfirm = async () => {
        if (method === currentMethod) {
            onClose();
            return;
        }
        try {
            setLoading(true);
            await onSubmit(method);
            onClose();
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="font-poppins">
                <DialogHeader>
                    <DialogTitle>Change Payment Method</DialogTitle>
                    <DialogDescription className="text-xs">
                        Choose how you’d like to pay for this reservation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Label className="text-sm">Payment Method</Label>
                    <RadioGroup
                        value={method}
                        onValueChange={(v) => setMethod(v as PaymentMethod)}
                        className="gap-3 grid"
                    >
                        <div className="flex items-center space-x-3 p-3 border rounded-md">
                            <RadioGroupItem value={PAYMENT_TYPES.CARD} id="pm-card"/>
                            <Label htmlFor="pm-card" className="cursor-pointer">Card</Label>
                        </div>

                        {payAtProperty && <div className="flex items-center space-x-3 p-3 border rounded-md">
                            <RadioGroupItem value={PAYMENT_TYPES.PAY_AT_PROPERTY} id="pm-payprop"/>
                            <Label htmlFor="pm-payprop" className="cursor-pointer">Pay at Property</Label>
                        </div>}
                    </RadioGroup>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={loading || disabled}>
                        {loading ? (
                            <>
                                <Spinner/> <span className="ml-2">Saving...</span>
                            </>
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
