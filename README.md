# Webhooks event polling sample application

Node.js (Express) application that can capture webhook events, store the events in Azure Queue and provide an API endpoint for event polling.

## Prerequisites

1. Create "Service" type application in <https://developer.bentley.com/register/>.
2. Prepare an existing iModel that your client has access to.
3. Deploy this application (e.g. Heroku/Netlify or any other preference, more information can be found [here](https://medium.com/itwinjs/deploying-the-itwin-viewer-to-a-web-host-d45c5cfdf0cf)).
4. Provide your configuration values in `.env` file.

When started this application will create a new webhook for related iModel from the configuration, from this point it's up to you to trigger any of the events for that iModel. Normally this should be one-time deployment task and webhook information should be stored in application configuration.

The application expects the events to be delivered to `[POST] https://HOSTNAME/events` and the webhook will be automatically configured to do so. Any captured event by the application will be stored in Azure Queue which at the end is used to pull the events from using other application endpoint `[GET] https://HOSTNAME/events`.

> Webhook created by this application will expire after 30 minutes and will stop sending the events. This can be changed by updating webhook configuration in `services/api.ts` file.
