declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_PORT : string;
    TEST_ACCOUNT_EMAIL : string;
    SESSION_SECRET : string;
    SPARKPOST_KEY : string;
    FRONTEND_HOST: string;
    TEST_HOST : string;
    NODE_ENV : string;
  }
}
