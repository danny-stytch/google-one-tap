import { useContext, useEffect, useState } from "react"
// import { fb } from "./firebase"
import { GlobalContext } from "./pages/_app"

declare var google: any

export const useGoogleOneTap = () => {
  const [id_token, setId_token] = useState(null)
  const [shouldShowFallbackButton, setShouldShowFallbackButton] = useState(
    false
  )

  const { loggedInUser, authLoading } = useContext(GlobalContext)

  useEffect(() => {
    console.log("authLoading", authLoading)
  }, [authLoading])

  useEffect(() => {
    if (!loggedInUser) {
      const handleCredentialResponse = (response) => {
        console.log(response)
        setId_token(response.credential)
      }

      const nativeCallback = (obj) => {
        console.log("hi!")
        console.log(obj)
      }

      const client_id = ""
      google.accounts.id.initialize({
        client_id,
        // callback: handleCredentialResponse,
        auto_select: false,
        context: "use",
        nonce: "his!",
        native_callback: nativeCallback,
        ux_mode: "popup",
        login_uri: "http://localhost:8080",
        prompt_parent_id: "put-google-one-tap-here-plz",
      })
      google.accounts.id.prompt((notification) => {
        console.log("notification is: ", notification.getMomentType())
        if (notification.isDisplayMoment()) {
          console.log("IS DISPLAY MOMENT")
        }

        if (notification.isNotDisplayed()) {
          console.warn(
            "one-tap did not show because:",
            notification.getNotDisplayedReason()
          )
          setShouldShowFallbackButton(true)
        }
        if (notification.isSkippedMoment()) {
          console.warn(
            "one-tap skipped because:",
            notification.getSkippedReason()
          )
          setShouldShowFallbackButton(true)
        }
        if (notification.isDismissedMoment()) {
          console.warn(
            "one-tap dismissed because:",
            notification.getDismissedReason()
          )
          if (notification.getDismissedReason() !== "credential_returned") {
            setShouldShowFallbackButton(true)
          }
        }
      })
    } else {
      google.accounts.id.cancel()
    }
  }, [loggedInUser])

  useEffect(() => {
    console.log(loggedInUser)
  }, [loggedInUser])

  // useEffect(() => {
  //   if (id_token) {
  //     // Sign in with credential from the Google user.
  //     // fb.auth()
  //     //   .signInWithCredential(fb.auth.GoogleAuthProvider.credential(id_token))
  //     //   .catch(function (error) {
  //     //     console.error("bruno says", error)
  //     //   })
  //   }
  // }, [id_token])

  return {
    shouldShowFallbackButton,
    setShouldShowFallbackButton,
    loggedInUser,
    authLoading,
  }
}
