import { useState } from "react";
import { MapPin, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PhotoGallery({ photos = [] }) {
  const [selected, setSelected] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aucune photo disponible.
      </div>
    );
  }

  const navigate = (dir) => {
    const idx = photos.indexOf(selected);
    const next = idx + dir;
    if (next >= 0 && next < photos.length) setSelected(photos[next]);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setSelected(photo)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-border/50"
          >
            <img src={photo.url} alt={photo.caption || ""} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            {photo.date && (
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(photo.date).toLocaleDateString("fr-FR")}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <div className="relative">
            <img src={selected?.url} alt="" className="w-full max-h-[80vh] object-contain" />
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2">
              <X className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2">
              <ChevronRight className="w-5 h-5" />
            </button>
            {selected?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <p className="font-medium">{selected.caption}</p>
                {selected.location && (
                  <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {selected.location}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}