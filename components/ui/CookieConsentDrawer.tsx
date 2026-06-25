import React from 'react';
import { Cookie, X } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import Link from 'next/link';

const CookieConsentDrawer = () => {
    const { showDrawer, isLoading, acceptCookies, rejectCookies, closeDrawerTemporarily  } = useCookieConsent();

    if (isLoading || !showDrawer) {
        return null;
    }

    return (
        <div className="right-2 sm:right-24 bottom-4 left-2 sm:left-auto z-[9999999999] fixed font-poppins animate-slide-up">
            <div className="bg-white shadow-lg p-4 border border-gray-200 rounded-lg max-w-sm">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <Cookie className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-gray-900 text-sm">
                            Cookie Policy
                        </h3>
                    </div> 
                    <button
                        onClick={closeDrawerTemporarily}
                        className="hover:bg-gray-100 p-1 rounded transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 text-xs leading-relaxed">
                        We use cookies to enhance your experience. Accept to continue or reject to decline. <Link href={'/help/articles/cookies-policy'} className='text-primary' target='_blank' aria-label="Learn more about our cookie policy">Learn more about our cookie policy</Link>
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={rejectCookies}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded font-medium text-gray-700 text-xs transition-colors"
                    >
                        Reject
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="flex-1 bg-primary hover:bg-primary px-3 py-2 rounded font-medium text-white text-xs transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentDrawer;
