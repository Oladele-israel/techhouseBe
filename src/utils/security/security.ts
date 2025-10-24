import * as argon2 from 'argon2';
import { Response } from 'express';

export async function hash(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id, 
      memoryCost: 2 ** 16,   
      timeCost: 3,        
      parallelism: 1,    
    });
  } catch (error) {
    throw new Error('Error hashing password');
  }
}


export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
): void {
  const accessTtl = 15 * 60 * 1000; // 15 min
  const refreshTtl = 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie('access', tokens.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: accessTtl,
    path: '/',
  });

  res.cookie('refresh', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: refreshTtl,
    path: '/',
  });
}

export async function verify(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }

  
}

