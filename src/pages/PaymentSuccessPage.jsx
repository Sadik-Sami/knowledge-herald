import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import confetti from "canvas-confetti"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import useAxiosSecure from "@/hooks/use-AxiosSecure"
import useSubscription from "@/hooks/use-Subscription"

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const navigate = useNavigate()
  const { addToast } = useToast()
  const axiosSecure = useAxiosSecure()
  const { refetch } = useSubscription()

  useEffect(() => {
    const triggerConfetti = () => {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }

    const confirmPayment = async () => {
      if (!sessionId) {
        navigate("/subscription")
        return
      }

      try {
        // Changed from post to get
        const { data } = await axiosSecure.get(`/payment/success?session_id=${sessionId}`)
        if (data.success) {
          triggerConfetti()
          await refetch() // Refresh subscription status
          addToast("Payment successful! Enjoy your premium access.", "success")
          setTimeout(() => navigate("/"), 5000)
        } else {
          throw new Error("Payment confirmation failed")
        }
      } catch (error) {
        console.error("Payment confirmation error:", error)
        addToast("Error confirming payment", "error")
        navigate("/subscription")
      }
    }

    confirmPayment()
  }, [sessionId, navigate, addToast, axiosSecure, refetch])

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center bg-muted/30">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <h1 className="text-2xl font-bold">Processing your payment...</h1>
        <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

