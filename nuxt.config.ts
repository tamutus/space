// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Cabin: {
            wght: [400, 700],
            ital: [400, 700],
          },
          "Cinzel+Decorative": [700],
          Comfortaa: {
            wght: [300 + ".." + 700],
          },
          "Odibee+Sans": [400],
          Ubuntu: {
            wght: [300, 400, 500, 700],
            ital: [300, 400, 500, 700],
          },
        },
        download: true,
      },
    ],
    "@nuxt/test-utils/module",
  ],

  app: {
    head: {
      meta: [
        {
          name: "author",
          content: "Lavra Tamutus",
        },
        {
          name: "description",
          content: "Homepage of Lavra Tamutus",
        },
        {
          name: "keywords",
          content:
            "web,design,portfolio,designer,fullstack,full,stack,developer,node,express,nodejs,backend,frontend,programmer",
        },
      ],
      link: [{ rel: "stylesheet", href: "/stylesheets/main.css" }],
    },
    pageTransition: {
      name: "page",
    },
  },

  components: true,

  routeRules: {
    "/profile": { ssr: false },
    "/blog/**": { ssr: false },
    "/desk": { ssr: false },
    "/tag/**": { ssr: false },
    "/furry/**": { ssr: false },
  },

  runtimeConfig: {
    gcpPrivateKeyId: "",
    gcpPrivateNsfwKeyId: "",
    gcpEditorKeyId: "",
    gcpPrivateKey: "",
    gcpPrivateNsfwKey: "",
    gcpEditorKey: "",
    gcpClientEmail: "",
    gcpClientNsfwEmail: "",
    gcpEditorClientEmail: "",
    gcpClientId: "",
    gcpClientNsfwId: "",
    gcpClientX509CertUrl: "",
    gcpClientNsfwX509CertUrl: "",
    stripeSk: "",
    public: {
      authDomain: "dev-0ak48f02c4lk72ed.us.auth0.com",
      authClientId: "unDhjkc2PtfSU8BFQhHS30FQNRbTfo2y",
      authApiIdentifier: "https://lavrat.space/dev",
      gcpProjectId: "saucy-toxtricity-84969",
      stripePk: "",
    },
  },

  compatibilityDate: "2024-09-28",
});
