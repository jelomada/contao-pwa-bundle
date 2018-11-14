function PushNotificationSubscription (subscribePath, unsubscribePath)
{
    this.debug = false;
    this.subscribePath = subscribePath;
    this.unsubscribePath = unsubscribePath;

    this.collectElementsToUpdate = () => {
        this.buttons = document.querySelectorAll('.huhPwaWebSubscription');
    };
    this.subscribe = () => {
        console.log('[Push Notification Subscription] Subscribe');
        navigator.serviceWorker.ready
        .then(async (registration) => {
            let responce = await fetch('./api/notifications/publickey');
            const publicKey = await responce.text();

            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(publicKey)
            }).then((subscription) => {
                console.log("[Push Notification Subscription] Subscribed");
                fetch(this.subscribePath, {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        subscription: subscription
                    }),
                });
            }).then(this.setUnsubscribe);
        });
    };
    this.unsubscribe = () => {
        console.log('[Push Notification Subscription] Unsubscribe');
        navigator.serviceWorker.ready
        .then((registration) => {
            return registration.pushManager.getSubscription();
        }).then((subscription) => {
            return subscription.unsubscribe()
            .then(() => {
                console.log('[Push Notification Subscription] Unsubscribed', subscription.endpoint);
                return fetch(this.unsubscribePath, {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        subscription: subscription
                    })
                });
            });
        }).then(this.setSubscribe);
    };
    this.setSubscribe = () => {
        if (!this.checkPermission())
        {
            return;
        }
        console.log('[Push Notification Subscription] Update Button to "Subscribe"');
        this.buttons.forEach((button) => {
            button.removeAttribute('disabled');
            button.textContent = "Subscribe";
            button.addEventListener('click', this.subscribe);
        });
    };
    this.setUnsubscribe = () => {
        if (!this.checkPermission())
        {
            return;
        }
        console.log('[Push Notification Subscription] Update Button to "Unsubscribe"');
        this.buttons.forEach((button) => {
            button.removeAttribute('disabled');
            button.textContent = "Unsubscribe";
            button.addEventListener('click', this.unsubscribe);
        })
    };
    this.checkPermission = () => {
        if (Notification.permission === 'denied')
        {
            console.log('[Push Notification Subscription] Permission denied');
            this.buttons.forEach((button) => {
                button.textContent = "Blocked";
                button.disabled = true;
            });
            return false;
        }
        return true;
    };
    this.hide = () => {
        if (true === this.debug)
        {
            console.log('[Push Notification Subscription] Hide Subscription Elements');
        }
        this.buttons.forEach((button) => {
            button.classList.add('hidden');
        })
    };
    this.show = () => {
        if (true === this.debug)
        {
            console.log('[Push Notification Subscription] Show Subscription Elements');
        }
        this.buttons.forEach((button) => {
            if (botton.classList.contains('hidden'))
            {
                button.classList.remove('hidden');
            }
        })
    };
    this.urlBase64ToUint8Array = (base64String) => {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };
}