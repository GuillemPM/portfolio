import type { Locale, Messages } from "./types";

const en: Messages = {
  nav: {
    about: "About",
    blog: "Blog",
    contact: "Contact",
    connect: "Connect",
  },
  hero: {
    name: "Guillermo Padilla Martin",
    headline: "Building better software.",
    subline:
      "I write about software architecture, Business Central, and building with AI. This is my space to share projects, what I learn, and the ideas that end up changing how I build.",
  },
  cta: {
    hero: "Read the blog",
    blog: "View all posts",
    contact: "Get in touch",
    viewAllPosts: "View all posts",
  },
  about: {
    title: "About me",
    paragraphs: [
      "As a kid I was fascinated by websites, forums, video games, and software. What stuck with me most was realizing they weren't there by magic. Someone had imagined, designed, and built them.",
      "From then on I started looking at things differently. I didn't just want to use them anymore. I wanted to understand them well enough to build my own.",
      "I still feel the same today. A question turns into an experiment. The experiment becomes a project. And the project opens ten more questions.",
      "I don't think I'll ever stop chasing that feeling.",
    ],
  },
  focus: {
    title: "What I work on",
    areas: [
      {
        title: "Software and AI",
        text: "Assistants, integrations, and tools that people actually use.",
      },
      {
        title: "Automation",
        text: "Workflows and glue between services built for every day, not a slide deck.",
      },
      {
        title: "Architecture",
        text: "APIs, observability, and systems you can change when requirements change.",
      },
      {
        title: "Microsoft and Business Central",
        text: "Extensions, AL, and integrations when the back office is BC.",
      },
    ],
  },
  certifications: {
    title: "Certifications",
    subtitle: "Credentials I've earned. More on the way.",
    comingSoon: "Coming soon",
    moreOnTheWay: "More certifications in progress",
    issued: "Issued",
    credentialId: "Credential ID",
    viewCredential: "View credential",
    secondaryTitle: "Additional credentials",
    items: {
      ab731: {
        title: "Microsoft Certified: AI Transformation Leader",
        issuer: "Microsoft",
        description:
          "Exam AB-731. Enterprise AI adoption with Microsoft 365 Copilot, Azure AI, and Microsoft Foundry.",
      },
      googleAiPro: {
        title: "Google AI Professional Certificate",
        issuer: "Google",
        description:
          "Google's professional certificate for using AI in everyday work.",
      },
    },
    secondaryItems: {
      googleAiFundamentals: {
        title: "Google AI Fundamentals",
        issuer: "Google",
      },
      googleAiAppBuilding: {
        title: "Google AI for App Building",
        issuer: "Google",
      },
      googleAiBrainstorming: {
        title: "Google AI for Brainstorming and Planning",
        issuer: "Google",
      },
      googleAiContentCreation: {
        title: "Google AI for Content Creation",
        issuer: "Google",
      },
      googleAiDataAnalysis: {
        title: "Google AI for Data Analysis",
        issuer: "Google",
      },
      googleAiResearch: {
        title: "Google AI for Research and Insights",
        issuer: "Google",
      },
      googleAiWriting: {
        title: "Google AI for Writing and Communicating",
        issuer: "Google",
      },
    },
  },
  blog: {
    title: "Blog",
    subtitle: "Notes from building software.",
    empty: "No posts yet. Check back soon.",
    readMore: "Read article",
    backToBlog: "Back to blog",
    latestTitle: "Latest writing",
  },
  contact: {
    title: "Say hello",
    body: "If you want to talk about software, Business Central, or architecture, reach out on LinkedIn.",
    linkedInTitle: "LinkedIn",
    linkedInBody: "Good for updates and longer messages.",
    linkedInCta: "Open LinkedIn",
    backHome: "Back to home",
  },
  notFound: {
    code: "404",
    title: "Page not found",
    body: "That URL does not exist, or the page moved. Try the home page or the blog.",
    backHome: "Back to home",
    viewBlog: "Read the blog",
  },
  footer: {
    line: "© 2026 GUILLERMO PADILLA MARTIN. ENGINEERED SILENCE.",
    source: "Source",
  },
};

