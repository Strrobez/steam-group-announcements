export default interface IConfiguration {
  steam: {
    username: string;
    password: string;
    sharedSecret: string;
    groupId: string;
  };

  servers: IServer[];
}

export interface IServer {
  name: string;
  connect: string;
  crontabs: string | string[];
  reminder?: boolean;
}
