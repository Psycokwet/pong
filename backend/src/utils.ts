import * as bcrypt from 'bcrypt';

export function validateEmail(email: string): RegExpMatchArray {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
}

export async function crypt(pass: string): Promise<string> {
  return bcrypt.genSalt(10).then((s) => bcrypt.hash(pass, s));
}

export async function compareCryptedPassword(
  pass: string,
  hashPass: string,
): Promise<boolean> {
  return bcrypt.compare(pass, hashPass);
}
