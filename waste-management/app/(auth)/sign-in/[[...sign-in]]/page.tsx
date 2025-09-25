"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setToast } from "@/components/ui/toast";
import Loading from "@/app/loading";
import { Loader2 } from "lucide-react";

// Define carousel images directly in this file
const carouselImages = [
  {
    src: "/carousel/image1.png",
    title: "India Generates 1.5 Lakh Tonnes of Waste Every Day",
    description: "More than half of it goes untreated. Together, we can change this.",
  },
  {
    src: "/carousel/image2.png",
    title: "We Make Waste Management Simple",
    description: "Learn sustainable practices, report issues, and track waste disposal — all in one place.",
  },
  {
    src: "/carousel/image3.png",
    title: "Join Our Community of Waste Warriors",
    description: "Connect with like-minded citizens and make a positive impact on your environment.",
  },
];

interface SignInDetails {
  email: string;
  otp: string;
  step: number;
}

export default function SignIn() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'otp' | 'verify' | null>(null);

  const [details, setDetails] = useState<SignInDetails>({
    email: "",
    otp: "",
    step: 1
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Global paste handler for OTP
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.getAttribute('data-index')) {
        const pastedData = e.clipboardData?.getData('text') || '';
        const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (numbers.length > 1) {
          e.preventDefault();
          const newOtp = details.otp.split('');
          for (let i = 0; i < numbers.length && i < 6; i++) {
            newOtp[i] = numbers[i];
          }
          setDetails({ ...details, otp: newOtp.join('') });
          
          // Focus the next empty input or the last filled input
          const nextIndex = Math.min(numbers.length, 5);
          const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [details.otp]);


  // Auto-rotation for carousel
  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setCurrentSlide(prev => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      clearInterval(autoplayInterval);
    };
  }, []);

  const sendOTP = async () => {
    if (!isLoaded) {
      setToast({ title: "Loading Error", message: "Authentication system is still loading. Please try again.", type: "error" });
      return;
    }
    
    if (!details.email) {
      setToast({ title: "Validation Error", message: "Please enter your email address", type: "error" });
      return;
    }

    if (!signIn) {
      setToast({ title: "Error", message: "Sign in not available. Please try again.", type: "error" });
      return;
    }

    setIsLoading(true);
    setLoadingType('otp');

    try {
      await signIn.create({
        identifier: details.email,
      });
      
      const firstFactor = signIn.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code"
      );
      
      if (!firstFactor) {
        console.error("Email code factor not available!");
        setToast({ title: "Error", message: "Verification method not available. Please try again.", type: "error" });
      } else {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: firstFactor.emailAddressId,
        });
        setDetails({ ...details, step: 2 });
        setToast({ title: "Success", message: "Verification code sent successfully!", type: "success" });
      }
    } catch (error: unknown) {
      console.error("Error during sign in:", error);
      
      // Check for session already exists error
      if (error && typeof error === 'object' && 'errors' in error) {
        const clerkError = error as { errors?: Array<{ code: string; message: string }> };
        if (clerkError.errors?.some((err) => err.code === "session_exists")) {
          setToast({ 
            title: "Already Signed In", 
            message: "You're already signed in. Redirecting to dashboard...", 
            type: "info" 
          });
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
          return;
        }
      }
      
      setToast({ title: "Error", message: "Error sending verification code. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const verifyOTP = async () => {
    if (!details.otp || details.otp.length !== 6) {
      setToast({ title: "Validation Error", message: "Please enter a valid 6-digit verification code", type: "error" });
      return;
    }

    if (!isLoaded || !signIn) {
      setToast({ title: "Loading Error", message: "Authentication system is still loading. Please try again.", type: "error" });
      return;
    }

    setIsLoading(true);
    setLoadingType('verify');

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: details.otp,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.push("/dashboard");
          },
        });
      } else {
        console.error(signInAttempt);
        setToast({ title: "Verification Failed", message: "Verification failed. Please check your code and try again.", type: "error" });
      }
    } catch (error: unknown) {
      console.error("Sign-in verification error:", error);
      
      // Check for session already exists error
      if (error && typeof error === 'object' && 'errors' in error) {
        const clerkError = error as { errors?: Array<{ code: string; message: string }> };
        if (clerkError.errors?.some((err) => err.code === "session_exists")) {
          setToast({ 
            title: "Already Signed In", 
            message: "You're already signed in. Redirecting to dashboard...", 
            type: "info" 
          });
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
          return;
        }
      }
      
      setToast({ title: "Verification Failed", message: "Verification failed. Please check your code and try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const resendOTP = async () => {
    if (!isLoaded) {
      setToast({ title: "Loading Error", message: "Authentication system is still loading. Please try again.", type: "error" });
      return;
    }

    if (!signIn) {
      setToast({ title: "Error", message: "Sign in not available. Please try again.", type: "error" });
      return;
    }

    setIsLoading(true);
    setLoadingType('otp');

    try {
      await signIn.create({
        identifier: details.email,
      });
      
      const firstFactor = signIn.supportedFirstFactors?.find(
        (f) => f.strategy === "email_code"
      );
      
      if (!firstFactor) {
        console.error("Email code factor not available!");
        setToast({ title: "Error", message: "Verification method not available. Please try again.", type: "error" });
      } else {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: firstFactor.emailAddressId,
        });
        setToast({ title: "Success", message: "Verification code sent successfully!", type: "success" });
      }
    } catch (error: unknown) {
      console.error("Error resending verification code:", error);
      
      // Check for session already exists error
      if (error && typeof error === 'object' && 'errors' in error) {
        const clerkError = error as { errors?: Array<{ code: string; message: string }> };
        if (clerkError.errors?.some((err) => err.code === "session_exists")) {
          setToast({ 
            title: "Already Signed In", 
            message: "You're already signed in. Redirecting to dashboard...", 
            type: "info" 
          });
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
          return;
        }
      }
      
      setToast({ title: "Error", message: "Error resending verification code. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  if (!isLoaded) {
    return (
      <Loading />
    );
  }

  const renderStep = () => {
    switch (details.step) {
      case 1: // Email Input
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl mb-10 text-center font-semibold">Sign In</h2>
              <label htmlFor="email" className="block text-sm mb-3 ml-1">Enter Email Address</label>
              <div className="relative">
                <Input
                  id="email"
                  value={details.email}
                  onChange={(e) => {
                    setDetails({ ...details, email: e.target.value });
                  }}
                  type="email"
                  className="h-10 sm:h-12 bg-gray-50 text-sm cursor-pointer"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enter your email to get started. We&apos;ll send you a verification code.
            </p>
            <Button 
              onClick={sendOTP} 
              className="w-full h-12 bg-primary hover:bg-primary/90 cursor-pointer text-white rounded-full flex items-center justify-center gap-2"
              disabled={!details.email || (isLoading && loadingType === 'otp')}
            >
              {isLoading && loadingType === 'otp' ? (
                <>
                  <Loader2 size="sm" className="animate-spin" /> 
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        );
      
      case 2: // OTP Verification
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-8 text-center">Verification</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">Enter the verification code sent to your email</p>
              <label htmlFor="otp" className="block text-sm mb-3 text-center font-medium">Enter OTP</label>
              <div className="flex gap-1 sm:gap-2 justify-center px-2 py-4">
                {Array(6).fill(0).map((_, index) => (
                  <Input
                    key={index}
                    data-index={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="h-12 sm:h-14 w-14 sm:w-14 text-center bg-gray-50 text-lg sm:text-xl font-medium px-0 mx-0.5 sm:mx-1 cursor-pointer"
                    value={details.otp.split('')[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]?$/.test(value)) {
                        const newOtp = details.otp.split('');
                        newOtp[index] = value;
                        setDetails({ ...details, otp: newOtp.join('') });
                        
                        if (value && e.target.nextElementSibling instanceof HTMLInputElement) {
                          (e.target.nextElementSibling as HTMLInputElement).focus();
                        }
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData('text');
                      const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
                      
                      if (numbers.length > 0) {
                        const newOtp = details.otp.split('');
                        for (let i = 0; i < numbers.length && (index + i) < 6; i++) {
                          newOtp[index + i] = numbers[i];
                        }
                        setDetails({ ...details, otp: newOtp.join('') });
                        
                        // Focus the next empty input or the last filled input
                        const nextIndex = Math.min(index + numbers.length, 5);
                        const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`) as HTMLInputElement;
                        if (nextInput) {
                          nextInput.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !details.otp.split('')[index] && index > 0) {
                        const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (prevInput) {
                          prevInput.focus();
                        }
                      }
                    }}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Didn&apos;t receive the code? <span 
                  className="text-primary cursor-pointer hover:underline"
                  onClick={resendOTP}
                >
                  {isLoading && loadingType === 'otp' ? 'Sending...' : 'Resend'}
                </span>
              </p>
            </div>
            <Button 
              onClick={verifyOTP} 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center gap-2 cursor-pointer"
              disabled={isLoading && loadingType === 'verify'}
            >
              {isLoading && loadingType === 'verify' ? (
                <>
                  <Loader2 size="sm" className="animate-spin" /> 
                  Verifying...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[100dvh] w-[100dvw] p-2 sm:p-4 md:p-8 bg-white justify-center">
      {/* CAPTCHA element for Clerk */}
      <div id="clerk-captcha" />
      
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center rounded-xl sm:rounded-3xl bg-white overflow-hidden">
        <div className="w-full flex justify-center mb-4 md:mb-6">
          <Image 
            src="/logo_green.png" 
            alt="Logo" 
            width={50} 
            height={50} 
            className="w-[80px] md:w-[80px] h-auto object-contain" 
            priority
          />
        </div>
        <div className="w-full max-w-lg px-2 sm:px-4 overflow-y-auto max-h-[80vh] sm:max-h-none">
          {renderStep()}
        </div>
      </div>
      
      {/* Right side */}
      <div className="hidden md:block md:w-1/3 relative rounded-3xl bg-gray-900 overflow-hidden ml-4 h-full">
        {/* Image slideshow - show current slide only */}
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Image with background cover */}
              <div 
                className="absolute inset-0 bg-cover bg-center h-full" 
                style={{ backgroundImage: `url(${image.src})` }}
              />
              
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/40 z-10" />
              
              {/* Text content */}
              <div className="absolute bottom-16 left-10 right-10 z-20 text-white">
                <h2 className="text-4xl font-normal text-white leading-10 mb-3" style={{ fontFamily: "var(--font-instrument-serif)" }}>{image.title}</h2>
                <p className="text-sm md:text-base">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress indicator */}
        <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 z-20">
          {carouselImages.map((_, index) => (
            <button 
              key={index} 
              className={`h-1 rounded-full w-16 ${index === currentSlide ? 'bg-green-500' : 'bg-white/30'} transition-all duration-300 hover:bg-green-500/50 cursor-pointer`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}