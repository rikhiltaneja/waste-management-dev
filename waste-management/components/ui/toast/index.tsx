// icons
import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
import * as React from "react";
import { toast, Toaster } from "sonner";

// helper

// spinner
import { cn } from "@/lib/utils";
import { CircularBarSpinner } from "../spinners";

export type ToastType = "error" | "info" | "loading" | "success" | "warning";

type ActionItemsPromiseToastCallback<ToastData> = (
   data: ToastData,
) => React.JSX.Element;

type PromiseToastCallback<ToastData> = (data: ToastData) => string;
type PromiseToastData<ToastData> = {
   actionItems?: ActionItemsPromiseToastCallback<ToastData>;
   message?: PromiseToastCallback<ToastData>;
   title: string;
};

type PromiseToastOptions<ToastData> = {
   error: PromiseToastData<ToastData>;
   loading?: string;
   success: PromiseToastData<ToastData>;
};

type SetToastProps =
   | {
        actionItems?: React.ReactNode;
        id?: number | string;
        message?: string;
        title: string;
        type: Exclude<ToastType, "loading">;
     }
   | {
        title?: string;
        type: "loading";
     };

type ToastContentProps = {
   backgroundColorClassName: string;
   borderColorClassName: string;
   icon?: React.ReactNode;
   textColorClassName: string;
   toastId: number | string;
};

type ToastProps = {
   theme: "dark" | "light" | "system";
};

export const Toast = (props: ToastProps) => {
   const { theme } = props;
   return <Toaster gap={16} theme={theme} visibleToasts={5} />;
};

export const setToast = (props: SetToastProps) => {
   const renderToastContent = ({
      backgroundColorClassName,
      borderColorClassName,
      icon,
      textColorClassName,
      toastId,
   }: ToastContentProps) =>
      props.type === "loading" ? (
         <div
            className="flex h-[98px] w-[350px] items-center"
            data-prevent-outside-click
         >
            <div
               className={cn(
                  "w-full rounded-lg border p-2 shadow-sm",
                  backgroundColorClassName,
                  borderColorClassName,
               )}
               onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
               }}
            >
               <div className="flex h-full w-full items-center justify-center px-4 py-2">
                  {icon && (
                     <div className="flex items-center justify-center">
                        {icon}
                     </div>
                  )}
                  <div
                     className={cn(
                        "flex w-full items-center gap-0.5 pr-1",
                        icon ? "pl-4" : "pl-1",
                     )}
                  >
                     <div
                        className={cn(
                           "grow text-sm font-semibold",
                           textColorClassName,
                        )}
                     >
                        {props.title ?? "Loading..."}
                     </div>
                     <div className="flex-shrink-0">
                        <X
                           className="cursor-pointer text-toast-text-secondary hover:text-toast-text-tertiary"
                           height={14}
                           onClick={() => toast.dismiss(toastId)}
                           strokeWidth={1.5}
                           width={14}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      ) : (
         <div
            className={cn(
               "group relative flex w-[350px] flex-col rounded-lg border p-2 shadow-sm",
               backgroundColorClassName,
               borderColorClassName,
            )}
            data-prevent-outside-click
            onMouseDown={(e) => {
               e.stopPropagation();
               e.preventDefault();
            }}
         >
            <X
               className="fixed right-2.5 top-2 cursor-pointer text-toast-text-secondary hover:text-toast-text-tertiary"
               height={14}
               onClick={() => toast.dismiss(toastId)}
               strokeWidth={1.5}
               width={14}
            />
            <div className="flex w-full flex-col gap-2 p-2">
               <div className="flex w-full items-center">
                  {icon && (
                     <div className="flex items-center justify-center">
                        {icon}
                     </div>
                  )}
                  <div
                     className={cn(
                        "flex flex-col gap-0.5 pr-1",
                        icon ? "pl-4" : "pl-1",
                     )}
                  >
                     <div
                        className={cn(
                           "text-sm font-semibold",
                           textColorClassName,
                        )}
                     >
                        {props.title}
                     </div>
                     {props.message && (
                        <div className="text-xs font-medium text-toast-text-secondary">
                           {props.message}
                        </div>
                     )}
                  </div>
               </div>
               {props.actionItems && (
                  <div className="flex items-center pl-[32px]">
                     {props.actionItems}
                  </div>
               )}
            </div>
         </div>
      );

   switch (props.type) {
      case "error":
         return toast.custom(
            (toastId) =>
               renderToastContent({
                  backgroundColorClassName: "bg-toast-background-error",
                  borderColorClassName: "border-toast-border-error",
                  icon: (
                     <XCircle
                        className="text-toast-text-error"
                        height={24}
                        strokeWidth={1.5}
                        width={24}
                     />
                  ),
                  textColorClassName: "text-toast-text-error",
                  toastId,
               }),
            props.id ? { id: props.id } : {},
         );
      case "info":
         return toast.custom(
            (toastId) =>
               renderToastContent({
                  backgroundColorClassName: "bg-toast-background-info",
                  borderColorClassName: "border-toast-border-info",
                  textColorClassName: "text-toast-text-info",
                  toastId,
               }),
            props.id ? { id: props.id } : {},
         );
      case "loading":
         return toast.custom((toastId) =>
            renderToastContent({
               backgroundColorClassName: "bg-toast-background-loading",
               borderColorClassName: "border-toast-border-loading",
               icon: (
                  <CircularBarSpinner className="text-toast-text-tertiary" />
               ),
               textColorClassName: "text-toast-text-loading",
               toastId,
            }),
         );
      case "success":
         return toast.custom(
            (toastId) =>
               renderToastContent({
                  backgroundColorClassName: "bg-toast-background-success",
                  borderColorClassName: "border-toast-border-success",
                  icon: (
                     <CheckCircle2
                        className="text-toast-text-success"
                        height={24}
                        strokeWidth={1.5}
                        width={24}
                     />
                  ),
                  textColorClassName: "text-toast-text-success",
                  toastId,
               }),
            props.id ? { id: props.id } : {},
         );

      case "warning":
         return toast.custom(
            (toastId) =>
               renderToastContent({
                  backgroundColorClassName: "bg-toast-background-warning",
                  borderColorClassName: "border-toast-border-warning",
                  icon: (
                     <AlertTriangle
                        className="text-toast-text-warning"
                        height={24}
                        strokeWidth={1.5}
                        width={24}
                     />
                  ),
                  textColorClassName: "text-toast-text-warning",
                  toastId,
               }),
            props.id ? { id: props.id } : {},
         );
   }
};

export const setPromiseToast = <ToastData,>(
   promise: Promise<ToastData>,
   options: PromiseToastOptions<ToastData>,
): void => {
   const tId = setToast({ title: options.loading, type: "loading" });

   promise
      .then((data: ToastData) => {
         setToast({
            actionItems: options.success.actionItems?.(data),
            id: tId,
            message: options.success.message?.(data),
            title: options.success.title,
            type: "success",
         });
      })
      .catch((data: ToastData) => {
         setToast({
            actionItems: options.error.actionItems?.(data),
            id: tId,
            message: options.error.message?.(data),
            title: options.error.title,
            type: "error",
         });
      });
};
