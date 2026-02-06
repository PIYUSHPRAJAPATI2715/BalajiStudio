import React from 'react';

const JsonLd = () => {
    const businessData = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Sidhi Vinayak Events",
        "alternateName": "Sidhi Vinayak Wedding Photography",
        "image": "https://www.sidhivinayakevents.in/logo.jpg",
        "@id": "https://www.sidhivinayakevents.in",
        "url": "https://www.sidhivinayakevents.in",
        "telephone": "+91 78917 66624",
        "priceRange": "INR",
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
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "125"
        },
        "areaServed": "Jaipur, Rajasthan and Overseas",
        "description": "Premium wedding photography and event management company in Jaipur. We specialize in cinematic wedding films, destination weddings, and creative event planning with a 5-star customer satisfacton rate.",
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
            "name": "Wedding & Event Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Cinematic Wedding Photography"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Luxury Event Management"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Pre-Wedding Shoot Jaipur"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Candid Photography"
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
