# Contao Progressive Web App Bundle

A bundle to provide progressive web app support for contao.

> This bundle is still in early beta. Use at your own risk! Serviceworker precaching currently only works for Webpack/Encore enabled pages. 

This bundle is using [PHP Web Push lib](https://github.com/web-push-libs/web-push-php) to provide push notifications. 

## Features

* Create and register manifest file for each page root
* Create and register service worker for each page root
* Subscribe to Push Notifications button as Content Element
* send custom push notifications from backend

## Setup

### Requirements

* PHP >= 7.1
* PHP extensions:
    * gmp
    * mbstring
    * curl
    * openssl
* Contao >=4.4 
* [Contao Head Bundle](https://github.com/heimrichhannot/contao-head-bundle)

### Install

Call `composer require heimrichhannot/contao-pwa-bundle` and update database afterwards.

### First Steps

1. Your page template (typically `fe_page.html5`) must support [Head Bundle](https://github.com/heimrichhannot/contao-head-bundle). This means it must output at least `$this->meta` in head section. See bundle readme for more information
2. If you want to use push notifications, add vapid keys to your config (see [Setup -> Vapidkeys](#push-notifications))
3. Create an PWA Configuration(Backend -> System -> PWA Configuration)
4. Add the configuration to a page root (in page settings you find a new section "Progressive Web App", select yes and choose your configuration)
    * On saving the page the page manifest and the serviceworker will be generated
5. To provide an option to register to your push notifications, you need to add the Push Notification Subscribe Button content element on your page
 
### Push Notifications

#### VAPID keys

You need to add your server vapid keys to your config file, typical in your project config.yml. If you haven't already vapid keys, you can generate in the PWA Bundle backend (Contao Backend -> System -> PWA Configuration -> Control -> Authentication)

```yaml
huh_pwa:
  vapid:
    subject: "mailto:test@example.org"
    publicKey: "BPZACSEB_Efa3_e2XdVRm4M3Suga2WnhNs9THpVixfScWicSiA3ZYQ3zCG4Uez3EnbL3q-O2RomlZtYejva642M"
    privateKey: "W0qtmwq0aB47Swmid0uDZyW945p9b5bgv_WmfsmsRHw"
```

## Usage

### Regenerate files
You can regenerate all your manifest and service worker files at once from the Pwa Control (Contao Backend -> System -> PWA Configuration -> Control -> Files -> Rebuild files)

There is also an command available: `huh:pwa:build`

## Developers

### JS Event

To support custom controls, there are events and event listeners that can be used. All events are dispatched and listen to on `document`. 

#### Events

Event                              | Description
---------------------------------- | --------------------
huh_pwa_sw_not_supported           | Fired if browser not supports serviceworker or no service worker found.
huh_pwa_push_not_supported         | Fired if browser not supports push notifications
huh_pwa_push_permission_denied     | Fired if browser has push notifications blocked
huh_pwa_push_isSubscribed          | Fired when subscribed to push notifications (on page load or when subscribe)
huh_pwa_push_isUnsubscribed        | Fired when unsubscribed from push notification (on page load or when unsubscribe)
huh_pwa_push_subscription_failed   | Fired when subscription to push notifications failed. Error reason can be found in event.detail.reason.
huh_pwa_push_unsubscription_failed | Fired when unsubscribe from push notifications failed. Error reason can be found in event.detail.reason.

#### Listener

Event type | Usage | Description
---------- | ----- | -----------
huh_pwa_push_changeSubscriptionState | `new CustomEvent( 'huh_pwa_push_changeSubscriptionState', {detail: ['subscribe'\|'unsubscribe']} )` | Fire this event when the user interacts with your control to change his subscription state. Use a `CustomEvent` with detail parameter set to subscribe or unsubscrive.

### Complete configuration

```yaml
huh_pwa:
  vapid:
    subject: "mailto:test@example.org"
    publicKey: "BPZACSEB_Efa3_e2XdVRm4M3Suga2WnhNs9THpVixfScWicSiA3ZYQ3zCG4Uez3EnbL3q-O2RomlZtYejva642M"
    privateKey: "W0qtmwq0aB47Swmid0uDZyW945p9b5bgv_WmfsmsRHw"
  manifest_path: '/pwa' # where the manifest files should be located within web folder
  configfile_path: '/pwa' # where the configuration files should be located within web folder
```

### Commands
 
Command          | Description
---------------- | -----------
huh:pwa:build    | (Re)Build config specific files like service worker and manifest
huh:pwa:sendpush | Send unsent push notifications

### Add additional head scripts

It is possible to add additional js code to the head section by using the `PwaHeadScriptTags` object available available as `huh.head.tag.pwa.script` service. Code added with `addScript` will be outputted in header section of your page within `<script type='text/javascript'>` tags.


## Todo
* image size config
* support svg icons