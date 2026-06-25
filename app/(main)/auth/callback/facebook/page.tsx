"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

const FacebookCallback = () => {
  const params = useSearchParams()

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({
        type: "facebook-login",
        success: !params.get("error")
      }, window.location.origin)

      window.close()
    }
  }, [params])

  return (
    <p className="font-poppins">Logging in with Facebook...</p>
  )
}

export default FacebookCallback

