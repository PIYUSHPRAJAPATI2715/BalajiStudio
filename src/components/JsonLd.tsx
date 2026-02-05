import React from 'react';

const JsonLd = () => {
    const businessData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Sidhi Vinayak Events",
        "image": "https://www.sidhivinayakevents.in/logo.jpg",
        "@id": "https://www.sidhivinayakevents.in",
        "url": "https://www.sidhivinayakevents.in",
        "telephone": "+91 78917 66624",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Niwaru, Jhotwara",
            "addressLocality": "Jaipur",
            "addressRegion": "RJ",
            "postalCode": "302012",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 26.9124,
            "longitude": 75.7873
        },
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
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
        />
    );
};

export default JsonLd;
