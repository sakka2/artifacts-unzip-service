'use strict';

export interface ecosystemConfig {
    store: string;
}

export interface queueConfig {
    redisConnection: redisConnection;
    prefix: string;
}

export interface redisConnection {
    host: string;
    port: number;
    options: redisConnectionOption;
    database: number;
}

export interface redisConnectionOption {
    password: string;
    tls: boolean;
}

export interface workerConfig {
    minTaskProcessors: string;
    maxTaskProcessors: number;
    checkTimeout: number;
    maxEventLoopDelay: number;
}

export interface httpdConfig {
    host: string;
    port: number;
    uri: string;
}
