import { NextResponse } from 'next/server';
import cityPlaces from '@/data/cityPlaces.json';

interface Place {
    name: string;
    categories?: string[];
    location?: {
        address?: string;
        city?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
    };
    rating?: number;
    description?: string;
}

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || 'ankara';

        const normalizedSearchCity = normalizeText(city);

        // cityPlaces.json'dan şehir verilerini bul
        const cityData = cityPlaces.cities.find(c => 
            normalizeText(c.name) === normalizedSearchCity
        );

        if (!cityData) {
            return NextResponse.json({
                success: false,
                error: 'Şehir bulunamadı',
                debug: {
                    searchedCity: city,
                    normalizedCity: normalizedSearchCity,
                    availableCities: cityPlaces.cities.map(c => ({
                        original: c.name,
                        normalized: normalizeText(c.name)
                    }))
                }
            }, { status: 404 });
        }

        const places: Place[] = cityData.places.map(place => ({
            name: place.name,
            categories: ['Turistik Yer'],
            location: {
                city: cityData.name,
                country: 'TR'
            }
        }));

        return NextResponse.json({
            success: true,
            data: {
                city: cityData.name,
                places,
                totalFound: places.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Hata oluştu:', error);
        return NextResponse.json({
            success: false,
            error: 'Veri çekme işlemi başarısız oldu',
            details: error instanceof Error ? error.message : 'Bilinmeyen hata'
        }, { status: 500 });
    }
} 