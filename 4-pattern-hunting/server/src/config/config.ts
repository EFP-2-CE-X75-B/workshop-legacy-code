/**
 * Singleton Pattern
 * 
 * This class is a singleton that contains the configuration for the server.
 * It is used to store and get the configuration for the server.
 * 
 * @author [Steve Lebleu]
 * @version 1.0
 */
export class Config {
  private static instance: Config;
  private config: Record<string, any>;

  private constructor() {
    this.config = {
      port: 3001, // Port fixe pour le développement
      maxConnections: 100,
      notificationTypes: [
        'info',
        'warning',
        'error',
        'success'
      ],
      deliveryMethods: [
        'websocket',
        'webhook',
        'email'
      ],
      retryAttempts: 3
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public get(key: string): any {
    return this.config[key];
  }

  public set(key: string, value: any): void {
    this.config[key] = value;
  }
} 