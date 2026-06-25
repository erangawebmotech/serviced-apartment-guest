"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

const GoogleCallback = () => {
  const params = useSearchParams()

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({
        type: "google-login",
        success: !params.get("error")
      }, window.location.origin)

      window.close()
    }
  }, [params])

  return (
    <p className="font-poppins">Logging in with Google...</p>
  )
}

export default GoogleCallback

