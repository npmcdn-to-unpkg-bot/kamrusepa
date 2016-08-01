export interface Config{
    appPort: number;
    appSecret: string,
    originsWhitelist: [string],
    mongoUrl: string
    env: string
}