"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SignInDetails {
  email: string;
  otp: string;
}

export default function SignUp() {
  const router = useRouter();

  const [details, setDetails] = useState<SignInDetails>({
    email: "",
    otp: "",
  });
  const { isLoaded, signIn, setActive } = useSignIn();

  const sendOTP = async () => {
    if (!signIn) {
      return null;
    }
    await signIn.create({
      identifier: details.email,
    });
    const firstFactor = signIn.supportedFirstFactors?.find(
      (f) => f.strategy === "email_code"
    );
    if (!firstFactor) {
      console.error("Email code factor not available!");
    } else {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: firstFactor.emailAddressId,
      });
    }
  };

  const verifyOTP = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
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
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <form
        onSubmit={(e) => {
          verifyOTP(e);
        }}
        className="flex flex-col gap-2"
      >
        <input
          onChange={(e) => {
            setDetails({ ...details, email: e.target.value });
          }}
          type="email"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="Email"
        />
        <button
          type="button"
          onClick={() => {
            sendOTP();
          }}
        >
          Send OTP
        </button>
        <input
          onChange={(e) => {
            setDetails({ ...details, otp: e.target.value });
          }}
          type="text"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="OTP"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