const es: Messages = {
  nav: {
    about: "Sobre mí",
    blog: "Blog",
    contact: "Contacto",
    connect: "Conectar",
  },
  hero: {
    name: "Guillermo Padilla Martin",
    headline: "Construyendo mejor software.",
    subline:
      "Escribo sobre arquitectura de software, Business Central y desarrollo con IA. Este es mi espacio para compartir proyectos, aprendizajes y las ideas que terminan cambiando mi manera de construir.",
  },
  cta: {
    hero: "Leer el blog",
    blog: "Ver todas las entradas",
    contact: "Escribirme",
    viewAllPosts: "Ver todas las entradas",
  },
  about: {
    title: "Sobre mí",
    paragraphs: [
      "De pequeño me fascinaban las páginas web, los foros, los videojuegos y los programas. Pero lo que más me marcó fue descubrir que no estaban ahí por arte de magia. Alguien los había imaginado, diseñado y construido.",
      "Desde entonces empecé a mirar las cosas de otra forma. Ya no quería solo usarlas. Quería entenderlas lo suficiente como para poder crear las mías.",
      "Hoy siento lo mismo. Una pregunta se convierte en experimento. El experimento, en proyecto. Y el proyecto abre diez preguntas más.",
      "No creo que deje de perseguir esa sensación nunca.",
    ],
  },
  focus: {
    title: "En qué trabajo",
    areas: [
      {
        title: "Software e IA",
        text: "Asistentes, integraciones y herramientas que la gente usa de verdad.",
      },
      {
        title: "Automatización",
        text: "Flujos y pegamento entre servicios para el día a día, no para una diapositiva.",
      },
      {
        title: "Arquitectura",
        text: "APIs, observabilidad y sistemas que puedes cambiar cuando cambian los requisitos.",
      },
      {
        title: "Microsoft y Business Central",
        text: "Extensiones, AL e integraciones cuando el back office es BC.",
      },
    ],
  },
  certifications: {
    title: "Certificaciones",
    subtitle: "Credenciales que tengo. Más en camino.",
    comingSoon: "Próximamente",
    moreOnTheWay: "Más certificaciones en progreso",
    issued: "Expedición",
    credentialId: "ID de credencial",
    viewCredential: "Ver credencial",
    secondaryTitle: "Otras credenciales",
    items: {
      ab731: {
        title: "Microsoft Certified: AI Transformation Leader",
        issuer: "Microsoft",
        description:
          "Examen AB-731. Adopción de IA en la empresa con Microsoft 365 Copilot, Azure AI y Microsoft Foundry.",
      },
      googleAiPro: {
        title: "Google AI Professional Certificate",
        issuer: "Google",
        description:
          "Certificado profesional de Google para usar IA en el trabajo.",
      },
    },
    secondaryItems: {
      googleAiFundamentals: {
        title: "Google AI Fundamentals",
        issuer: "Google",
      },
      googleAiAppBuilding: {
        title: "Google AI for App Building",
        issuer: "Google",
      },
      googleAiBrainstorming: {
        title: "Google AI for Brainstorming and Planning",
        issuer: "Google",
      },
      googleAiContentCreation: {
        title: "Google AI for Content Creation",
        issuer: "Google",
      },
      googleAiDataAnalysis: {
        title: "Google AI for Data Analysis",
        issuer: "Google",
      },
      googleAiResearch: {
        title: "Google AI for Research and Insights",
        issuer: "Google",
      },
      googleAiWriting: {
        title: "Google AI for Writing and Communicating",
        issuer: "Google",
      },
    },
  },
  blog: {
    title: "Blog",
    subtitle: "Apuntes de construir software.",
    empty: "Aún no hay entradas. Vuelve pronto.",
    readMore: "Leer artículo",
    backToBlog: "Volver al blog",
    latestTitle: "Últimas publicaciones",
  },
  contact: {
    title: "Hablemos",
    body: "Si quieres hablar de software, Business Central o arquitectura, escríbeme por LinkedIn.",
    linkedInTitle: "LinkedIn",
    linkedInBody: "Buen sitio para novedades y mensajes más largos.",
    linkedInCta: "Abrir LinkedIn",
    backHome: "Volver al inicio",
  },
  notFound: {
    code: "404",
    title: "Página no encontrada",
    body: "Esa URL no existe, o la página se ha movido. Prueba el inicio o el blog.",
    backHome: "Volver al inicio",
    viewBlog: "Leer el blog",
  },
  footer: {
    line: "© 2026 GUILLERMO PADILLA MARTIN. ENGINEERED SILENCE.",
    source: "Source",
  },
};

