// appinsights.js
import appInsights from 'applicationinsights';
import { config } from '../config/index.js';

let client = null;

export const initAppInsights = () =>{
    const appInsightsConnectionString = config.azure.appinsights_connection_string;

    if(!appInsightsConnectionString){
        return;
    }

    appInsights.setup(appInsightsConnectionString)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(true)
    .setUseDiskRetryCaching(true)
    .start();

    client = appInsights.defaultClient;

    return client

}

export function getAppInsightClient(){
    return client
}

// export const appInsightClient = appInsights.defaultClient;
