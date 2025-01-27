interface Place {
  name: string;
  location: {
    city?: string;
  }
}

interface PlacesListProps {
  isLoading: boolean;
  places: Place[];
  cityName: string;
}

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-2">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="h-4 bg-white/20 rounded w-3/4" />
      </div>
    ))}
  </div>
);

export default function PlacesList({ isLoading, places, cityName }: PlacesListProps) {
  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-3">
      <h3 className="font-medium text-white">Gidilmesi Önerilen Yerler*</h3>
      <div className="grid grid-cols-3 gap-0">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          places?.filter(place => place.location.city?.toLowerCase() === cityName.toLowerCase())
            .slice(0, 9)
            .map((place, index) => (
              <div key={index} className="flex items-center gap-0 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                {place.name}
              </div>
            ))
        )}
        {!isLoading && (!places || places.filter(place => place.location.city?.toLowerCase() === cityName.toLowerCase()).length === 0) && (
          <div className="col-span-3 text-center py-4 text-white/70">
            Bu şehir için henüz önerilen bir yer bulunmamaktadır.
          </div>
        )}
      </div>
      <span className="text-xs text-white/50 mt-2 block">*Yerlerin sıralaması, foursquare'den alınan puanlar ile belirlenmiştir.</span>
    </div>
  );
}