const ca: Messages = {
  nav: {
    about: "Sobre mi",
    blog: "Blog",
    contact: "Contacte",
    connect: "Connectar",
  },
  hero: {
    name: "Guillermo Padilla Martin",
    headline: "Construint millor software.",
    subline:
      "Escric sobre arquitectura de software, Business Central i desenvolupament amb IA. Aquest és el meu espai per compartir projectes, aprenentatges i les idees que acaben canviant la meva manera de construir.",
  },
  cta: {
    hero: "Llegir el blog",
    blog: "Veure totes les entrades",
    contact: "Escriure'm",
    viewAllPosts: "Veure totes les entrades",
  },
  about: {
    title: "Sobre mi",
    paragraphs: [
      "De petit em fascinaven les pàgines web, els fòrums, els videojocs i els programes. El que més em va marcar va ser descobrir que no hi eren per art de màgia. Algú els havia imaginat, dissenyat i construït.",
      "Des d'aleshores vaig començar a mirar les coses d'una altra manera. Ja no només volia fer-les servir. Volia entendre-les prou com per poder crear les meves.",
      "Avui sento el mateix. Una pregunta es converteix en experiment. L'experiment, en projecte. I el projecte obre deu preguntes més.",
      "No crec que deixi de perseguir aquesta sensació mai.",
    ],
  },
  focus: {
    title: "En què treballo",
    areas: [
      {
        title: "Software i IA",
        text: "Assistents, integracions i eines que la gent fa servir de debò.",
      },
      {
        title: "Automatització",
        text: "Fluxos i enganxall entre serveis per al dia a dia, no per a una diapositiva.",
      },
      {
        title: "Arquitectura",
        text: "APIs, observabilitat i sistemes que pots canviar quan canvien els requisits.",
      },
      {
        title: "Microsoft i Business Central",
        text: "Extensions, AL i integracions quan el back office és BC.",
      },
    ],
  },
  certifications: {
    title: "Certificacions",
    subtitle: "Credencials que tinc. Més en camí.",
    comingSoon: "Properament",
    moreOnTheWay: "Més certificacions en progrés",
    issued: "Expedició",
    credentialId: "ID de credencial",
    viewCredential: "Veure credencial",
    secondaryTitle: "Altres credencials",
    items: {
      ab731: {
        title: "Microsoft Certified: AI Transformation Leader",
        issuer: "Microsoft",
        description:
          "Examen AB-731. Adopció d'IA a l'empresa amb Microsoft 365 Copilot, Azure AI i Microsoft Foundry.",
      },
      googleAiPro: {
        title: "Google AI Professional Certificate",
        issuer: "Google",
        description:
          "Certificat professional de Google per usar IA a la feina.",
      },
    },
    secondaryItems: {
      googleAiFundamentals: {
        title: "Google AI Fundamentals",
        issuer: "Google",
      },
      googleAiAppBuilding: {
        title: "Google AI for App Building",
        issuer: "Google",
      },
      googleAiBrainstorming: {
        title: "Google AI for Brainstorming and Planning",
        issuer: "Google",
      },
      googleAiContentCreation: {
        title: "Google AI for Content Creation",
        issuer: "Google",
      },
      googleAiDataAnalysis: {
        title: "Google AI for Data Analysis",
        issuer: "Google",
      },
      googleAiResearch: {
        title: "Google AI for Research and Insights",
        issuer: "Google",
      },
      googleAiWriting: {
        title: "Google AI for Writing and Communicating",
        issuer: "Google",
      },
    },
  },
  blog: {
    title: "Blog",
    subtitle: "Apunts de construir software.",
    empty: "Encara no hi ha entrades. Torna aviat.",
    readMore: "Llegir article",
    backToBlog: "Tornar al blog",
    latestTitle: "Últimes publicacions",
  },
  contact: {
    title: "Parlem",
    body: "Si vols parlar de software, Business Central o arquitectura, escriu-me per LinkedIn.",
    linkedInTitle: "LinkedIn",
    linkedInBody: "Bon lloc per novetats i missatges més llargs.",
    linkedInCta: "Obrir LinkedIn",
    backHome: "Tornar a l'inici",
  },
  notFound: {
    code: "404",
    title: "Pàgina no trobada",
    body: "Aquesta URL no existeix, o la pàgina s'ha mogut. Prova l'inici o el blog.",
    backHome: "Tornar a l'inici",
    viewBlog: "Llegir el blog",
  },
  footer: {
    line: "© 2026 GUILLERMO PADILLA MARTIN. ENGINEERED SILENCE.",
    source: "Font",
  },
};

export const dictionaries: Record<Locale, Messages> = { en, es, ca };
