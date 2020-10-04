declare module 'nodejs-jsencrypt' {
    export class JSEncrypt {
        setPrivateKey(key: string): void;
        encrypt(value: string): string;
    }
}