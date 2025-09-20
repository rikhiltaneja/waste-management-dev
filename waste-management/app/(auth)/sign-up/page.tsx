"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface Details {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
}

export default function Page() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp();
  const [details, setDetails] = useState<Details>({
    email: "",
    otp: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    console.log(isLoaded);
    if (isLoaded) {
      console.log(signUp);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: details.otp,
    });
    console.log(signUpAttempt);

    if (signUpAttempt.status === 'complete') {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              return
            }

            // router.push('/dashboard')
          },
        })
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signUpAttempt)
      }
  };
  const sendOTP = async () => {
    await signUp.create({
      emailAddress: details.email,
      firstName: details.firstName,
      lastName: details.lastName,
    });

    await signUp.prepareEmailAddressVerification();
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <form
        onSubmit={(e) => {
          submitForm(e);
        }}
        className="flex flex-col gap-2"
      >
        <input
          onChange={(e) => {
            setDetails({ ...details, email: e.target.value });
          }}
          type="email"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="rikhiltaneja@gmail.com"
        />
        {/* <input
          onChange={(e) => {
            setDetails({ ...details, password: e.target.value });
          }}
          type="password"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="Secure password"
        /> */}
        <button type="button" onClick={sendOTP}>Send OTP</button>
        <input
          onChange={(e) => {
            setDetails({ ...details, otp: e.target.value });
          }}
          type="text"
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          placeholder="Secure password"
        />
        <input
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          onChange={(e) => {
            setDetails({ ...details, firstName: e.target.value });
          }}
        />
        <input
          className="min-w-0 px-1 grow text-base border border-solid border-black rounded-sm placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
          onChange={(e) => {
            setDetails({ ...details, lastName: e.target.value });
          }}
        />
        <button type="submit">Submit</button>
      </form>
      <div id="clerk-captcha" />
    </div>
  );
}
