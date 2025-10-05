import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class TelegramService {
  private readonly botToken: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  }

  async validateInitData(initData: string): Promise<boolean> {
    try {
      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');
      urlParams.delete('hash');

      const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      const secretKey = createHmac('sha256', 'WebAppData')
        .update(this.botToken)
        .digest();

      const calculatedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      return calculatedHash === hash;
    } catch (error) {
      return false;
    }
  }

  parseInitData(initData: string): any {
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    
    if (!userStr) {
      throw new Error('User data not found in init data');
    }

    return JSON.parse(userStr);
  }
}