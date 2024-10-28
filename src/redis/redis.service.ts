import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => console.error('Redis Client Error:', err));
  }

  public async hset(key: string, field: string, value: string) {
    return this.client.hset(key, field, value);
  }

  public async hgetall(key: string) {
    return this.client.hgetall(key);
  }

  public async del(key: string) {
    return this.client.del(key);
  }

  public async hdel(key: string, field: string) {
    return this.client.hdel(key, field);
  }
}
