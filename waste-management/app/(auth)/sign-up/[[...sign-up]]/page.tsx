"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setToast } from "@/components/ui/toast";
import Loading from "@/app/loading";
import { Loader2 } from "lucide-react";

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

interface Details {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  age: string;
  location: string;
  profilePhoto?: File | null;
  step: number;
}

interface ClerkError {
  message: string;
  long_message?: string;
  code: string;
}

interface ClerkErrorResponse {
  errors?: ClerkError[];
  clerk_trace_id?: string;
}

export default function SignUp() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, userId } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'otp' | 'verify' | 'profile' | null>(null);

  const [details, setDetails] = useState<Details>({
    email: "",
    otp: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    age: "",
    location: "",
    profilePhoto: null,
    step: 1,
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);
  

  useEffect(() => {
    if (isSignedIn && userId) {
      signUpCustomRequest();
    }
  }, [isSignedIn, userId]);

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
  
  const signUpCustomRequest = () => {
    if (!userId) {
      console.log("User ID not available yet");
      return;
    }
    
    if (!details.firstName || !details.lastName || !details.email || !details.phoneNumber) {
      console.log("Missing required fields for backend request");
      return;
    }

    const userInfo = {
      id: userId,
      name: details.firstName + " " + details.lastName,
      email: details.email,
      phoneNumber: details.phoneNumber,
      localityId: 5,
    };
    
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/citizens/create`, userInfo)
      .then((response) => {
        console.log(response);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };

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

    if (!details.firstName || !details.lastName) {
      setToast({ title: "Validation Error", message: "Please enter your full name", type: "error" });
      return;
    }

    setIsLoading(true);
    setLoadingType('otp');

    try {
      await signUp.create({
        emailAddress: details.email,
        firstName: details.firstName,
        lastName: details.lastName,
      });

      await signUp.prepareEmailAddressVerification();
      setDetails({ ...details, step: 3 });
    } catch (error: unknown) {
      console.error("Error during sign-up:", error);
      
      const clerkError = error as ClerkErrorResponse;
      
      if (clerkError?.errors?.some((err) => err.code === "session_exists")) {
        setToast({ title: "Session Error", message: "You're already signed in. Please sign out first or go to the sign-in page.", type: "error" });
        return;
      }
      
      if (clerkError?.errors?.some((err) => err.code === "form_identifier_exists")) {
        setToast({ title: "Account Exists", message: "An account with this email already exists. Please sign in instead.", type: "error" });
        setTimeout(() => {
            router.push("/sign-in");
          }, 2000);
        return;
      }
      
      setToast({ title: "Send Error", message: "Error sending verification code. Please try again.", type: "error" });
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

    setIsLoading(true);
    setLoadingType('otp');

    try {
      await signUp.prepareEmailAddressVerification();
      setToast({ title: "Success", message: "Verification code sent successfully!", type: "success" });
    } catch (error: unknown) {
      console.error("Error resending verification code:", error);
      
      const clerkError = error as ClerkErrorResponse;
      
      if (clerkError?.errors?.some((err) => err.code === "session_exists")) {
        setToast({ title: "Session Error", message: "You're already signed in. Please sign out first or go to the sign-in page.", type: "error" });
        return;
      }
      
      setToast({ title: "Resend Error", message: "Error resending verification code. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const submitForm = async () => {
    if (!isLoaded) return;

    if (!details.otp || details.otp.length !== 6) {
      setToast({ title: "Validation Error", message: "Please enter a valid 6-digit verification code", type: "error" });
      return;
    }

    setIsLoading(true);
    setLoadingType('verify');

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: details.otp,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
          },
        });
        signUpCustomRequest();
      } else {
        console.error(signUpAttempt);
        setToast({ title: "Verification Failed", message: "Verification failed. Please check your code and try again.", type: "error" });
      }
    } catch (error: unknown) {
      console.error("Sign-up verification error:", error);
      
      const clerkError = error as ClerkErrorResponse;
      
      if (clerkError?.errors?.some((err) => err.code === "session_exists")) {
        setToast({ title: "Session Error", message: "You're already an existing user. Please go to sign in.", type: "error" });
        return;
      }
      
      if (clerkError?.errors?.some((err) => err.code === "form_identifier_exists")) {
        setToast({ title: "Account Exists", message: "An account with this email already exists. Please sign in instead.", type: "error" });
        return;
      }
      
      setToast({ title: "Verification Failed", message: "Verification failed. Please check your code and try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  if (!isLoaded) {
    return (
      <Loading/>
    );
  }

  const renderStep = () => {
    switch (details.step) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl mb-10 text-center font-semibold">Sign Up</h2>
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
              onClick={() => setDetails({ ...details, step: 2 })} 
              className="w-full h-12 bg-primary hover:bg-primary/90 cursor-pointer text-white rounded-full flex items-center justify-center gap-2"
              disabled={!details.email}
            >
              Continue
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Tell Us Your Name</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-1">First Name</label>
                  <Input
                    id="firstName"
                    type="text"
                    className="h-10 sm:h-12 bg-gray-50 text-sm cursor-pointer"
                    placeholder="First Name"
                    value={details.firstName}
                    onChange={(e) => {
                      setDetails({ ...details, firstName: e.target.value });
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm mb-1">Last Name</label>
                  <Input
                    id="lastName"
                    type="text"
                    className="h-10 sm:h-12 bg-gray-50 text-sm cursor-pointer"
                    placeholder="Last Name"
                    value={details.lastName}
                    onChange={(e) => {
                      setDetails({ ...details, lastName: e.target.value });
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      +91
                    </div>
                    <Input
                      id="phoneNumber"
                      value={details.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          setDetails({ ...details, phoneNumber: value });
                        }
                      }}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="h-10 sm:h-12 bg-gray-50 pl-12 text-sm cursor-pointer"
                      placeholder="Enter 10-digit number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={sendOTP} 
              className="w-full h-12 bg-primary hover:bg-primary/90 cursor-pointer text-white rounded-full flex items-center justify-center gap-2"
              disabled={!details.firstName || !details.lastName || !details.phoneNumber || (isLoading && loadingType === 'otp')}
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
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-8 text-center">Verification</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">Enter the verification code sent to your email</p>
              <label htmlFor="otp" className="block text-sm mb-3 text-center font-medium">Enter OTP</label>
              <div className="flex gap-1 sm:gap-2 justify-center px-1 sm:px-2 py-4">
                {Array(6).fill(0).map((_, index) => (
                  <Input
                    key={index}
                    data-index={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="h-10 sm:h-14 w-10 sm:w-14 text-center bg-gray-50 text-base sm:text-xl font-medium px-0 cursor-pointer flex-shrink-0"
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
              onClick={submitForm} 
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
      <div id="clerk-captcha" style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true"></div>
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
      
      <div className="hidden md:block md:w-1/3 relative rounded-3xl bg-gray-900 overflow-hidden ml-4 h-full">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center h-full" 
                style={{ backgroundImage: `url(${image.src})` }}
              />
              
              <div className="absolute inset-0 bg-black/40 z-10" />
              <div className="absolute bottom-16 left-10 right-10 z-20 text-white">
                <h2 className="text-4xl font-normal text-white leading-10 mb-3" style={{ fontFamily: "var(--font-instrument-serif)" }}>{image.title}</h2>
                <p className="text-sm md:text-base">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
        
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
