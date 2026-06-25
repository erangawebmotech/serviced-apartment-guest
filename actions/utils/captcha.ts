export async function getCaptchaToken() {
    return new Promise<string | null>(resolve => {
        grecaptcha.ready(async () => {
            const sitekey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

            if (!sitekey) {
                resolve(null)
                return;
            }
            const token = await grecaptcha.execute(sitekey, {
                action: 'contact',
            })
            resolve(token)
        })
    })
}

export async function verifyCaptchaToken(token: string) {
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    if (!secretKey) {
        throw new Error('No Secret Key Found!')
    }

    const url = new URL('https://www.google.com/recaptcha/api/siteverify')
    url.searchParams.append('secret', secretKey)
    url.searchParams.append('response', token)

    const res = await fetch(url, { method: "POST" });
    const captchaData: CaptchaData = await res.json();

    if (!res.ok) {
        return null;
    }
    return captchaData;
}

type CaptchaData = | {
    success: true,
    challenge_ts: string;
    hostname: string,
    score: number,
    action: string,
} |
{
    success: false,
    'error-codes': ErrorCodes[]
}

type ErrorCodes = "missing-input-secret" | 'invalid-input-secret' | 'missing-input-response' | 'invalid-input-response' | 'bad-request' | 'timeout-or-duplicate';