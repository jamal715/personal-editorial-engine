// Publication visibility is enforced in app/article/[slug]/page.tsx via publicationBySlug().
// The registry query requires visible=true and status=published, so archived dynamic articles return 404.
// Legacy hand-built research routes remain static until migrated into the registry body store.
export {};
