import { LuPartyPopper } from "react-icons/lu";

interface Place {
  name: string;
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
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
        <div className="h-4 bg-gray-300 dark:bg-white/20 rounded w-3/4" />
      </div>
    ))}
  </div>
);

export default function PlacesList({ isLoading, places}: PlacesListProps) {
  return (
    <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-gray-800 dark:text-white">
        <LuPartyPopper className="w-5 h-5" />
        <h3 className="font-medium">Gidilmesi Önerilen Yerler*</h3>
      </div>
      <div className="grid grid-cols-3 gap-0">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          places?.map((place, index) => (
            <div key={index} className="flex items-center gap-0 text-gray-600 dark:text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-white/40" />
              &nbsp;{place.name}
            </div>
          ))
        )}
        {!isLoading && (!places || places.length === 0) && (
          <div className="col-span-3 text-center py-4 text-gray-500 dark:text-white/70">
            Bu şehir için henüz önerilen bir yer bulunmamaktadır.
          </div>
        )}
      </div>
      <span className="text-xs text-gray-400 dark:text-white/50 mt-2 block">*Yerler Türkiye Kültür Portalı&apos;ndan alınmıştır.</span>
    </div>  
  );
}