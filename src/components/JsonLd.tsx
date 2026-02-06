import React from 'react';

const JsonLd = () => {
    const businessData = {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        "name": "Sidhi Vinayak Events",
        "alternateName": "Sidhi Vinayak Wedding Photography",
        "image": "https://www.sidhivinayakevents.in/logo.jpg",
        "@id": "https://www.sidhivinayakevents.in",
        "url": "https://www.sidhivinayakevents.in",
        "telephone": "+91 78917 66624",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Niwaru, Jhotwara",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302012",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 26.9124,
            "longitude": 75.7873
        },
        "areaServed": "Jaipur and nearby areas",
        "description": "Best event management and wedding photography company in Jaipur. Specializing in destination weddings, cinematic films, and premium event planning.",
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        },
        "sameAs": [
            "https://www.instagram.com/sidhivinayak_eventsjaipur/",
            "https://www.youtube.com/@SidhiVinayak-Jaipur"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Event Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Wedding Photography"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Event Management"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Cinematography"
                    }
                }
            ]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
        />
    );
};

export default JsonLd;
