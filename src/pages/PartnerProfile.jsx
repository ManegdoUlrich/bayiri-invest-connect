import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { partnersApi } from "@/api/partners";
import {
  ArrowLeft, MapPin, Mail, Phone, Globe, Building2, Scale,
  FileText, Home, HelpCircle, Calendar, ExternalLink, Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SPECIALTY = {
  btp:        { label: "Bureau BTP",        Icon: Building2, color: "bg-orange-500/10 text-orange-600" },
  juridique:  { label: "Cabinet juridique", Icon: Scale,     color: "bg-blue-500/10 text-blue-600" },
  notarial:   { label: "Étude notariale",   Icon: FileText,  color: "bg-purple-500/10 text-purple-600" },
  immobilier: { label: "Agence immobilière",Icon: Home,      color: "bg-green-500/10 text-green-600" },
  autre:      { label: "Autre",             Icon: HelpCircle,color: "bg-muted text-muted-foreground" },
};

export default function PartnerProfile() {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [lightbox, setLightbox] = useState(null); // { photos, idx }

  useEffect(() => {
    partnersApi.get(id)
      .then(setPartner)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!partner) return (
    <div className="text-center py-16 text-muted-foreground">
      <p>Partenaire introuvable.</p>
      <Link to="/projects"><Button variant="link" className="mt-3">Retour</Button></Link>
    </div>
  );

  const spec = SPECIALTY[partner.specialty] || SPECIALTY.autre;
  const SpecIcon = spec.Icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      {/* Header card */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-6">
          {/* Avatar + badge */}
          <div className="flex items-end gap-5 -mt-10 mb-5">
            <div className="shrink-0">
              {partner.photoUrl ? (
                <img
                  src={partner.photoUrl}
                  alt={partner.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-background shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-muted border-4 border-background shadow-md flex items-center justify-center">
                  <SpecIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h1 className="text-2xl font-heading font-bold leading-tight truncate">{partner.name}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${spec.color}`}>
                <SpecIcon className="w-3.5 h-3.5" />{spec.label}
              </span>
            </div>
          </div>

          {/* Description */}
          {partner.description && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{partner.description}</p>
          )}

          {/* Contact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {(partner.city || partner.country) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{[partner.city, partner.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {partner.email && (
              <a href={`mailto:${partner.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{partner.email}</span>
              </a>
            )}
            {partner.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{partner.phone}</span>
              </div>
            )}
            {partner.website && (
              <a href={partner.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{partner.website.replace(/^https?:\/\//, "")}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>
            )}
          </div>

          {/* Stat */}
          {partner._count?.projects > 0 && (
            <div className="mt-5 pt-5 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                <span className="font-heading font-bold text-foreground text-base">{partner._count.projects}</span>{" "}
                projet{partner._count.projects > 1 ? "s" : ""} réalisé{partner._count.projects > 1 ? "s" : ""} via Bayiri Invest
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Réalisations */}
      {partner.realizations?.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-heading font-bold text-xl">Réalisations</h2>
          <div className="space-y-6">
            {partner.realizations.map((r) => (
              <div key={r.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                {/* Photos grid */}
                {r.photoUrls?.length > 0 && (
                  <div className={`grid gap-1 ${r.photoUrls.length === 1 ? "grid-cols-1" : r.photoUrls.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                    {r.photoUrls.slice(0, 6).map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden cursor-zoom-in ${r.photoUrls.length === 1 ? "aspect-video" : "aspect-square"}`}
                        onClick={() => setLightbox({ photos: r.photoUrls, idx })}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        {idx === 5 && r.photoUrls.length > 6 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-heading font-bold text-2xl">+{r.photoUrls.length - 6}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h3 className="font-heading font-semibold text-lg">{r.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.year && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />{r.year}
                        </Badge>
                      )}
                      {r.city && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <MapPin className="w-3 h-3" />{r.city}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {r.description && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.description}</p>
                  )}
                  {r.photoUrls?.length > 0 && (
                    <button
                      onClick={() => setLightbox({ photos: r.photoUrls, idx: 0 })}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Voir toutes les photos ({r.photoUrls.length})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {partner.realizations?.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-10 text-center text-muted-foreground">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Aucune réalisation publiée pour le moment.</p>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black border-0">
          {lightbox && (
            <div className="relative">
              <img
                src={lightbox.photos[lightbox.idx]}
                alt=""
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <div className="flex items-center justify-between mt-2 px-2">
                <button
                  className="text-white/70 hover:text-white text-sm disabled:opacity-30"
                  disabled={lightbox.idx === 0}
                  onClick={() => setLightbox(l => ({ ...l, idx: l.idx - 1 }))}
                >← Précédente</button>
                <span className="text-white/50 text-xs">{lightbox.idx + 1} / {lightbox.photos.length}</span>
                <button
                  className="text-white/70 hover:text-white text-sm disabled:opacity-30"
                  disabled={lightbox.idx === lightbox.photos.length - 1}
                  onClick={() => setLightbox(l => ({ ...l, idx: l.idx + 1 }))}
                >Suivante →</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
