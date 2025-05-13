"use client";

import { CopyButton } from "./copy-button";

export function CopyButtonExample() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-xl font-semibold">CopyButton Component Examples</h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Default:</span>
          <CopyButton text="This text will be copied to clipboard" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">With custom message:</span>
          <CopyButton text="Custom success message example" successMessage="Custom text copied!" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Larger icon size:</span>
          <CopyButton text="Larger icon example" iconSize={24} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Shorter duration (1s):</span>
          <CopyButton text="Short duration example" duration={1000} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">No toast notification:</span>
          <CopyButton text="No toast example" showToast={false} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">With custom styles:</span>
          <CopyButton
            text="Custom styling example"
            className="bg-blue-100 hover:bg-blue-200 p-1 rounded-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Example with text display:</span>
          <div className="flex items-center p-2 bg-secondary rounded-md">
            <code className="text-sm mr-2">some-example-text-to-copy</code>
            <CopyButton text="some-example-text-to-copy" />
          </div>
        </div>
      </div>
    </div>
  );
}
