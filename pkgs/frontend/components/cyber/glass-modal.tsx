"use client";

import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import * as React from "react";

const glassModalVariants = cva(
	"relative rounded-xl backdrop-blur-md border transition-all duration-300",
	{
		variants: {
			variant: {
				default: [
					"bg-white/10",
					"border-white/20",
					"shadow-lg shadow-cyan-500/20",
				],
				primary: [
					"bg-indigo-500/10",
					"border-indigo-400/30",
					"shadow-lg shadow-indigo-500/30",
				],
				secondary: [
					"bg-emerald-500/10",
					"border-emerald-400/30",
					"shadow-lg shadow-emerald-500/30",
				],
				accent: [
					"bg-cyan-500/10",
					"border-cyan-400/30",
					"shadow-lg shadow-cyan-500/30",
				],
			},
			glow: {
				true: "shadow-2xl",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			glow: false,
		},
	}
);

function GlassModal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="glass-modal" {...props} />;
}

function GlassModalTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="glass-modal-trigger" {...props} />;
}

function GlassModalPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="glass-modal-portal" {...props} />;
}

function GlassModalClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="glass-modal-close" {...props} />;
}

function GlassModalOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="glass-modal-overlay"
			className={cn(
				"fixed inset-0 z-50 backdrop-blur-sm bg-black/50",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				className
			)}
			{...props}
		/>
	);
}

export interface GlassModalContentProps
	extends React.ComponentProps<typeof DialogPrimitive.Content>,
		VariantProps<typeof glassModalVariants> {
	showCloseButton?: boolean;
}

function GlassModalContent({
	className,
	variant,
	glow,
	children,
	showCloseButton = true,
	...props
}: GlassModalContentProps) {
	return (
		<GlassModalPortal>
			<GlassModalOverlay />
			<DialogPrimitive.Content
				data-slot="glass-modal-content"
				className={cn(
					"fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-300 sm:max-w-lg",
					"data-[state=open]:animate-in data-[state=closed]:animate-out",
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
					"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
					"data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
					"data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
					glassModalVariants({ variant, glow }),
					className
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="glass-modal-close"
						className={cn(
							"absolute top-4 right-4 rounded-xs opacity-70 transition-all duration-200",
							"hover:opacity-100 hover:scale-110",
							"focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:outline-hidden",
							"disabled:pointer-events-none",
							"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
						)}
					>
						<XIcon className="text-white/70 hover:text-white" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</GlassModalPortal>
	);
}

function GlassModalHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="glass-modal-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function GlassModalFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="glass-modal-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className
			)}
			{...props}
		/>
	);
}

function GlassModalTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="glass-modal-title"
			className={cn(
				"text-lg leading-none font-semibold text-white",
				className
			)}
			{...props}
		/>
	);
}

function GlassModalDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="glass-modal-description"
			className={cn("text-sm text-white/70", className)}
			{...props}
		/>
	);
}

export {
    GlassModal,
    GlassModalClose,
    GlassModalContent,
    GlassModalDescription,
    GlassModalFooter,
    GlassModalHeader,
    GlassModalOverlay,
    GlassModalPortal,
    GlassModalTitle,
    GlassModalTrigger,
    glassModalVariants
};

