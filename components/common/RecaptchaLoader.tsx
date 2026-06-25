"use client"
import { useEffect } from 'react'

const RecaptchaLoader = () => {
  useEffect(() => {
    const scriptId = 'recaptcha-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [])

  return null
}

export default RecaptchaLoader
