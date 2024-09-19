import * as bcrypt from 'bcrypt';


export class EncryptLogic {
  private static readonly saltRounds: number = 15;

  public static async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds).then((hash) => {
      return hash;
    }).catch((error) => {
      throw error;
    });
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash).then((result) => {
      return result;
    }).catch((error) => {
      throw error;
    });
  }
}